import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { CallContext } from "../context/CallContext.jsx";
import { ChatContext } from "../context/ChatContext.jsx";
import api from "../services/api.js";
import ChatBox from "../components/Chat/ChatBox.jsx";
import useWebSocket from "../hooks/useWebSocket.jsx";

function Chat() {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { callUser, error: callError } = useContext(CallContext);
  const { messages, setMessages } = useContext(ChatContext);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await api.getMessages(contactId);
        setMessages(res.data.messages || []);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch messages");
      }
    }
    if (contactId) {
      fetchMessages();
    }
  }, [contactId, setMessages]);

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
    try {
      const res = await api.sendMessage(contactId, input);
      setMessages((prev) => [
        ...prev,
        {
          _id: res.data._id || Date.now().toString(),
          sender: { _id: user._id, name: user.name || user.email },
          receiver: contactId,
          content: input,
          type: "text",
          createdAt: new Date(),
        },
      ]);
      setInput("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
    }
  };

  const handleStartCall = (isVideo) => {
    callUser(contactId, isVideo);
    navigate(`/call/${contactId}`);
  };

  if (!user || !contactId)
    return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="container my-4">
      {(error || callError) && (
        <div className="alert alert-danger">{error || callError}</div>
      )}

      <ChatBox messages={messages} currentUserId={user._id} />

      <div className="d-flex mt-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>

      <div className="mt-3 d-flex gap-2">
        <button
          className="btn btn-success"
          onClick={() => handleStartCall(true)}
        >
          Video Call
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => handleStartCall(false)}
        >
          Audio Call
        </button>
      </div>
    </div>
  );
}

export default Chat