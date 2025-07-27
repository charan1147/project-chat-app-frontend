import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .getMe()
        .then((res) => {
          if (res.data && res.data._id) {
            // CHANGED: Check for valid user data
            setUser(res.data);
          } else {
            // CHANGED: Clear token if getMe fails
            localStorage.removeItem("token");
            setUser(null);
          }
        })
        .catch((err) => {
          console.error(
            "getMe error:",
            err.response?.data?.message || err.message
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
    if (res.success && res.user && res.token) {
      setUser(res.user);
      return res;
    }
    throw new Error(res.message || "Login failed");
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error(
        "Logout error:",
        err.response?.data?.message || err.message
      );
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
