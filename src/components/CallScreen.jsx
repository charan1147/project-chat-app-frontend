import React, { useContext, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CallContext } from "../context/CallContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { ContactContext } from "../context/ContactContext.jsx";

 function CallScreen() {
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

  if (!user || !contactId)
    return <div className="text-center mt-5">Loading...</div>;

  return (
    <div
      className={`d-flex justify-content-center align-items-center vh-100 ${
        call.callType === "audio" ? "" : "bg-dark position-relative"
      }`}
    >
      {error && (
        <div className="alert alert-danger position-absolute top-0 start-0 m-3">
          {error}
        </div>
      )}

      {call.callType === "audio" ? (
        <div
          className="card text-center shadow-sm p-3"
          style={{ width: "250px" }}
        >
          <div className="card-body">
            <h5 className="card-title">{contactName}</h5>
            <button className="btn btn-danger mt-3" onClick={handleEndCall}>
              End Call
            </button>
          </div>
        </div>
      ) : (
        <>
          <video
            ref={remoteRef}
            autoPlay
            playsInline
            className="w-100 h-100 object-fit-cover"
          />
          {localStream && (
            <video
              ref={localRef}
              autoPlay
              playsInline
              muted
              className="position-absolute border border-white rounded"
              style={{ width: "200px", bottom: "10px", right: "10px" }}
            />
          )}
          <button
            className="btn btn-danger position-absolute top-0 end-0 m-3"
            onClick={handleEndCall}
          >
            End Call
          </button>
        </>
      )}
    </div>
  );
}

export default CallScreen