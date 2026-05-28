import { useContext, useEffect, useRef } from "react";
import RoomCanvas from "./room/RoomCanvas";
import Spinner from "./Spinner";
import { AuthContext } from "../utils/AuthProvider";
import { RoomContext, type RoomUser } from "../utils/RoomProvider";

type ShareDataPayload = {
  id: string;
  user: RoomUser;
};

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
  const hasJoinedRoomRef = useRef(false);
  const myCoordinatesRef = useRef(myCoordinates);

  useEffect(() => {
    myCoordinatesRef.current = myCoordinates;
  }, [myCoordinates]);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    if (hasJoinedRoomRef.current) {
      return;
    }

    hasJoinedRoomRef.current = true;
    goToRoom(null, (myData) => {
      socket.emit("joinedRoom", myData);
    });
  }, [goToRoom, socket]);

  useEffect(() => {
    const handleShareData = (data: ShareDataPayload) => {
      updateUsers(data.user);

      if (!userData) {
        return;
      }

      socket.emit("shareResponse", {
        socket: data.id,
        data: { userData, coordinates: myCoordinatesRef.current },
      });
    };

    const handleReceiveUser = (data: RoomUser) => updateUsers(data);
    const handleUserLeft = ({ id }: { id?: number }) => {
      if (id) {
        removeUserFromRoom(id);
      }
    };

    socket.on("shareData", handleShareData);
    socket.on("receiveShareResponse", handleReceiveUser);
    socket.on("receiveUpdate", handleReceiveUser);
    socket.on("userLeft", handleUserLeft);

    return () => {
      socket.off("shareData", handleShareData);
      socket.off("receiveShareResponse", handleReceiveUser);
      socket.off("receiveUpdate", handleReceiveUser);
      socket.off("userLeft", handleUserLeft);
    };
  }, [removeUserFromRoom, socket, updateUsers, userData]);

  return (
    <div className='room'>
      {roomData ? <RoomCanvas roomData={roomData} /> : <Spinner />}
    </div>
  );
}
