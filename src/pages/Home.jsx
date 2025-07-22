import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div>
      <h1>Chat App</h1>
      {user && (
        <>
          <p>Hello, {user.name || user.email}!</p>
          <button onClick={() => navigate("/contacts")}>Go to Contacts</button>
        </>
      )}
    </div>
  );
}
