import React, { useEffect } from "react";
import Controls from "./components/Controls.js";
import Room from "./components/Room.js";
import { RoomProvider } from "./utils/RoomProvider.js";

export default function Home() {
  // const socket = io.connect("http://localhost:3000");
  return (
    <>
      <Controls />
      <RoomProvider>
        <Room />
      </RoomProvider>
    </>
  );
}
