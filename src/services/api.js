import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Interceptor to add JWT token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  getMe: () => api.get("/users/me"),
  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  },
  register: async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  },
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
  logout: () => {
    localStorage.removeItem("token");
    return api.post("/auth/logout");
  },
};

export function getRoomId(user1, user2) {
  if (!user1 || !user2) throw new Error("Invalid user IDs");
  return [String(user1), String(user2)].sort().join("_");
}
