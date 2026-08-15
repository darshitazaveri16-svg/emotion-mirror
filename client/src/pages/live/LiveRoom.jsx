import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useRoomSocket from "../../hooks/useRoomSocket";
import useSpeechRecognition, {
  getSpeechLanguage,
} from "../../hooks/useSpeechRecognition";
import {
  getSessionUserName,
  persistSessionRoom,
} from "../../utils/session";
import "./LiveRoom.css";

export default function LiveRoom() {
  const navigate = useNavigate();
  const location = useLocation();

  const [message, setMessage] = useState("");
  const [roomId, setRoomId] = useState("");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const storedRoomId =
      localStorage.getItem("roomId") ||
      params.get("roomId") ||
      location.state?.roomId ||
      location.state?.roomCode;

    const storedConversationId =
      localStorage.getItem("conversationId") ||
      params.get("conversationId") ||
      location.state?.conversationId;

    const storedLanguage =
      localStorage.getItem("language") ||
      location.state?.language ||
      "en";

    if (!storedRoomId) {
      navigate("/live/setup");
      return;
    }

    setRoomId(storedRoomId);
    setLanguage(storedLanguage);

    persistSessionRoom({
      roomId: storedRoomId,
      conversationId: storedConversationId,
      language: storedLanguage,
      mode: "live",
    });
  }, [location, navigate]);

  const {
    messages,
    connectedUsers,
    typing,
    mirror,
    roomError,
    sendMessage,
    leaveRoom,
  } = useRoomSocket({
    roomId,
    conversationId:
      localStorage.getItem("conversationId") ||
      location.state?.conversationId,
    userName:
      location.state?.name || getSessionUserName(),
  });

  const handleSpeechResult = (transcript) => {
    setMessage((current) =>
      current ? `${current} ${transcript}` : transcript
    );
  };

  const { listening, supported, startListening } =
    useSpeechRecognition({
      language: getSpeechLanguage(language),
      onResult: handleSpeechResult,
    });

  const submitMessage = () => {
    const sent = sendMessage(message, language);

    if (sent) {
      setMessage("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitMessage();
    }
  };

  const handleLeave = () => {
    leaveRoom();
    navigate("/choose-mode");
  };

  const intensityPercentage = Math.round(
    Math.max(0, Math.min(1, mirror.intensity)) * 100
  );

  const temperaturePercentage = Math.max(
    0,
    Math.min(100, mirror.temperature)
  );

  return (
    <div className="live-room-page">
      <header className="live-room-header">
        <div
          className="room-logo"
          onClick={() => navigate("/")}
        >
          <span>🪞</span>
          Emotion<span>Mirror</span>
        </div>

        <div className="room-status">
          <span></span>
          LIVE
        </div>

        <div className="room-code-small">
          ROOM <strong>{roomId || "----"}</strong>
        </div>

        <button
          className="leave-room-button"
          onClick={handleLeave}
        >
          Leave
        </button>
      </header>

      <main className="live-room-main">
        <section className="conversation-section">
          <div className="conversation-heading">
            <div>
              <span className="section-label">
                SHARED SPACE
              </span>
              <h1>Conversation</h1>
            </div>

            <div className="connected-person">
              <span></span>
              {connectedUsers}{" "}
              {connectedUsers === 1 ? "person" : "people"}{" "}
              connected
            </div>
          </div>

          {roomError && (
            <div className="live-room-error">{roomError}</div>
          )}

          <div className="messages-container">
            {messages.length === 0 && (
              <div className="message-info">
                Start the conversation...
              </div>
            )}

            {messages.map((item) => (
              <div
                key={item.id}
                className={`message-row ${item.sender}`}
              >
                <div className="message-info">
                  {item.sender === "you"
                    ? "YOU"
                    : item.sender === "ai"
                    ? "AI"
                    : "THEM"}
                </div>

                <div className="message-bubble">
                  {item.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
                AI is thinking...
              </div>
            )}
          </div>

          <div className="message-input-area">
            <textarea
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Type what you want to say..."
              rows="1"
            />

            {supported && (
              <button
                type="button"
                className={`voice-button ${
                  listening ? "listening" : ""
                }`}
                onClick={startListening}
                title="Speak your message"
              >
                🎤
              </button>
            )}

            <button
              className="send-message-button"
              onClick={submitMessage}
              disabled={typing}
            >
              →
            </button>
          </div>

          <div className="conversation-disclaimer">
            <span>✦</span>
            Emotion Mirror is observing patterns, not judging
            either person.
          </div>
        </section>

        <aside className="private-mirror">
          <div className="mirror-heading">
            <div>
              <span className="section-label">
                PRIVATE TO YOU
              </span>
              <h2>Their Mirror</h2>
            </div>

            <div className="privacy-icon">🔒</div>
          </div>

          <div className="emotion-main-card">
            <div className="emotion-card-header">
              <span>LIKELY EMOTIONAL SIGNAL</span>
              <span>AI</span>
            </div>

            <div className="emotion-main">
              <div className="emotion-icon">💭</div>

              <div>
                <h3>{mirror.emotion}</h3>
                <p>
                  {mirror.reasoning ||
                    "AI interpretation of possible emotional signals."}
                </p>
              </div>

              <strong>{intensityPercentage}%</strong>
            </div>

            <div className="emotion-progress">
              <div
                style={{
                  width: `${intensityPercentage}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="temperature-card">
            <div className="temperature-header">
              <span>CONVERSATION TEMPERATURE</span>
              <span>NOW</span>
            </div>

            <div className="temperature-main">
              <div className="temperature-icon">🔥</div>

              <div>
                <h3>{mirror.trend}</h3>
                <p>
                  Current possible emotional intensity
                  pattern.
                </p>
              </div>

              <strong>{temperaturePercentage}%</strong>
            </div>

            <div className="temperature-line">
              <div
                style={{
                  width: `${temperaturePercentage}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="mirror-note">
            <span>✦</span>
            <p>
              {mirror.note ||
                "These are possible interpretations, not facts about what someone feels."}
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
