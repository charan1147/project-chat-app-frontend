import { io } from "socket.io-client";

const URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5016";
const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
  auth: (cb) => {
    const token = localStorage.getItem("token");
    cb({ token: token ? `Bearer ${token}` : null });
  },
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
  socket.emit("connectionError", error.message);
});

socket.on("reconnect_attempt", () => {
  console.log("Attempting to reconnect...");
});

export default socket;
