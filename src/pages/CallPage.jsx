import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CallScreen from "../components/CallScreen";

export default function CallPage() {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <CallScreen />
      <button onClick={() => navigate(`/chat/${contactId}`)}>
        Back to Chat
      </button>
    </div>
  );
}
