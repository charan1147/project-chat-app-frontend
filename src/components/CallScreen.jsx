import React, { useContext, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CallContext } from "../context/CallContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { ContactContext } from "../context/ContactContext.jsx";

export default function CallScreen() {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { contacts } = useContext(ContactContext);
  const {
    call,
    callAccepted,
    localStream,
    remoteStream,
    answerCall,
    endCall,
    error,
  } = useContext(CallContext);
  const localRef = useRef();
  const remoteRef = useRef();

  // Find contact name for display
  const contact = contacts.find((c) => c._id === contactId);
  const contactName = contact
    ? contact.name || contact.email
    : "Unknown Contact";

  useEffect(() => {
    if (call.isReceivingCall && !callAccepted) {
      answerCall();
    }
  }, [call.isReceivingCall, callAccepted, answerCall]);

  useEffect(() => {
    if (localRef.current && localStream && call.callType !== "audio") {
      localRef.current.srcObject = localStream;
      localRef.current
        .play()
        .catch((err) => console.error("Local video play error:", err));
    }
  }, [localStream, call.callType]);

  useEffect(() => {
    if (remoteRef.current && remoteStream && call.callType !== "audio") {
      remoteRef.current.srcObject = remoteStream;
      remoteRef.current
        .play()
        .catch((err) => console.error("Remote video play error:", err));
    }
  }, [remoteStream, call.callType]);

  const handleEndCall = () => {
    endCall();
    navigate(`/chat/${contactId}`);
  };

  if (!user || !contactId) return <p>Loading...</p>;

  return (
    <div
      style={{
        height: call.callType === "audio" ? "100vh" : "100vh",
        background: call.callType === "audio" ? "transparent" : "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {error && (
        <p style={{ color: "red", position: "absolute", top: 10, left: 10 }}>
          {error}
        </p>
      )}
      {call.callType === "audio" ? (
        <div
          style={{
            width: 200,
            height: 100,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
            border: "1px solid #ccc",
            borderRadius: 5,
            padding: "10px",
          }}
        >
          <h2 style={{ margin: 0 }}>{contactName}</h2>
          <button
            onClick={handleEndCall}
            style={{
              backgroundColor: "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            End Call
          </button>
        </div>
      ) : (
        <>
          <video
            ref={remoteRef}
            autoPlay
            playsInline
            style={{ width: "100%", height: "80%", objectFit: "cover" }}
          />
          {localStream && (
            <video
              ref={localRef}
              autoPlay
              playsInline
              muted
              style={{
                position: "absolute",
                bottom: 10,
                right: 10,
                width: 200,
                border: "2px solid white",
              }}
            />
          )}
          <button
            onClick={handleEndCall}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "red",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            End Call
          </button>
        </>
      )}
    </div>
  );
}
