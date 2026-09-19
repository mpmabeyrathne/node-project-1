import express from "express";

import { roomRouter } from "./routes/room.routes.js";
import { errorHandler } from "./middleware/error-handler.middleware.js";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/", (_req, res) => {
    res.status(200).json({
      message: "Booking System API",
    });
  });

  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
    });
  });

  app.use("/rooms", roomRouter);

  app.use(errorHandler);

  return app;
}