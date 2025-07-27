import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5016/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (
      token &&
      config.url !== "/auth/login" &&
      config.url !== "/auth/register"
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {

    console.error("Request error:", error.message);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "Response error:",
      error.response?.data?.message || error.message
    );
    return Promise.reject(error);
  }
);

export default {
  getMe: () => api.get("/auth/me"),
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
  getContacts: () => api.get("/contact/contacts"),
  addContact: (email) => api.post("/contact/add-contact", { email }),
  getMessages: (
    contactId,
    page = 1,
    limit = 50 
  ) => api.get(`/messages/${contactId}?page=${page}&limit=${limit}`),
  sendMessage: (receiverId, content) =>
    api.post("/messages/send", { receiverId, content }),
  startCall: (
    receiverId,
    signalData,
    callType = "video" 
  ) => api.post("/call/start", { receiverId, signalData, callType }),
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
