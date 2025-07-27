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
      try {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Request with token:", {
          url: config.url,
          authorization: config.headers.Authorization,
          data: config.data,
        });
        // Basic JWT format check
        const [header, payload, signature] = token.split(".");
        if (!header || !payload || !signature) {
          console.warn("Invalid token format:", token);
          localStorage.removeItem("token");
          throw new Error("Invalid token format");
        }
      } catch (err) {
        console.error("Token processing error:", err.message);
        localStorage.removeItem("token");
        return Promise.reject(err);
      }
    } else {
      console.log("Request without token:", {
        url: config.url,
        data: config.data,
      });
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default {
  getMe: () => api.get("/auth/me"),
  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    console.log("Login API response:", res.data);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      console.log("Token successfully stored:", res.data.token);
    }
    return res.data;
  },
  register: async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    console.log("Register API response:", res.data);
    if (res.data.token) localStorage.setItem("token", res.data.token);
    return res.data;
  },
  getContacts: () => api.get("/contact/contacts"),
  addContact: (email) => api.post("/contact/add-contact", { email }),
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
