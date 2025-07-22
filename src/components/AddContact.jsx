import React, { useState, useContext } from "react";
import { ContactContext } from "../context/ContactContext";

export default function AddContact() {
  const [email, setEmail] = useState("");
  const { addContactToList } = useContext(ContactContext);

  const addContact = async (e) => {
    e.preventDefault();
    try {
      await addContactToList(email.trim());
      setEmail("");
    } catch {
      alert("Failed to add contact");
    }
  };

  return (
    <form onSubmit={addContact}>
      <label>Contact Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Add Contact</button>
    </form>
  );
}
