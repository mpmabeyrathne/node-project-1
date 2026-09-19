import { Op } from "sequelize";

import {
  Booking,
  Room,
  User,
} from "../models/index.js";

export interface CreateBookingData {
  userId: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
}

export async function findBookingUser(id: number) {
  return User.findByPk(id);
}

export async function findBookingRoom(id: number) {
  return Room.findByPk(id);
}

export async function findOverlappingBooking(
  roomId: number,
  checkIn: string,
  checkOut: string,
) {
  return Booking.findOne({
    where: {
      roomId,

      status: {
        [Op.in]: ["PENDING", "CONFIRMED"],
      },

      checkIn: {
        [Op.lt]: checkOut,
      },

      checkOut: {
        [Op.gt]: checkIn,
      },
    },
  });
}

export async function createBooking(
  data: CreateBookingData,
) {
  return Booking.create({
    userId: data.userId,
    roomId: data.roomId,
    checkIn: data.checkIn,
    checkOut: data.checkOut,
    totalAmount: String(data.totalAmount),
    status: "PENDING",
  });
}

export async function findBookingById(id: number) {
  return Booking.findByPk(id, {
    include: [
      {
        model: Room,
        as: "room",
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email"],
      },
    ],
  });
}

export async function findAllBookings() {
  return Booking.findAll({
    include: [
      {
        model: Room,
        as: "room",
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email"],
      },
    ],

    order: [["id", "DESC"]],
  });
}