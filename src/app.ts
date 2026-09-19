import express from "express";
import { errorHandler } from "./middleware/error-handler.middleware.js";
import { roomRouter } from "./routes/room.routes.js";
import { bookingRouter } from "./routes/booking.routes.js";
import { paymentRouter } from "./routes/payment.routes.js";

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
  app.use("/bookings", bookingRouter);
  app.use("/payments", paymentRouter);

  app.use(errorHandler);

  return app;
}