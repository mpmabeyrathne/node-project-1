import { Room } from "../models/index.js";

export interface CreateRoomData {
  name: string;
  description?: string | null;
  pricePerNight: number;
  status?: "AVAILABLE" | "UNAVAILABLE";
}

export interface UpdateRoomData {
  name?: string;
  description?: string | null;
  pricePerNight?: number;
  status?: "AVAILABLE" | "UNAVAILABLE";
}

export async function createRoom(
  data: CreateRoomData,
) {
  return Room.create({
    name: data.name,
    description: data.description ?? null,
    pricePerNight: String(data.pricePerNight),
    status: data.status ?? "AVAILABLE",
  });
}

export async function findAllRooms() {
  return Room.findAll({
    order: [["id", "ASC"]],
  });
}

export async function findRoomById(id: number) {
  return Room.findByPk(id);
}

export async function updateRoom(
  room: Room,
  data: UpdateRoomData,
) {
  return room.update({
    ...(data.name !== undefined && {
      name: data.name,
    }),

    ...(data.description !== undefined && {
      description: data.description,
    }),

    ...(data.pricePerNight !== undefined && {
      pricePerNight: String(data.pricePerNight),
    }),

    ...(data.status !== undefined && {
      status: data.status,
    }),
  });
}

export async function deleteRoom(room: Room) {
  await room.destroy();
}