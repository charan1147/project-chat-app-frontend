import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5016/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
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
        // Simple token validation (check if it's a valid JWT)
        const [header, payload, signature] = token.split(".");
        if (!header || !payload || !signature) {
          console.warn(
            "Invalid token format, attempting to refresh or clear:",
            token
          );
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
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      console.log("401 detected, attempting token refresh...");
      try {
        const res = await api.post("/auth/refresh"); // Assuming a refresh endpoint
        const newToken = res.data.token;
        localStorage.setItem("token", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        console.log("Refreshed token, retrying request:", newToken);
        return api(originalRequest);
      } catch (refreshError) {
        console.error(
          "Token refresh failed:",
          refreshError.response?.data || refreshError.message
        );
        localStorage.removeItem("token");
        return Promise.reject(refreshError);
      }
    }
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
  refresh: () => api.post("/auth/refresh"), // Assuming refresh endpoint
};

export function getRoomId(user1, user2) {
  if (!user1 || !user2) throw new Error("Invalid user IDs");
  return [String(user1), String(user2)].sort().join("_");
}
