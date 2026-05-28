import express from "express";
import { roomsController } from "../controllers/rooms.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requiresAuth } from "../middleware/requiresAuth.js";

export const roomsRouter = express.Router();

roomsRouter.get(
  "/getRoom/:id",
  requiresAuth,
  asyncHandler(async (request, response) => {
    const roomId = Number(request.params.id);
    if (!Number.isInteger(roomId) || roomId < 1) {
      response.status(400).json({ success: false, message: "Invalid room id" });
      return;
    }

    const room = await roomsController.getRoomById(roomId);
    if (!room) {
      response.status(404).json({ success: false, message: "Room not found" });
      return;
    }

    response.json({ success: true, room });
  })
);
