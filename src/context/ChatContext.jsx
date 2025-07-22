import { createContext, useState } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  return (
    <ChatContext.Provider
      value={{ messages, setMessages, selectedContact, setSelectedContact }}
    >
      {children}
    </ChatContext.Provider>
  );
};
