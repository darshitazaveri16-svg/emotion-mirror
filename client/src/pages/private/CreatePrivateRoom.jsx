import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { roomsApi } from "../../services/api";
import {
  getSessionUserId,
  LANGUAGES,
  persistSessionRoom,
  setGuestName,
} from "../../utils/session";
import "./CreatePrivateRoom.css";

export default function CreatePrivateRoom() {
  const navigate = useNavigate();

  const [hostName, setHostName] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createRoom = async () => {
    if (!hostName.trim()) {
      alert("Please enter your name.");
      return;
    }

    setLoading(true);
    setError("");
    setGuestName(hostName.trim());

    try {
      const data = await roomsApi.create({
        mode: "private",
        language,
        hostName: hostName.trim(),
        guestUserId: getSessionUserId(),
      });

      persistSessionRoom({
        roomId: data.roomId,
        conversationId: data.conversationId,
        language: data.language,
        mode: "private",
      });

      navigate("/private/room-created", {
        state: {
          roomCode: data.roomId,
          conversationId: data.conversationId,
          language: data.language,
          hostName: hostName.trim(),
        },
      });
    } catch (createError) {
      setError(
        createError.message ||
          "Unable to create private room."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-room-page">
      <header className="create-room-header">
        <div
          className="create-room-logo"
          onClick={() => navigate("/")}
        >
          🪞 Emotion<span>Mirror</span>
        </div>

        <div className="create-room-private">🔒 PRIVATE</div>
      </header>

      <main className="create-room-content">
        <div className="room-step">STEP 1 OF 3</div>

        <h1>
          Create your
          <br />
          <span>private room.</span>
        </h1>

        <p className="create-room-description">
          Give your conversation a private space. Your partner
          will join using a secure room code.
        </p>

        <div className="room-preview-card">
          <div className="preview-icon">🔐</div>

          <div>
            <h3>Private conversation</h3>
            <p>Only you and your invited partner can join.</p>
          </div>
        </div>

        <label className="private-field-label" htmlFor="host-name">
          YOUR NAME
        </label>

        <input
          id="host-name"
          className="private-field-input"
          value={hostName}
          onChange={(event) =>
            setHostName(event.target.value)
          }
          placeholder="How should we call you?"
        />

        <label className="private-field-label" htmlFor="private-language">
          LANGUAGE
        </label>

        <select
          id="private-language"
          className="private-field-input"
          value={language}
          onChange={(event) =>
            setLanguage(event.target.value)
          }
        >
          {LANGUAGES.map((item) => (
            <option key={item.code} value={item.code}>
              {item.label}
            </option>
          ))}
        </select>

        {error && <p className="private-create-error">{error}</p>}

        <button
          className="create-room-button"
          onClick={createRoom}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Private Room"}
          {!loading && <span>→</span>}
        </button>

        <button
          className="join-private-button"
          onClick={() => navigate("/private/join")}
        >
          Join Private Room
        </button>

        <button
          className="room-back-button"
          onClick={() => navigate("/private/setup")}
        >
          ← Back
        </button>
      </main>
    </div>
  );
}
