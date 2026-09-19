import { z } from "zod";

export const createRoomSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),

    description: z.string().max(1000).nullable().optional(),

    pricePerNight: z.coerce.number().positive(),

    status: z
      .enum(["AVAILABLE", "UNAVAILABLE"])
      .default("AVAILABLE"),
  }),
});

export const updateRoomSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).max(100).optional(),

      description: z.string().max(1000).nullable().optional(),

      pricePerNight: z.coerce.number().positive().optional(),

      status: z.enum(["AVAILABLE", "UNAVAILABLE"]).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    }),

  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export const roomIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});