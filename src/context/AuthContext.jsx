import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false); // No token, no need to fetch
      return;
    }

    async function fetchUser() {
      try {
        const res = await api.getMe();
        setUser(res.data.user); // or res.data if your API returns plain user
      } catch (err) {
        console.error("Auth check error:", err.response?.data || err.message);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.user) {
      localStorage.setItem("token", res.token);
      setUser(res.user);
    } else {
      throw new Error("Invalid login response: missing user data");
    }
    return res;
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
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
