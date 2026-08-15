import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socket, { connectSocket } from "../../services/socket";
import {
  getSessionUserId,
  getSessionUserName,
  persistSessionRoom,
  setGuestName,
} from "../../utils/session";
import "./LiveInvite.css";

export default function LiveInvite() {
  const navigate = useNavigate();
  const location = useLocation();

  const roomCode =
    location.state?.roomCode ||
    localStorage.getItem("roomId") ||
    "";
  const userName =
    location.state?.name || getSessionUserName();
  const conversationId =
    location.state?.conversationId ||
    localStorage.getItem("conversationId") ||
    "";
  const language =
    location.state?.language ||
    localStorage.getItem("language") ||
    "en";

  const [copied, setCopied] = useState(false);
  const [partnerJoined, setPartnerJoined] = useState(false);
  const [waitingError, setWaitingError] = useState("");

  useEffect(() => {
    if (!roomCode) {
      navigate("/live/setup");
      return undefined;
    }

    persistSessionRoom({
      roomId: roomCode,
      conversationId,
      language,
      mode: "live",
    });

    setGuestName(userName);

    const handleConnect = () => {
      socket.emit("join-room", {
        roomId: roomCode,
        userId: getSessionUserId(),
        userName,
      });
    };

    const handleUserJoined = () => {
      setPartnerJoined(true);
    };

    const handleBothJoined = () => {
      navigate("/live/both-joined", {
        state: {
          name: userName,
          roomCode,
          conversationId,
          language,
        },
      });
    };

    const handleRoomError = (data) => {
      setWaitingError(
        data?.error || "Unable to connect to the room."
      );
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
    userName,
    conversationId,
    language,
    navigate,
  ]);

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(`Room code: ${roomCode}`);
    }
  };

  const copyInvite = async () => {
    const inviteText = `Join my Emotion Mirror conversation. Room code: ${roomCode}`;

    try {
      await navigator.clipboard.writeText(inviteText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(inviteText);
    }
  };

  return (
    <div className="live-invite-page">
      <div className="invite-glow invite-glow-one"></div>
      <div className="invite-glow invite-glow-two"></div>

      <header className="invite-header">
        <button
          className="invite-back"
          onClick={() => navigate("/live/setup")}
        >
          ← Back
        </button>

        <div
          className="invite-logo"
          onClick={() => navigate("/")}
        >
          <span>🪞</span>
          Emotion<span>Mirror</span>
        </div>

        <div className="invite-step">
          LIVE <span>•</span> 02
        </div>
      </header>

      <main className="invite-content">
        <div className="invite-badge">
          <span></span>
          ROOM CREATED
        </div>

        <h1>
          Your conversation
          <br />
          <span>is ready.</span>
        </h1>

        <p className="invite-description">
          Invite the other person to join your private
          conversation. Once they join, you'll both be able
          to start.
        </p>

        <section className="invite-card">
          <div className="room-label">YOUR ROOM CODE</div>

          <div className="room-code">{roomCode}</div>

          <p className="room-help">
            Share this code with the person you want to have
            the conversation with.
          </p>

          <button
            className="copy-code-button"
            onClick={copyRoomCode}
          >
            {copied ? "✓ Copied!" : "Copy Room Code"}
          </button>

          <div className="or-divider">
            <span>OR</span>
          </div>

          <button
            className="share-button"
            onClick={copyInvite}
          >
            <span>↗</span>
            Copy Invite Message
          </button>
        </section>

        <section className="waiting-card">
          <div className="waiting-icon">
            <div className="waiting-ring"></div>
            <span>👤</span>
          </div>

          <div className="waiting-text">
            <div className="waiting-title">
              {partnerJoined
                ? "Your partner has joined"
                : "Waiting for your conversation partner"}
            </div>

            <p>
              You're connected as <strong>{userName}</strong>.
            </p>
          </div>

          <div className="waiting-status">
            <i></i>
            {partnerJoined ? "READY" : "WAITING"}
          </div>
        </section>

        {waitingError && (
          <p className="invite-error">{waitingError}</p>
        )}

        <div className="invite-privacy">
          <span>🔒</span>
          Your emotional mirror remains private to you.
        </div>
      </main>
    </div>
  );
}
