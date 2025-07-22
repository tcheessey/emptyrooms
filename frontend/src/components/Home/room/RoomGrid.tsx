import React, { useContext, useEffect, useState } from "react";
import { RoomContext } from "../../utils/RoomProvider";
import RoomTile from "./RoomTile";

export default function RoomGrid() {
  const { roomData, move } = useContext(RoomContext);

  const handleKeyPress = (e) => {
    switch (e.keyCode) {
      case 38:
        //  up
        move("y", -1);
        break;
      case 40:
        // down
        move("y", 1);
        break;
      case 37:
        // left
        move("x", -1);
        break;
      case 39:
        // right
        move("x", 1);
        break;
    }
  };

  const createTiles = () => {
    let arr = [];
    let key = 0;
    for (let i = 0; i < roomData.height; i++) {
      arr.push([]);
      for (let j = 0; j < roomData.width; j++) {
        arr[i].push(<RoomTile x={j} y={i} key={key++} />);
      }
    }
    return arr;
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });
  return (
    <div className='room__grid'>
      {createTiles().map((row, index) => (
        <div className='room__grid__row' key={index}>
          {row}
        </div>
      ))}
    </div>
  );
}
