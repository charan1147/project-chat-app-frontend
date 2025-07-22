import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default {
  getMe: () => api.get("/users/me"),
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (name, email, password) =>
    api.post("/auth/register", { name, email, password }),
  getContacts: () => api.get("/users/contacts"),
  addContact: (email) => api.post("/users/add-contact", { email }),
  getMessages: (contactId) => api.get(`/messages/${contactId}`),
  sendMessage: (receiverId, content) =>
    api.post("/messages/send", { receiverId, content }),
  startCall: (receiverId, roomId, signalData, callType = "video") =>
    api.post("/call/start", { receiverId, roomId, signalData, callType }),
  answerCall: (roomId, signalData) =>
    api.post("/call/answer", { roomId, signalData }),
  endCall: (roomId) => api.post("/call/end", { roomId }),
  logout: () => api.post("/auth/logout"),
};

export function getRoomId(user1, user2) {
  if (!user1 || !user2) throw new Error("Invalid user IDs");
  return [String(user1), String(user2)].sort().join("_");
}
