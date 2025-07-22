import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ContactContext } from "../context/ContactContext";
import { ChatContext } from "../context/ChatContext";

export default function ContactList() {
  const { contacts } = useContext(ContactContext);
  const { setSelectedContact } = useContext(ChatContext);
  const navigate = useNavigate();

  if (!contacts.length) return <p>No contacts</p>;

  return (
    <ul style={{ listStyleType: "none", padding: 0 }}>
      {contacts.map((contact) => (
        <li
          key={contact._id}
          onClick={() => {
            setSelectedContact(contact);
            navigate(`/chat/${contact._id}`);
          }}
          style={{
            padding: "0.5rem 0",
            borderBottom: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          {contact.name || contact.email}
        </li>
      ))}
    </ul>
  );
}
