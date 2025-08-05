import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

 function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 py-2 shadow-sm">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex gap-3">
          <Link to="/" className="nav-link text-primary fw-bold">
            Home
          </Link>
          <Link to="/contacts" className="nav-link text-primary fw-bold">
            Contacts
          </Link>
        </div>

        {user ? (
          <div className="d-flex align-items-center gap-3">
            <span className="fw-semibold text-dark">{user.email}</span>
            <button className="btn btn-danger btn-sm" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-outline-primary btn-sm">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default  Navbar