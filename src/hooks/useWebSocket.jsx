import { useEffect } from "react";
import socket from "../websocket/Socket";

export default function useWebSocket(handleReceive) {
  useEffect(() => {
    socket.on("receiveMessage", handleReceive);
    return () => socket.off("receiveMessage", handleReceive);
  }, [handleReceive]);
}
