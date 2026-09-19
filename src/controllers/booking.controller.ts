import type {
    Request,
    Response,
  } from "express";
  
  import {
    createBookingService,
    getBookingService,
    getBookingsService,
  } from "../services/booking.service.js";
  
  export async function createBookingController(
    req: Request,
    res: Response,
  ) {
    const booking =
      await createBookingService(req.body);
  
    res.status(201).json({
      data: booking,
    });
  }
  
  export async function getBookingController(
    req: Request,
    res: Response,
  ) {
    const booking = await getBookingService(
      Number(req.params.id),
    );
  
    res.status(200).json({
      data: booking,
    });
  }
  
  export async function getBookingsController(
    _req: Request,
    res: Response,
  ) {
    const bookings =
      await getBookingsService();
  
    res.status(200).json({
      data: bookings,
    });
  }