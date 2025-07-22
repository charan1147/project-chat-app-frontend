import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const res = await api.getContacts();
        setContacts(res.data.contacts || []);
      } catch {
        setContacts([]);
      }
    }
    fetchContacts();
  }, []);

  const addContactToList = async (email) => {
    await api.addContact(email);
    const res = await api.getContacts();
    setContacts(res.data.contacts || []);
  };

  return (
    <ContactContext.Provider
      value={{ contacts, setContacts, addContactToList }}
    >
      {children}
    </ContactContext.Provider>
  );
};
