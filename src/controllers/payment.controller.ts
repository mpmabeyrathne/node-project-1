import type {
    Request,
    Response,
  } from "express";
  
  import {
    createPaymentIntentService,
  } from "../services/payment.service.js";
  
  export async function createPaymentIntentController(
    req: Request,
    res: Response,
  ) {
    const bookingId =
      Number(req.params.bookingId);
  
    const payment =
      await createPaymentIntentService(
        bookingId,
      );
  
    res.status(201).json({
      data: {
        paymentId: payment.id,
        reference:
          payment.stripePaymentIntentId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
      },
    });
  }