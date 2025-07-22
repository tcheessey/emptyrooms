import axios from "axios";
import io from "socket.io-client";
import React, { createContext, useContext, useState } from "react";
import { AuthContext } from "./AuthProvider.js";

export const RoomContext = createContext({
  roomData: null,
  usersInRoom: [],
  myCoordinates: { x: 0, y: 0 },
  socket: io.connect("http://localhost:3000"),
});

export const RoomProvider = ({ children }) => {
  const { userData } = useContext(AuthContext);
  const [activeRoom, setActiveRoom] = useState(1);
  const [roomData, setRoomData] = useState(null);
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [myCoordinates, setMyCoordinates] = useState({ x: 0, y: 0 });
  const [socket, setSocket] = useState(io.connect("http://localhost:3000"));

  const goToRoom = (roomId, callback) => {
    if (roomId) {
      setActiveRoom(roomId);
    }
    axios.get("/getRoom/" + activeRoom).then((response) => {
      if (response.data.success) {
        setRoomData((data) => ({
          ...data,
          ...response.data.room,
        }));
        callback({
          room: response.data.room,
          user: { userData, coordinates: myCoordinates },
        });
      } else {
        console.log(response.data.message);
      }
    });
  };

  const updateUsers = (data) => {
    // data: { userData:..., coordinates: myCoordinates }
    let targetUser;
    if (usersInRoom.length > 0) {
      targetUser = usersInRoom.find((u) => u.userData.id === data.userData.id);
    }
    if (targetUser) {
      setUsersInRoom(
        usersInRoom.map((u) => {
          if (u.userData.id === data.userData.id) {
            return { ...u, coordinates: data.coordinates };
          }
          return u;
        })
      );
    } else {
      setUsersInRoom([...usersInRoom, data]);
    }
  };

  const removeUserFromRoom = (id) => {
    console.log("remove", id);
    setUsersInRoom(usersInRoom.filter((u) => u.userData.id != id));
  };

  const move = (dir, change) => {
    let coords = myCoordinates;
    let maxNum = dir === "x" ? roomData.width : roomData.height;
    if (coords[dir] + change > -1 && coords[dir] + change < maxNum) {
      coords[dir] += change;
      setMyCoordinates((myCoordinates) => ({
        ...myCoordinates,
        ...coords,
      }));
      socket.emit("shareUpdate", {
        room: roomData,
        user: { userData, coordinates: myCoordinates },
      });
    }
  };
  return (
    <RoomContext.Provider
      value={{
        roomData,
        usersInRoom,
        myCoordinates,
        goToRoom,
        updateUsers,
        removeUserFromRoom,
        move,
        socket,
        setSocket,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
