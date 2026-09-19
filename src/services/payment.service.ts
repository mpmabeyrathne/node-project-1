import crypto from "node:crypto";

import {
  createPaymentRecord,
  findPaymentBooking,
  findPaymentByBookingId,
} from "../repositories/payment.repository.js";

import { AppError } from "../errors/app-error.js";

export async function createPaymentIntentService(
  bookingId: number,
) {
  const booking =
    await findPaymentBooking(bookingId);

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  if (booking.status !== "PENDING") {
    throw new AppError(
      409,
      "Booking is not awaiting payment",
    );
  }

  let payment =
    await findPaymentByBookingId(bookingId);

  if (payment) {
    return payment;
  }

  payment = await createPaymentRecord(
    booking.id,
    booking.totalAmount,
  );

  const reference =
    `mock_${crypto.randomUUID()}`;

  payment.stripePaymentIntentId = reference;

  await payment.save();

  return payment;
}