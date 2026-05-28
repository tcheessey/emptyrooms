import { db } from "../database.js";

type RoomRow = {
  id: number;
  name: string;
  capacity: number;
  width: number;
  height: number;
};

export const roomsController = {
  async getRoomById(id: number) {
    return db<RoomRow>("rooms").where({ id }).first();
  },
};
