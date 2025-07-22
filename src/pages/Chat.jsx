import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChatContext } from "../context/ChatContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { CallContext } from "../context/CallContext.jsx";
import api from "../services/api.js";
import socket from "../websocket/Socket.js";
import ChatBox from "../components/Chat/ChatBox.jsx";
import useWebSocket from "../hooks/useWebSocket.jsx";

export default function Chat() {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { callUser } = useContext(CallContext);
  const { messages, setMessages, setSelectedContact } = useContext(ChatContext);
  const [input, setInput] = useState("");

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await api.getMessages(contactId);
        setMessages(res.data.messages || []);
      } catch {}
    }
    if (contactId) {
      setSelectedContact({ _id: contactId });
      fetchMessages();
    }
  }, [contactId, setMessages, setSelectedContact]);

  const handleReceive = (msg) => {
    if (
      (msg.sender === contactId && msg.receiver === user._id) ||
      (msg.sender === user._id && msg.receiver === contactId)
    ) {
      setMessages((prev) => [...prev, msg]);
    }
  };

  useWebSocket(handleReceive);

  const sendMessage = async () => {
    if (!input.trim()) return;
    await api.sendMessage(contactId, input);
    const msg = {
      _id: Date.now().toString(),
      sender: { _id: user._id, name: user.name || user.email },
      receiver: contactId,
      content: input,
      type: "text",
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
    socket.emit("sendMessage", {
      senderId: user._id,
      receiverId: contactId,
      content: input,
      type: "text",
      senderName: user.name || user.email, // Include senderName for consistency
    });
    setInput("");
  };

  const handleStartCall = (isVideo) => {
    callUser(contactId, isVideo);
    navigate(`/call/${contactId}`);
  };

  if (!user || !contactId) return <p>Loading...</p>;

  return (
    <div>
      <ChatBox messages={messages} currentUserId={user._id} />
      <div style={{ display: "flex", marginTop: 10 }}>
        <input
          style={{ flex: 1 }}
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={sendMessage} style={{ marginLeft: 5 }}>
          Send
        </button>
      </div>
      <div style={{ marginTop: 10 }}>
        <button onClick={() => handleStartCall(true)}>Video Call</button>
        <button
          onClick={() => handleStartCall(false)}
          style={{ marginLeft: 5 }}
        >
          Audio Call
        </button>
      </div>
    </div>
  );
}
