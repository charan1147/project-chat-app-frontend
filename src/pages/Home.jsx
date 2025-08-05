import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      <h1 className="text-primary mb-4">Chat App</h1>
      {user && (
        <>
          <p className="lead">
            Hello, <strong>{user.name || user.email}</strong>!
          </p>
          <button
            className="btn btn-success mt-3"
            onClick={() => navigate("/contacts")}
          >
            Go to Contacts
          </button>
        </>
      )}
    </div>
  );
}

export default Home