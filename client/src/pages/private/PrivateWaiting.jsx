import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socket, { connectSocket } from "../../services/socket";
import {
  getSessionUserId,
  getSessionUserName,
  persistSessionRoom,
} from "../../utils/session";
import "./PrivateWaiting.css";

export default function PrivateWaiting() {
  const navigate = useNavigate();
  const location = useLocation();

  const roomCode =
    location.state?.roomCode ||
    localStorage.getItem("roomId") ||
    "";
  const userName =
    location.state?.name ||
    location.state?.hostName ||
    getSessionUserName();

  const [partnerJoined, setPartnerJoined] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!roomCode) {
      navigate("/private/join");
      return undefined;
    }

    persistSessionRoom({
      roomId: roomCode,
      conversationId: location.state?.conversationId,
      language: location.state?.language,
      mode: "private",
    });

    const handleConnect = () => {
      socket.emit("join-room", {
        roomId: roomCode,
        userId: getSessionUserId(),
        userName,
      });
    };

    const handleBothJoined = () => {
      navigate("/private/both-joined", {
        state: location.state,
      });
    };

    const handleRoomError = (data) => {
      setError(data?.error || "Unable to connect to the room.");
    };

    socket.on("connect", handleConnect);
    socket.on("user-joined", () => setPartnerJoined(true));
    socket.on("both-joined", handleBothJoined);
    socket.on("room-error", handleRoomError);

    connectSocket();

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("user-joined");
      socket.off("both-joined", handleBothJoined);
      socket.off("room-error", handleRoomError);
    };
  }, [roomCode, userName, location.state, navigate]);

  return (
    <div className="private-waiting-page">
      <main className="private-waiting-content">
        <div className="waiting-animation">🪞</div>

        <div className="waiting-label">PRIVATE ROOM</div>

        <h1>
          Waiting for
          <br />
          <span>your partner.</span>
        </h1>

        <p>
          Your private space is ready. We're waiting for the
          other person to join.
        </p>

        <div className="waiting-card">
          <div className="waiting-person active">
            <div className="person-avatar">Y</div>

            <div>
              <strong>You</strong>
              <small>Connected</small>
            </div>

            <span>✓</span>
          </div>

          <div className="waiting-line"></div>

          <div className="waiting-person">
            <div className="person-avatar muted">?</div>

            <div>
              <strong>Your partner</strong>
              <small>
                {partnerJoined
                  ? "Connected"
                  : "Waiting to join..."}
              </small>
            </div>

            <span
              className={partnerJoined ? "" : "pulse-dot"}
            >
              {partnerJoined ? "✓" : ""}
            </span>
          </div>
        </div>

        <div className="waiting-code-display">
          ROOM <strong>{roomCode}</strong>
        </div>

        {error && <p className="private-waiting-error">{error}</p>}

        <p className="waiting-note">
          Keep this page open. You'll move forward automatically
          when both people are connected.
        </p>
      </main>
    </div>
  );
}
