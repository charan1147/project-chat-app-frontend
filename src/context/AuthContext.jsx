import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.getMe();
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    setUser(res.data.user);
    return res.data;
  };

const logout = async () => {
  try {
    await api.logout();
  } catch (error) {
    console.error("Logout failed:", error.message);
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
