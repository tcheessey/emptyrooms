export default (io) => {
  io.on("connection", (socket) => {
    socket.on("disconnecting", () => {
      console.log(socket.userId);
      socket.broadcast.emit("userLeft", { id: socket.userId });
    });

    socket.on("joinedRoom", ({ user, room }) => {
      socket.userId = user.userData.id;
      socket.join(room.name);
      console.log(` ${socket.id} just logged in`);
      socket.to(room.name).emit("shareData", { id: socket.id, user: user });
    });
    socket.on("shareResponse", (data) => {
      io.to(data.socket).emit("receiveShareResponse", data.data);
    });
    socket.on("messageSent", (data) => {
      io.to(data.room).emit("newMessage", data);
    });
    socket.volatile.on("shareUpdate", (data) => {
      socket.to(data.room.name).emit("receiveUpdate", data.user);
    });
  });
};
