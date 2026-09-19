import { AppError } from "../errors/app-error.js";
import {
    deleteCache,
    getCache,
    setCache,
} from "./cache.service.js";

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

    const cacheKey = `room:${id}`;

    const cachedRoom =
        await getCache<unknown>(cacheKey);

    if (cachedRoom) {
        console.log("CACHE HIT:", cacheKey);

        return cachedRoom;
    }

    console.log("CACHE MISS:", cacheKey);

    const room = await findRoomById(id);

    if (!room) {
        throw new AppError(404, "Room not found");
    }

    const roomData = room.toJSON();

    await setCache(
        cacheKey,
        roomData,
        60,
    );

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
  
    const updatedRoom =
      await updateRoom(room, data);
  
    await deleteCache(`room:${id}`);
  
    return updatedRoom;
  }

export async function deleteRoomService(id: number) {
    const room = await findRoomById(id);

    if (!room) {
        throw new AppError(404, "Room not found");
    }

    await deleteRoom(room);

    await deleteCache(`room:${id}`);
}