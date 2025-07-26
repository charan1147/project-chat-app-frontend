import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Restoring auth, token found:", !!token, token);
    if (token) {
      setUser({ id: "temp", email: "loading" });
      api
        .getMe()
        .then((res) => {
          console.log("getMe response:", res.data);
          if (res.data.user) {
            setUser(res.data.user);
          } else {
            console.warn(
              "getMe invalid response, using token fallback:",
              res.data
            );
            setUser({ id: "token-based", email: "authenticated", token });
          }
        })
        .catch((err) => {
          console.error(
            "getMe error:",
            err.response?.status,
            err.response?.data || err.message
          );
          console.log("Falling back to token presence:", token);
          if (token) {
            setUser({ id: "token-based", email: "authenticated", token });
          } else {
            setUser(null);
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    console.log("Login response:", res);
    if (res.success && res.user && res.token) {
      localStorage.setItem("token", res.token);
      console.log("Token successfully stored:", res.token);
      setUser(res.user);
    } else {
      throw new Error("Login failed: Invalid response structure");
    }
    return res;
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
