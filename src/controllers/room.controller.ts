import type {
    Request,
    Response,
  } from "express";
  
  import {
    createRoomService,
    deleteRoomService,
    getRoomService,
    getRoomsService,
    updateRoomService,
  } from "../services/room.service.js";
  
  export async function createRoomController(
    req: Request,
    res: Response,
  ) {
    const room = await createRoomService(req.body);
  
    res.status(201).json({
      data: room,
    });
  }
  
  export async function getRoomsController(
    _req: Request,
    res: Response,
  ) {
    const rooms = await getRoomsService();
  
    res.status(200).json({
      data: rooms,
    });
  }
  
  export async function getRoomController(
    req: Request,
    res: Response,
  ) {
    const id = Number(req.params.id);
  
    const room = await getRoomService(id);
  
    res.status(200).json({
      data: room,
    });
  }
  
  export async function updateRoomController(
    req: Request,
    res: Response,
  ) {
    const id = Number(req.params.id);
  
    const room = await updateRoomService(
      id,
      req.body,
    );
  
    res.status(200).json({
      data: room,
    });
  }
  
  export async function deleteRoomController(
    req: Request,
    res: Response,
  ) {
    const id = Number(req.params.id);
  
    await deleteRoomService(id);
  
    res.status(204).send();
  }