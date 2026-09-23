import type { Server } from "node:http";

import { createApp } from "./app.js";
import {
    env,
    sequelize,
    redis,
    connectRabbitMQ,
    closeRabbitMQ,
} from "./config/index.js";

import "./models/index.js";

let server: Server | null = null;
let isShuttingDown = false;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("Database connection established");

        await redis.connect();
        console.log("Redis connection established");

        await connectRabbitMQ();
        console.log("RabbitMQ connection established");

        const app = createApp();

        server = app.listen(env.PORT, env.HOST, () => {
            console.log(
                `Server running on http://${env.HOST}:${env.PORT}`,
            );
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

async function shutdown(signal: string) {
    if (isShuttingDown) {
        return;
    }

    isShuttingDown = true;

    console.log(
        `${signal} received. Starting graceful shutdown...`,
    );

    const forceShutdownTimer = setTimeout(() => {
        console.error("Graceful shutdown timed out");
        process.exit(1);
    }, 10_000);

    forceShutdownTimer.unref();

    try {
        if (server) {
            await new Promise<void>((resolve, reject) => {
                server!.close((error) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();
                });
            });

            console.log("HTTP server closed");
        }

        await closeRabbitMQ();
        console.log("RabbitMQ connection closed");

        if (redis.isOpen) {
            await redis.quit();
            console.log("Redis connection closed");
        }

        await sequelize.close();
        console.log("Database connection closed");

        clearTimeout(forceShutdownTimer);

        console.log("Graceful shutdown complete");

        process.exit(0);
    } catch (error) {
        clearTimeout(forceShutdownTimer);

        console.error("Graceful shutdown failed:", error);

        process.exit(1);
    }
}

process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
    void shutdown("SIGINT");
});

void startServer();