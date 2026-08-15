import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { roomsApi } from "../../services/api";
import {
  getSessionUserId,
  persistSessionRoom,
  setGuestName,
} from "../../utils/session";
import "./PrivateJoin.css";

export default function PrivateJoin() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const joinRoom = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (roomCode.trim().length < 4) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const normalizedCode = roomCode.trim().toUpperCase();
      const data = await roomsApi.get(normalizedCode);

      if (data.mode !== "private") {
        throw new Error("This room is not a private mirror room.");
      }

      setGuestName(name.trim());

      persistSessionRoom({
        roomId: data.roomId,
        conversationId: data.conversationId,
        language: data.language,
        mode: "private",
      });

      navigate("/private/waiting", {
        state: {
          roomCode: data.roomId,
          conversationId: data.conversationId,
          language: data.language,
          name: name.trim(),
        },
      });
    } catch (joinError) {
      setError(
        joinError.message ||
          "Unable to join private room."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="partner-join-page">
      <main className="partner-join-content">
        <div className="join-icon">🔗</div>

        <div className="join-label">JOIN PRIVATE ROOM</div>

        <h1>
          Someone invited
          <br />
          <span>you in.</span>
        </h1>

        <p>
          Enter the private room code shared with you to join
          the conversation.
        </p>

        <form onSubmit={joinRoom}>
          <label htmlFor="private-join-name">YOUR NAME</label>

          <input
            id="private-join-name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="How should we call you?"
          />

          <label>ROOM CODE</label>

          <input
            value={roomCode}
            onChange={(event) =>
              setRoomCode(event.target.value.toUpperCase())
            }
            placeholder="Example: EM-1234"
            maxLength={12}
          />

          {error && <p className="private-join-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Joining..." : "Join Private Room"}
            {!loading && <span>→</span>}
          </button>
        </form>
      </main>
    </div>
  );
}
