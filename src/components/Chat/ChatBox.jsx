import React, { useEffect, useRef } from "react";

export default function ChatBox({ messages = [], currentUserId }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // NEW: Moved to utility function
  const formatDateTime = (iso) => {
    const date = new Date(iso);
    return {
      date: date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const groupedMessages = messages.reduce((acc, msg) => {
    const { date } = formatDateTime(msg.createdAt || msg.timestamp);
    acc[date] = acc[date] || [];
    acc[date].push(msg);
    return acc;
  }, {});

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: 10,
        maxHeight: 300,
        overflowY: "auto",
      }}
    >
      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date}>
          <div style={{ textAlign: "center", fontWeight: "bold" }}>{date}</div>
          {msgs.map((msg) => {
            const isCurrentUser =
              (msg.sender?._id || msg.sender) === currentUserId;
            const senderName = isCurrentUser
              ? "You"
              : msg.sender?.name || "Unknown User";
            const { time } = formatDateTime(msg.createdAt || msg.timestamp);
            return (
              <div
                key={msg._id}
                style={{
                  textAlign: isCurrentUser ? "right" : "left",
                  margin: "4px 0",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "6px 12px",
                    borderRadius: 10,
                    backgroundColor: isCurrentUser ? "#dcf8c6" : "#f1f0f0",
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>{senderName}</div>
                  <div>{msg.content}</div>
                  <div style={{ fontSize: "0.7rem", color: "#666" }}>
                    {time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div ref={endRef}></div>
    </div>
  );
}
