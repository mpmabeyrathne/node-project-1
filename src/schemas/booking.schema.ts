import { z } from "zod";

export const createBookingSchema = z.object({
  body: z
    .object({
      userId: z.coerce.number().int().positive(),
      roomId: z.coerce.number().int().positive(),

      checkIn: z.iso.date(),
      checkOut: z.iso.date(),
    })
    .refine(
      (data) => {
        return new Date(data.checkOut) > new Date(data.checkIn);
      },
      {
        message: "Check-out must be after check-in",
        path: ["checkOut"],
      },
    ),
});

export const bookingIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});