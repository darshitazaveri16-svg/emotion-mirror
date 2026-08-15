import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { roomsApi } from "../../services/api";
import {
  getSessionUserId,
  persistSessionRoom,
  setGuestName,
} from "../../utils/session";
import "./JoinRoom.css";

export default function JoinRoom() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async () => {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (roomCode.trim().length < 4) {
      alert("Please enter a valid room code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const normalizedCode = roomCode.trim().toUpperCase();
      const data = await roomsApi.get(normalizedCode);

      setGuestName(name.trim());

      persistSessionRoom({
        roomId: data.roomId,
        conversationId: data.conversationId,
        language: data.language,
        mode: data.mode,
      });

      localStorage.setItem("userId", getSessionUserId());

      navigate("/live/waiting", {
        state: {
          name: name.trim(),
          roomCode: data.roomId,
          conversationId: data.conversationId,
          language: data.language,
        },
      });
    } catch (joinError) {
      setError(
        joinError.message ||
          "Unable to join room. Check the code and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="join-room-page">
      <div className="join-glow join-glow-one"></div>
      <div className="join-glow join-glow-two"></div>

      <header className="join-header">
        <button
          className="join-back"
          onClick={() => navigate("/choose-mode")}
        >
          ← Back
        </button>

        <div
          className="join-logo"
          onClick={() => navigate("/")}
        >
          <span>🪞</span>
          Emotion<span>Mirror</span>
        </div>

        <div className="join-step">
          LIVE <span>•</span> JOIN
        </div>
      </header>

      <main className="join-content">
        <div className="join-badge">
          <span></span>
          JOIN A CONVERSATION
        </div>

        <h1>
          Someone invited
          <br />
          <span>you in.</span>
        </h1>

        <p className="join-description">
          Enter the room details shared with you. You'll join
          the same conversation while keeping your personal
          emotional mirror private.
        </p>

        <section className="join-card">
          <div className="join-card-heading">
            <span>01</span>

            <div>
              <h2>Enter your details</h2>
              <p>You're joining someone else's room.</p>
            </div>
          </div>

          <div className="join-form-group">
            <label htmlFor="join-name">YOUR NAME</label>

            <input
              id="join-name"
              type="text"
              placeholder="How should we call you?"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              maxLength={40}
            />
          </div>

          <div className="join-form-group">
            <label htmlFor="room-code">ROOM CODE</label>

            <input
              id="room-code"
              type="text"
              placeholder="Example: EM-1234"
              value={roomCode}
              onChange={(event) =>
                setRoomCode(
                  event.target.value.toUpperCase()
                )
              }
              maxLength={10}
            />

            <p className="room-code-help">
              Ask the person who invited you for the room code
              if you don't have it.
            </p>
          </div>

          {error && <p className="join-error">{error}</p>}

          <button
            className="join-room-button"
            onClick={handleJoin}
            disabled={loading}
          >
            {loading ? "Joining..." : "Join Conversation"}
            {!loading && <span>→</span>}
          </button>

          <div className="join-security">
            <span>🔒</span>
            Your private emotional mirror is only visible to
            you.
          </div>
        </section>

        <div className="join-info">
          <div className="join-info-icon">🪞</div>

          <div>
            <h3>What happens when you join?</h3>

            <p>
              You'll share the conversation with the other
              person, but your AI interpretation stays private.
              Emotion Mirror doesn't take sides.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
