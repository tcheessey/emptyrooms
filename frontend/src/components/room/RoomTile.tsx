import { useContext, useMemo } from "react";
import { RoomContext } from "../../utils/RoomProvider";
import Avatar from "../Avatar";

type RoomTileProps = {
  x: number;
  y: number;
};

export default function RoomTile({ x, y }: RoomTileProps) {
  const { myCoordinates, usersInRoom } = useContext(RoomContext);
  const isActive = myCoordinates.x === x && myCoordinates.y === y;

  const usersOnTile = useMemo(
    () =>
      usersInRoom.filter((u) => {
        return u.coordinates.x === x && u.coordinates.y === y;
      }),
    [usersInRoom, x, y]
  );

  return (
    <div className={`${isActive ? "active" : ""} room__grid__tile`}>
      {isActive && <Avatar />}
      {usersOnTile.map((user) => (
        <p key={user.userData.id}>{user.userData.username}</p>
      ))}
    </div>
  );
}
