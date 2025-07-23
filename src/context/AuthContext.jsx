import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  async function fetchUser() {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.getMe();
      setUser(res.data.user);
    } catch (err) {
      console.error("getMe failed:", err.message);
      localStorage.removeItem("token"); 
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  fetchUser();
}, []);


const login = async (email, password) => {
  const res = await api.login(email, password);
  const { token, user } = res;

  if (token && user) {
    localStorage.setItem("token", token); 
    setUser(user);
  } else {
    throw new Error("Login failed: No token or user in response");
  }

  return res;
};


const logout = async () => {
  try {
    await api.logout();
  } catch (err) {
    console.error("Logout error:", err.message);
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
