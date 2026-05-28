import type { Server, Socket } from "socket.io";

type JoinedRoomPayload = {
  user: { userData: { id: number } };
  room: { name: string };
};

type ShareResponsePayload = {
  socket: string;
  data: unknown;
};

type RoomMessagePayload = {
  room: string;
};

type ShareUpdatePayload = {
  room: { name: string };
  user: unknown;
};

export const setSockets = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    socket.on("disconnecting", () => {
      socket.broadcast.emit("userLeft", { id: socket.data.userId });
    });

    socket.on("joinedRoom", ({ user, room }: JoinedRoomPayload) => {
      socket.data.userId = user.userData.id;
      socket.join(room.name);
      socket.to(room.name).emit("shareData", { id: socket.id, user });
    });

    socket.on("shareResponse", (data: ShareResponsePayload) => {
      io.to(data.socket).emit("receiveShareResponse", data.data);
    });

    socket.on("messageSent", (data: RoomMessagePayload) => {
      io.to(data.room).emit("newMessage", data);
    });

    socket.volatile.on("shareUpdate", (data: ShareUpdatePayload) => {
      socket.to(data.room.name).emit("receiveUpdate", data.user);
    });
  });
};
