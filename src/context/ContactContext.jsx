import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchContacts() {
      try {
        const res = await api.getContacts();
        setContacts(res.data.contacts || []);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch contacts");
        setContacts([]);
      }
    }
    fetchContacts();
  }, []);

  const addContactToList = async (email) => {
    try {
      await api.addContact(email);
      const res = await api.getContacts();
      setContacts(res.data.contacts || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add contact");
      throw err;
    }
  };

  return (
    <ContactContext.Provider
      value={{ contacts, setContacts, addContactToList, error }}
    >
      {children}
    </ContactContext.Provider>
  );
};
