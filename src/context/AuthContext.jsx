import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreAuth() {
      const token = localStorage.getItem("token");
      console.log("Restoring auth, token present:", !!token);
      if (token) {
        setUser({ id: "temp", email: "loading" }); // Temporary user to prevent redirect
        try {
          const res = await api.getMe();
          console.log("getMe response:", res.data);
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
          // Retry once if network error (e.g., 500 or timeout)
          if (err.response?.status >= 500) {
            try {
              const retryRes = await api.getMe();
              if (retryRes.data.success && retryRes.data.user) {
                setUser(retryRes.data.user);
              } else {
                localStorage.removeItem("token");
                setUser(null);
              }
            } catch (retryErr) {
              console.error("Retry failed:", retryErr.message);
              localStorage.removeItem("token");
              setUser(null);
            }
          } else {
            localStorage.removeItem("token");
            setUser(null);
          }
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
    console.log("Login response:", res);
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
