import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socket, { connectSocket } from "../../services/socket";
import {
  getSessionUserId,
  persistSessionRoom,
} from "../../utils/session";
import "./WaitingRoom.css";

export default function WaitingRoom() {
  const navigate = useNavigate();
  const location = useLocation();

  const name = location.state?.name || "You";
  const roomCode =
    location.state?.roomCode ||
    localStorage.getItem("roomId") ||
    "";
  const conversationId =
    location.state?.conversationId ||
    localStorage.getItem("conversationId") ||
    "";
  const language =
    location.state?.language ||
    localStorage.getItem("language") ||
    "en";

  const [partnerJoined, setPartnerJoined] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!roomCode) {
      navigate("/live/join");
      return undefined;
    }

    persistSessionRoom({
      roomId: roomCode,
      conversationId,
      language,
      mode: "live",
    });

    const handleConnect = () => {
      socket.emit("join-room", {
        roomId: roomCode,
        userId: getSessionUserId(),
        userName: name,
      });
    };

    const handleUserJoined = () => {
      setPartnerJoined(true);
    };

    const handleBothJoined = () => {
      navigate("/live/both-joined", {
        state: {
          name,
          roomCode,
          conversationId,
          language,
        },
      });
    };

    const handleRoomError = (data) => {
      setError(data?.error || "Unable to connect to the room.");
    };

    socket.on("connect", handleConnect);
    socket.on("user-joined", handleUserJoined);
    socket.on("both-joined", handleBothJoined);
    socket.on("room-error", handleRoomError);

    connectSocket();

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("user-joined", handleUserJoined);
      socket.off("both-joined", handleBothJoined);
      socket.off("room-error", handleRoomError);
    };
  }, [
    roomCode,
    name,
    conversationId,
    language,
    navigate,
  ]);

  return (
    <div className="waiting-room-page">
      <div className="waiting-glow waiting-glow-one"></div>
      <div className="waiting-glow waiting-glow-two"></div>

      <header className="waiting-header">
        <button
          className="waiting-back"
          onClick={() => navigate("/live/join")}
        >
          ← Back
        </button>

        <div
          className="waiting-logo"
          onClick={() => navigate("/")}
        >
          <span>🪞</span>
          Emotion<span>Mirror</span>
        </div>

        <div className="waiting-room-code">
          ROOM <strong>{roomCode}</strong>
        </div>
      </header>

      <main className="waiting-content">
        <div className="waiting-badge">
          <span></span>
          ROOM CONNECTED
        </div>

        <h1>
          You're in.
          <br />
          <span>We're waiting for them.</span>
        </h1>

        <p className="waiting-description">
          Your room is ready. Once the other person joins,
          you'll both be able to start the conversation.
        </p>

        <section className="people-card">
          <div className="person-block">
            <div className="person-avatar you-avatar">👤</div>

            <div className="person-name">{name}</div>

            <div className="person-status connected">
              <span></span>
              YOU'RE CONNECTED
            </div>
          </div>

          <div className="connection-line">
            <div className="connection-dot"></div>
            <div className="connection-dashes"></div>
            <div
              className={`connection-dot ${
                partnerJoined ? "" : "waiting-dot"
              }`}
            ></div>
          </div>

          <div className="person-block">
            <div className="person-avatar partner-avatar">
              👤
            </div>

            <div className="person-name">Your partner</div>

            <div
              className={`person-status ${
                partnerJoined ? "connected" : "waiting"
              }`}
            >
              <span></span>
              {partnerJoined ? "CONNECTED" : "WAITING"}
            </div>
          </div>
        </section>

        <div className="waiting-status-card">
          <div className="status-spinner"></div>

          <div>
            <h3>
              {partnerJoined
                ? "Partner connected"
                : "Waiting for your partner"}
            </h3>

            <p>
              Keep this page open. We'll move you forward as
              soon as both people are connected.
            </p>
          </div>
        </div>

        <div className="waiting-code">
          <span>ROOM CODE</span>
          <strong>{roomCode}</strong>

          <button
            onClick={() =>
              navigator.clipboard.writeText(roomCode)
            }
          >
            Copy
          </button>
        </div>

        {error && <p className="waiting-error">{error}</p>}

        <div className="waiting-privacy">
          🔒 Your personal emotional mirror will remain
          private.
        </div>
      </main>
    </div>
  );
}
