import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ContactContext } from "../context/ContactContext";

function Contacts() {
  const { contacts } = useContext(ContactContext);
  const navigate = useNavigate();

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">Contacts</h4>
      </div>
      <div className="card-body">
        {contacts.length === 0 ? (
          <p className="text-danger">No contacts found.</p>
        ) : (
          <ul className="list-group list-group-flush">
            {contacts.map((c) => (
              <li
                key={c._id}
                className="list-group-item list-group-item-action"
                onClick={() => navigate(`/chat/${c._id}`)}
                style={{ cursor: "pointer" }}
              >
                {c.name || c.email}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default  Contacts