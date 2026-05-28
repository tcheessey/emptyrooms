import Controls from "../components/Controls";
import Room from "../components/Room";
import { RoomProvider } from "../utils/RoomProvider";

export default function Home() {
  return (
    <>
      <Controls />
      <RoomProvider>
        <Room />
      </RoomProvider>
    </>
  );
}
