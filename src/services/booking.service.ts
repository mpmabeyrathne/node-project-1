import { AppError } from "../errors/app-error.js";

import {
  createBooking,
  findAllBookings,
  findBookingById,
  findBookingRoom,
  findBookingUser,
  findOverlappingBooking,
} from "../repositories/booking.repository.js";

interface CreateBookingInput {
  userId: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
}

function calculateNights(
  checkIn: string,
  checkOut: string,
) {
  const start = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);

  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  return (
    (end.getTime() - start.getTime()) /
    millisecondsPerDay
  );
}

export async function createBookingService(
  data: CreateBookingInput,
) {
  const user = await findBookingUser(data.userId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const room = await findBookingRoom(data.roomId);

  if (!room) {
    throw new AppError(404, "Room not found");
  }

  if (room.status !== "AVAILABLE") {
    throw new AppError(409, "Room is unavailable");
  }

  const overlappingBooking =
    await findOverlappingBooking(
      data.roomId,
      data.checkIn,
      data.checkOut,
    );

  if (overlappingBooking) {
    throw new AppError(
      409,
      "Room is already booked for the selected dates",
    );
  }

  const nights = calculateNights(
    data.checkIn,
    data.checkOut,
  );

  const totalAmount =
    nights * Number(room.pricePerNight);

  return createBooking({
    ...data,
    totalAmount,
  });
}

export async function getBookingService(id: number) {
  const booking = await findBookingById(id);

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  return booking;
}

export async function getBookingsService() {
  return findAllBookings();
}