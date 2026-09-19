import { Router } from "express";

import {
  createRoomController,
  deleteRoomController,
  getRoomController,
  getRoomsController,
  updateRoomController,
} from "../controllers/room.controller.js";

import { validate } from "../middleware/validate.middleware.js";

import {
  createRoomSchema,
  roomIdSchema,
  updateRoomSchema,
} from "../schemas/room.schema.js";

export const roomRouter = Router();

roomRouter.post(
  "/",
  validate(createRoomSchema),
  createRoomController,
);

roomRouter.get(
  "/",
  getRoomsController,
);

roomRouter.get(
  "/:id",
  validate(roomIdSchema),
  getRoomController,
);

roomRouter.patch(
  "/:id",
  validate(updateRoomSchema),
  updateRoomController,
);

roomRouter.delete(
  "/:id",
  validate(roomIdSchema),
  deleteRoomController,
);