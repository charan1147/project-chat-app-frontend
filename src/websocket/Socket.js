import { io } from "socket.io-client";

const URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5016";
const socket = io(URL, { autoConnect: false, withCredentials: true });

export default socket;
