import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.getMe();
        console.log("getMe response:", res.data); // Debug
        setUser(res.data.user); // Adjust for response structure
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
    console.log("AuthContext login response:", res); // Debug
    if (res.user) setUser(res.user);
    else throw new Error("Invalid login response: missing user data");
    return res;
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await api.logout();
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
    } finally {
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
