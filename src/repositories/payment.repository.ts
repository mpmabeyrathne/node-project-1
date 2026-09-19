import type { Transaction } from "sequelize";

import {
  Booking,
  Payment,
} from "../models/index.js";

export async function findPaymentBooking(
  bookingId: number,
) {
  return Booking.findByPk(bookingId);
}

export async function findPaymentByBookingId(
  bookingId: number,
) {
  return Payment.findOne({
    where: {
      bookingId,
    },
  });
}

export async function findPaymentById(
  paymentId: number,
  transaction?: Transaction,
) {
  return Payment.findByPk(paymentId, {
    transaction,
  });
}

export async function createPaymentRecord(
  bookingId: number,
  amount: string,
) {
  return Payment.create({
    bookingId,
    stripePaymentIntentId: null,
    amount,
    currency: "usd",
    status: "PENDING",
  });
}