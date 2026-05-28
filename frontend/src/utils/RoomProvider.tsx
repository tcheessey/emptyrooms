import axios from "axios";
import { io, type Socket } from "socket.io-client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AuthContext, type AuthUser } from "./AuthProvider";

export type Coordinates = {
  x: number;
  y: number;
};

export type RoomData = {
  id: number;
  name: string;
  capacity: number;
  width: number;
  height: number;
};

export type RoomUser = {
  userData: AuthUser;
  coordinates: Coordinates;
};

type Direction = "x" | "y";

type RoomContextValue = {
  roomData: RoomData | null;
  usersInRoom: RoomUser[];
  myCoordinates: Coordinates;
  goToRoom: (roomId: number | null, callback: (data: { room: RoomData; user: RoomUser }) => void) => void;
  updateUsers: (data: RoomUser) => void;
  removeUserFromRoom: (id: number) => void;
  move: (dir: Direction, change: number) => void;
  socket: Socket;
};

export const RoomContext = createContext<RoomContextValue>({
  roomData: null,
  usersInRoom: [],
  myCoordinates: { x: 0, y: 0 },
  goToRoom: () => undefined,
  updateUsers: () => undefined,
  removeUserFromRoom: () => undefined,
  move: () => undefined,
  socket: io({ autoConnect: false }),
});

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const { userData } = useContext(AuthContext);
  const [activeRoom, setActiveRoom] = useState(1);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [usersInRoom, setUsersInRoom] = useState<RoomUser[]>([]);
  const [myCoordinates, setMyCoordinates] = useState<Coordinates>({ x: 0, y: 0 });
  const socket = useMemo(() => io({ autoConnect: false, withCredentials: true }), []);

  const goToRoom = useCallback((
    roomId: number | null,
    callback: (data: { room: RoomData; user: RoomUser }) => void
  ) => {
    const targetRoomId = roomId ?? activeRoom;
    setActiveRoom(targetRoomId);

    axios.get("/api/getRoom/" + targetRoomId).then((response) => {
      if (response.data.success) {
        const room = response.data.room as RoomData;
        setRoomData(room);

        if (!userData) {
          return;
        }

        callback({
          room,
          user: { userData, coordinates: myCoordinates },
        });
      } else {
        console.log(response.data.message);
      }
    });
  }, [activeRoom, myCoordinates, userData]);

  const updateUsers = useCallback((data: RoomUser) => {
    setUsersInRoom((currentUsers) => {
      const targetUser = currentUsers.find((u) => u.userData.id === data.userData.id);
      if (!targetUser) {
        return [...currentUsers, data];
      }

      return currentUsers.map((u) =>
        u.userData.id === data.userData.id ? { ...u, coordinates: data.coordinates } : u
      );
    });
  }, []);

  const removeUserFromRoom = useCallback((id: number) => {
    setUsersInRoom((currentUsers) => currentUsers.filter((u) => u.userData.id !== id));
  }, []);

  const move = useCallback((dir: Direction, change: number) => {
    if (!roomData || !userData) {
      return;
    }

    const maxNum = dir === "x" ? roomData.width : roomData.height;
    const nextCoordinates = {
      ...myCoordinates,
      [dir]: myCoordinates[dir] + change,
    };

    if (nextCoordinates[dir] > -1 && nextCoordinates[dir] < maxNum) {
      setMyCoordinates(nextCoordinates);
      socket.emit("shareUpdate", {
        room: roomData,
        user: { userData, coordinates: nextCoordinates },
      });
    }
  }, [myCoordinates, roomData, socket, userData]);

  const value = useMemo(
    () => ({
      roomData,
      usersInRoom,
      myCoordinates,
      goToRoom,
      updateUsers,
      removeUserFromRoom,
      move,
      socket,
    }),
    [
      goToRoom,
      move,
      myCoordinates,
      removeUserFromRoom,
      roomData,
      socket,
      updateUsers,
      usersInRoom,
    ]
  );

  return (
    <RoomContext.Provider value={value}>{children}</RoomContext.Provider>
  );
};
