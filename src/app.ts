import express from "express";
import { errorHandler } from "./middleware/error-handler.middleware.js";
import { roomRouter } from "./routes/room.routes.js";
import { bookingRouter } from "./routes/booking.routes.js";
import { paymentRouter } from "./routes/payment.routes.js";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";

import { redis } from "./config/index.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(helmet());

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
    });
  });

  const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 120,

    standardHeaders: true,
    legacyHeaders: false,

    store: new RedisStore({
      sendCommand: (...args: string[]) =>
        redis.sendCommand(args),
      prefix: "rate-limit:",
    }),

    message: {
      message: "Too many requests. Please try again later.",
    },
  });

  app.use(apiLimiter);

  app.use("/rooms", roomRouter);
  app.use("/bookings", bookingRouter);
  app.use("/payments", paymentRouter);

  app.use(errorHandler);

  return app;
}