import { createApp } from "./app.js";
import { env, sequelize, redis, connectRabbitMQ } from "./config/index.js";
import "./models/index.js";

async function startServer() {
    try {
        await sequelize.authenticate();

        console.log("Database connection established");

        await redis.connect();

        console.log("Redis connection established");

        await connectRabbitMQ();

        console.log(
          "RabbitMQ connection established",
        );

        const app = createApp();

        app.listen(env.PORT, env.HOST, () => {
            console.log(
                `Server running on http://${env.HOST}:${env.PORT}`,
            );
        });
    } catch (error) {
        console.error("Failed to start server:", error);

        process.exit(1);
    }
}

startServer();