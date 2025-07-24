import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreAuth() {
      const token = localStorage.getItem("token");
      console.log("Restoring auth with token:", token); // Debug
      if (token) {
        try {
          const res = await api.getMe();
          console.log("getMe response:", res.data); // Debug
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
          } else {
            console.warn("Invalid getMe response:", res.data);
            localStorage.removeItem("token");
            setUser(null);
          }
        } catch (err) {
          console.error(
            "getMe error:",
            err.response?.status,
            err.response?.data || err.message
          );
          localStorage.removeItem("token"); // Clear invalid token
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }
    restoreAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    console.log("Login response:", res); // Debug
    if (res.success && res.user) {
      setUser(res.user);
    } else {
      throw new Error("Login failed: Invalid response");
    }
    return res;
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await api.logout();
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
