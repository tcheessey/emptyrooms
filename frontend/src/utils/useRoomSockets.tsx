import React, { useContext, useEffect } from "react";
import RoomGrid from "../components/Home/room/RoomGrid";
import Spinner from "../components/Spinner";
import { AuthContext } from "./AuthProvider";
import { RoomContext } from "./RoomProvider";

export default function Room() {
  const { userData } = useContext(AuthContext);
  const {
    roomData,
    myCoordinates,
    goToRoom,
    updateUsers,
    socket,
    removeUserFromRoom,
  } = useContext(RoomContext);

  // sockets
  useEffect(() => {
    goToRoom(null, (myData) => {
      socket.emit("joinedRoom", myData);
    });
  }, []);
  socket.on("shareData", (data) => {
    updateUsers(data.user);
    socket.emit("shareResponse", {
      socket: data.id,
      data: { userData, coordinates: myCoordinates },
    });
  });
  socket.on("receiveShareResponse", (data) => {
    updateUsers(data);
  });
  socket.on("receiveUpdate", (data) => {
    updateUsers(data);
  });
  socket.on("userLeft", ({ id }) => {
    if (id) {
      removeUserFromRoom(id);
    }
  });

  return <div className='room'>{roomData ? <RoomGrid /> : <Spinner />}</div>;
}
