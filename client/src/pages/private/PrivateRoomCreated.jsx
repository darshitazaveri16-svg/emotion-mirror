import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { persistSessionRoom } from "../../utils/session";
import "./PrivateRoomCreated.css";

export default function PrivateRoomCreated() {
  const navigate = useNavigate();
  const location = useLocation();

  const roomCode =
    location.state?.roomCode ||
    localStorage.getItem("roomId") ||
    "";

  useEffect(() => {
    if (!roomCode) {
      navigate("/private/create-room");
    }
  }, [roomCode, navigate]);

  const copyRoomCode = async () => {
    await navigator.clipboard.writeText(roomCode);
    alert("Room code copied!");
  };

  const continueToInvite = () => {
    persistSessionRoom({
      roomId: roomCode,
      conversationId: location.state?.conversationId,
      language: location.state?.language,
      mode: "private",
    });

    navigate("/private/invite", {
      state: location.state,
    });
  };

  return (
    <div className="room-created-page">
      <main className="room-created-content">
        <div className="success-icon">✓</div>

        <div className="room-created-label">
          PRIVATE ROOM CREATED
        </div>

        <h1>
          Your private room
          <br />
          <span>is ready.</span>
        </h1>

        <p>
          Share this room code with the person you want to
          have the conversation with.
        </p>

        <div className="room-code-card">
          <small>ROOM CODE</small>
          <strong>{roomCode}</strong>

          <button onClick={copyRoomCode}>Copy code</button>
        </div>

        <button
          className="invite-next-button"
          onClick={continueToInvite}
        >
          Invite Partner
          <span>→</span>
        </button>
      </main>
    </div>
  );
}
