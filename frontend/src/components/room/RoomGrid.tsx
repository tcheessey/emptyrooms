import { useCallback, useContext, useEffect, useMemo, type ReactNode } from "react";
import { RoomContext, type RoomData } from "../../utils/RoomProvider";
import RoomTile from "./RoomTile";

type RoomGridProps = {
  roomData: RoomData;
};

export default function RoomGrid({ roomData }: RoomGridProps) {
  const { move } = useContext(RoomContext);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowUp":
        move("y", -1);
        break;
      case "ArrowDown":
        move("y", 1);
        break;
      case "ArrowLeft":
        move("x", -1);
        break;
      case "ArrowRight":
        move("x", 1);
        break;
    }
  }, [move]);

  const tiles = useMemo(() => {
    const rows: ReactNode[][] = [];
    let key = 0;
    for (let i = 0; i < roomData.height; i++) {
      const row: ReactNode[] = [];
      for (let j = 0; j < roomData.width; j++) {
        row.push(<RoomTile x={j} y={i} key={key++} />);
      }
      rows.push(row);
    }
    return rows;
  }, [roomData.height, roomData.width]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className='room__grid'>
      {tiles.map((row, index) => (
        <div className='room__grid__row' key={index}>
          {row}
        </div>
      ))}
    </div>
  );
}
