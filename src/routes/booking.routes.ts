import { Router } from "express";

import {
  createBookingController,
  getBookingController,
  getBookingsController,
} from "../controllers/booking.controller.js";

import { validate } from "../middleware/validate.middleware.js";

import {
  bookingIdSchema,
  createBookingSchema,
} from "../schemas/booking.schema.js";

export const bookingRouter = Router();

bookingRouter.post(
  "/",
  validate(createBookingSchema),
  createBookingController,
);

bookingRouter.get(
  "/",
  getBookingsController,
);

bookingRouter.get(
  "/:id",
  validate(bookingIdSchema),
  getBookingController,
);