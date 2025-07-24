import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Restoring auth, token present:", !!token);
    if (token) {
      // Temporary user to prevent immediate redirect
      setUser({ id: "temp", email: "loading" });
      api
        .getMe()
        .then((res) => {
          console.log("getMe response:", res.data);
          if (res.data.user) {
            // Adjusted for your backend response
            setUser(res.data.user);
          } else {
            localStorage.removeItem("token");
            setUser(null);
          }
        })
        .catch((err) => {
          console.error(
            "getMe error:",
            err.response?.status,
            err.response?.data || err.message
          );
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    console.log("Login response:", res);
    if (res.data.success && res.data.user && res.data.token) {
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
    } else {
      throw new Error("Login failed: Invalid response");
    }
    return res.data;
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
