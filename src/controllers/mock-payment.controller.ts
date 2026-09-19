import type {
    Request,
    Response,
  } from "express";
  
  import {
    env,
    sequelize,
  } from "../config/index.js";
  
  import {
    findPaymentById,
  } from "../repositories/payment.repository.js";
  
  import { Booking } from "../models/index.js";
  
  export async function mockPaymentSuccessController(
    req: Request,
    res: Response,
  ) {
    const secret =
      req.headers["x-mock-payment-secret"];
  
    if (
      secret !==
      env.MOCK_PAYMENT_WEBHOOK_SECRET
    ) {
      res.status(401).json({
        message: "Invalid payment webhook secret",
      });
  
      return;
    }
  
    const paymentId =
      Number(req.params.paymentId);
  
    await sequelize.transaction(
      async (transaction) => {
        const payment =
          await findPaymentById(
            paymentId,
            transaction,
          );
  
        if (!payment) {
          throw new Error("Payment not found");
        }
  
        if (payment.status === "PAID") {
          return;
        }
  
        payment.status = "PAID";
  
        await payment.save({
          transaction,
        });
  
        const booking =
          await Booking.findByPk(
            payment.bookingId,
            {
              transaction,
            },
          );
  
        if (!booking) {
          throw new Error("Booking not found");
        }
  
        booking.status = "CONFIRMED";
  
        await booking.save({
          transaction,
        });
      },
    );
  
    res.status(200).json({
      received: true,
    });
  }