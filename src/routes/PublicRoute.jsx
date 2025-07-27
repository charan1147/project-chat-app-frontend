import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { user, isLoading } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) return <div>Loading authentication, please wait...</div>;
  return user ? (
    <Navigate to="/contacts" state={{ from: location.pathname }} replace />
  ) : (
    children
  );
}
