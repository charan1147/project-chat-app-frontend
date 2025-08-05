import React, { useEffect, useRef } from "react";

function ChatBox({ messages = [], currentUserId }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      className="border p-3 bg-light rounded overflow-auto"
      style={{ maxHeight: "400px" }}
    >
      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date}>
          <div className="text-center fw-bold my-2 text-primary">{date}</div>
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
                className={`d-flex ${
                  isCurrentUser
                    ? "justify-content-end"
                    : "justify-content-start"
                } mb-2`}
              >
                <div
                  className={`p-2 rounded-3 shadow-sm ${
                    isCurrentUser ? "bg-success text-white" : "bg-white"
                  }`}
                  style={{ maxWidth: "75%" }}
                >
                  <div className="fw-semibold mb-1">{senderName}</div>
                  <div>{msg.content}</div>
                  <div className="text-muted small text-end">{time}</div>
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

export default ChatBox