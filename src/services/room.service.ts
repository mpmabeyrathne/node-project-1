import { AppError } from "../errors/app-error.js";

import {
  createRoom,
  deleteRoom,
  findAllRooms,
  findRoomById,
  updateRoom,
  type CreateRoomData,
  type UpdateRoomData,
} from "../repositories/room.repository.js";

export async function createRoomService(
  data: CreateRoomData,
) {
  return createRoom(data);
}

export async function getRoomsService() {
  return findAllRooms();
}

export async function getRoomService(id: number) {
  const room = await findRoomById(id);

  if (!room) {
    throw new AppError(404, "Room not found");
  }

  return room;
}

export async function updateRoomService(
  id: number,
  data: UpdateRoomData,
) {
  const room = await findRoomById(id);

  if (!room) {
    throw new AppError(404, "Room not found");
  }

  return updateRoom(room, data);
}

export async function deleteRoomService(id: number) {
  const room = await findRoomById(id);

  if (!room) {
    throw new AppError(404, "Room not found");
  }

  await deleteRoom(room);
}