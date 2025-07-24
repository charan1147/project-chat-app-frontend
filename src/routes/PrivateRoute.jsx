import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, isLoading } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) return <div>Loading authentication, please wait...</div>;
  return user && user.id !== "temp" ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
}
