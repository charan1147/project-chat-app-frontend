import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ContactContext } from "../context/ContactContext";

function ContactList() {
  const { contacts } = useContext(ContactContext);
  const navigate = useNavigate();

  if (!contacts.length) {
    return (
      <div className="alert alert-warning text-center mt-3">
        No contacts found.
      </div>
    );
  }

  return (
    <ul className="list-group mt-3">
      {contacts.map((contact) => (
        <li
          key={contact._id}
          className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
          onClick={() => navigate(`/chat/${contact._id}`)}
          role="button"
        >
          <span>{contact.name || contact.email}</span>
          <i className="bi bi-chat-dots-fill text-primary"></i>
        </li>
      ))}
    </ul>
  );
}

export default ContactList