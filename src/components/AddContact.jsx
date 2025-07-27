import React, { useState, useContext } from "react";
import { ContactContext } from "../context/ContactContext";

export default function AddContact() {
  const [email, setEmail] = useState("");
  const { addContactToList, error } = useContext(ContactContext); // CHANGED: Use context error

  const addContact = async (e) => {
    e.preventDefault();
    try {
      await addContactToList(email.trim());
      setEmail("");
    } catch {
      // Error handled in ContactContext
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
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* NEW: Display errors */}
    </form>
  );
}
