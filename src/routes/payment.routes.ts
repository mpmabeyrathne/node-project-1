import { Router } from "express";

import {
    mockPaymentSuccessController,
} from "../controllers/mock-payment.controller.js";

import {
    createPaymentIntentController,
} from "../controllers/payment.controller.js";

export const paymentRouter = Router();

paymentRouter.post(
    "/:bookingId/intent",
    createPaymentIntentController,
);

paymentRouter.post(
    "/mock/:paymentId/succeed",
    mockPaymentSuccessController,
  );