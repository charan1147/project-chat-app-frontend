import React, { createContext, useState, useEffect, useRef, useContext } from "react";
import Peer from "simple-peer";
import socket from "../websocket/Socket.js";
import { getRoomId } from "../services/api.js";
import api from "../services/api.js";
import { AuthContext } from "./AuthContext.jsx";

export const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [error, setError] = useState(null);
  const peerRef = useRef(null);

  useEffect(() => {
    if (user?.id) {
      socket.connect();
      socket.emit("register", user.id);
    }

    socket.on("call:user", ({ from, signal, roomId }) => {
      setCall({ isReceivingCall: true, from, signalData: signal, roomId });
    });

    socket.on("call:accepted", ({ signal }) => {
      setCallAccepted(true);
      peerRef.current?.signal(signal);
    });

    socket.on("call:ended", () => endCall());

    return () => {
      socket.off("call:user");
      socket.off("call:accepted");
      socket.off("call:ended");
      if (localStream) localStream.getTracks().forEach((track) => track.stop());
      if (peerRef.current) peerRef.current.destroy();
    };
  }, [user?.id]);

  const getMediaStream = async (isVideo = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideo ? { facingMode: "user" } : false,
        audio: true,
      });
      return stream;
    } catch (err) {
      if (err.name === "NotAllowedError") {
        setError("Camera/microphone permission denied.");
      } else if (err.name === "NotFoundError") {
        setError("No camera/microphone found.");
      } else {
        setError("Media error occurred.");
      }
      throw err;
    }
  };

  const callUser = async (remoteUserId, isVideo = true) => {
    try {
      setError(null);
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      const stream = await getMediaStream(isVideo);
      setLocalStream(stream);

      const roomId = getRoomId(user.id, remoteUserId);
      peerRef.current = new Peer({
        initiator: true,
        trickle: true,
        stream,
        config: { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] },
      });

      peerRef.current.on("signal", async (signal) => {
        await api.startCall(
          remoteUserId,
          roomId,
          signal,
          isVideo ? "video" : "audio"
        );
        socket.emit("callUser", {
          receiverId: remoteUserId,
          signalData: signal,
          from: user.id,
          roomId,
        });
      });

      peerRef.current.on("stream", (remoteStream) => {
        setRemoteStream(remoteStream);
      });

      peerRef.current.on("error", () => {
        setError("Call connection error.");
        endCall();
      });
    } catch (err) {
      setError("Failed to start call.");
    }
  };

  const answerCall = async () => {
    try {
      setError(null);
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      const stream = await getMediaStream(call.callType !== "audio");
      setLocalStream(stream);
      setCallAccepted(true);

      peerRef.current = new Peer({
        initiator: false,
        trickle: true,
        stream,
        config: { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] },
      });

      peerRef.current.on("signal", async (signal) => {
        await api.answerCall(call.roomId, signal);
        socket.emit("answerCall", { signal, roomId: call.roomId });
      });

      peerRef.current.on("stream", (remoteStream) => {
        setRemoteStream(remoteStream);
      });

      peerRef.current.on("error", () => {
        setError("Call answer error.");
      });

      peerRef.current.signal(call.signalData);
      setCall({});
    } catch (err) {
      setError("Failed to answer call.");
    }
  };

  const endCall = async () => {
    try {
      const roomId = call.roomId || getRoomId(user.id, call.from || "");
      await api.endCall(roomId);
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      setLocalStream(null);
      setRemoteStream(null);
      setCallAccepted(false);
      setCallEnded(true);
      setCall({});
      setError(null);
      socket.emit("endCall", { roomId });
    } catch (err) {
      setError("Failed to end call.");
    }
  };

  return (
    <CallContext.Provider
      value={{
        call,
        callAccepted,
        callEnded,
        localStream,
        remoteStream,
        callUser,
        answerCall,
        endCall,
        error,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
