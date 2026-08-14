import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./LiveInvite.css";

export default function LiveInvite() {
  const navigate = useNavigate();
  const location = useLocation();

  const roomCode = location.state?.roomCode || "EM-4827";
  const userName = location.state?.name || "You";

  const [copied, setCopied] = useState(false);

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert(`Room code: ${roomCode}`);
    }
  };

  const copyInvite = async () => {
    const inviteText = `Join my Emotion Mirror conversation. Room code: ${roomCode}`;

    try {
      await navigator.clipboard.writeText(inviteText);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert(inviteText);
    }
  };

  return (
    <div className="live-invite-page">

      <div className="invite-glow invite-glow-one"></div>
      <div className="invite-glow invite-glow-two"></div>

      {/* Header */}
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

      {/* Main */}
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
          Invite the other person to join your private conversation.
          Once they join, you'll both be able to start.
        </p>

        <section className="invite-card">

          <div className="room-label">
            YOUR ROOM CODE
          </div>

          <div className="room-code">
            {roomCode}
          </div>

          <p className="room-help">
            Share this code with the person you want to
            have the conversation with.
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

        {/* Waiting */}
        <section className="waiting-card">

          <div className="waiting-icon">
            <div className="waiting-ring"></div>
            <span>👤</span>
          </div>

          <div className="waiting-text">

            <div className="waiting-title">
              Waiting for your conversation partner
            </div>

            <p>
              You're connected as <strong>{userName}</strong>.
            </p>

          </div>

          <div className="waiting-status">
            <i></i>
            WAITING
          </div>

        </section>

        {/* Demo button */}
        <button
          className="demo-join-button"
          onClick={() => navigate("/live/room")}
        >
          Simulate Partner Joining →
        </button>

        <div className="invite-privacy">
          <span>🔒</span>
          Your emotional mirror remains private to you.
        </div>

      </main>

    </div>
  );
}