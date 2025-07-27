import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav
      style={{
        padding: "10px",
        backgroundColor: "#f0f0f0",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Link to="/" style={{ marginRight: 10 }}>
          Home
        </Link>
        <Link to="/contacts">Contacts</Link>
      </div>
      {user ? (
        <div>
          <span>{user.email}</span>
          <button
            onClick={logout}
            style={{
              marginLeft: 10,
              backgroundColor: "#c00",
              color: "white",
              border: "none",
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
