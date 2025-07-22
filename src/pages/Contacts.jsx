import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ContactContext } from "../context/ContactContext";

export default function Contacts() {
  const { contacts } = useContext(ContactContext);
  const navigate = useNavigate();

  return (
    <div>
      <h2>Contacts</h2>
      {contacts.length === 0 ? (
        <p>No contacts found.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {contacts.map((c) => (
            <li
              key={c._id}
              onClick={() => navigate(`/chat/${c._id}`)}
              style={{
                cursor: "pointer",
                padding: "0.5rem 0",
                borderBottom: "1px solid #ccc",
              }}
            >
              {c.name || c.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
