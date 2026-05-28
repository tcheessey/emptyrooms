import { useEffect } from "react";
import { io } from "socket.io-client";

export default function useSockets() {
  useEffect(() => {
    const socket = io({ withCredentials: true });

    return () => {
      socket.disconnect();
    };
  }, []);
}
