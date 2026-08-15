import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeApi, conversationsApi } from "../../services/api";
import {
  getLanguageLabel,
  isAuthenticated,
  LANGUAGES,
} from "../../utils/session";
import useSpeechRecognition, {
  getSpeechLanguage,
} from "../../hooks/useSpeechRecognition";
import "../live/LiveRoom.css";
import "./SoloReflection.css";

export default function SoloReflection() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState("");
  const [temperature, setTemperature] = useState(30);
  const [emotion, setEmotion] = useState("Neutral");
  const [intensity, setIntensity] = useState(0);
  const [trend, setTrend] = useState("stable");
  const [reasoning, setReasoning] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState("");
  const [showReflection, setShowReflection] = useState(false);
  const [reflection, setReflection] = useState(null);
  const [loadingReflection, setLoadingReflection] =
    useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/welcome", {
        state: { redirectTo: "/solo" },
      });
      return;
    }

    let cancelled = false;

    const initConversation = async () => {
      try {
        const data = await conversationsApi.create({
          mode: "solo",
          language,
        });

        if (!cancelled) {
          setConversationId(data.conversation._id);
        }
      } catch (initError) {
        if (!cancelled) {
          setError(
            initError.message ||
              "Unable to start solo reflection."
          );
        }
      }
    };

    if (!conversationId) {
      initConversation();
    }

    return () => {
      cancelled = true;
    };
  }, [navigate]);

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

  const sendMessage = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || typing) {
      return;
    }

    if (!conversationId) {
      setError("Conversation is not ready yet.");
      return;
    }

    setError("");
    setTyping(true);

    setMessages((previous) => [
      ...previous,
      {
        id: Date.now(),
        sender: "you",
        text: trimmedMessage,
      },
    ]);

    setMessage("");

    try {
      const data = await analyzeApi.message({
        message: trimmedMessage,
        conversationId,
        language,
      });

      setConversationId(data.conversationId);
      localStorage.setItem("language", language);

      if (typeof data.temperature === "number") {
        setTemperature(data.temperature);
      }

      if (data.emotion) {
        setEmotion(data.emotion);
      }

      if (typeof data.intensity === "number") {
        setIntensity(data.intensity);
      }

      if (data.trend) {
        setTrend(data.trend);
      }

      if (data.reasoning) {
        setReasoning(data.reasoning);
      }

      if (data.aiReply) {
        setMessages((previous) => [
          ...previous,
          {
            id: Date.now() + 1,
            sender: "ai",
            text: data.aiReply,
          },
        ]);
      }
    } catch (sendError) {
      setError(
        sendError.message ||
          "Unable to analyze your message."
      );
    } finally {
      setTyping(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const finishReflection = async () => {
    if (!conversationId) {
      return;
    }

    setLoadingReflection(true);
    setError("");

    try {
      const data =
        await conversationsApi.reflection(conversationId);

      setReflection(data.reflection);
      setShowReflection(true);
    } catch (reflectionError) {
      setError(
        reflectionError.message ||
          "Unable to generate final reflection."
      );
    } finally {
      setLoadingReflection(false);
    }
  };

  const intensityPercentage = Math.round(
    Math.max(0, Math.min(1, intensity)) * 100
  );

  const temperaturePercentage = Math.max(
    0,
    Math.min(100, temperature)
  );

  if (showReflection && reflection) {
    return (
      <div className="solo-reflection-page">
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
            REFLECTION
          </div>
        </header>

        <main className="solo-final-reflection">
          <span className="section-label">
            FINAL REFLECTION
          </span>

          <h1>Your conversation reflection</h1>

          <p className="reflection-note">
            {reflection.note ||
              "AI interpretation — not a fact"}
          </p>

          <div className="reflection-cards">
            <div className="reflection-card-item">
              <small>Summary</small>
              <p>{reflection.summary}</p>
            </div>

            <div className="reflection-card-item">
              <small>Strongest signal</small>
              <p>{reflection.strongestSignal}</p>
            </div>

            <div className="reflection-card-item">
              <small>Trend</small>
              <p>{reflection.trend}</p>
            </div>

            {reflection.suggestion && (
              <div className="reflection-card-item">
                <small>Gentle suggestion</small>
                <p>{reflection.suggestion}</p>
              </div>
            )}
          </div>

          <button
            className="solo-primary-button"
            onClick={() => navigate("/choose-mode")}
          >
            Start New Reflection →
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="solo-reflection-page live-room-page">
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
          SOLO
        </div>

        <div className="solo-language-select">
          <select
            value={language}
            onChange={(event) =>
              setLanguage(event.target.value)
            }
          >
            {LANGUAGES.map((item) => (
              <option
                key={item.code}
                value={item.code}
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <button
          className="leave-room-button"
          onClick={() => navigate("/choose-mode")}
        >
          Leave
        </button>
      </header>

      <main className="live-room-main">
        <section className="conversation-section">
          <div className="conversation-heading">
            <div>
              <span className="section-label">
                SOLO REFLECTION
              </span>
              <h1>Your space</h1>
            </div>

            <div className="connected-person">
              <span></span>
              {getLanguageLabel(language)}
            </div>
          </div>

          {error && (
            <div className="solo-error-banner">{error}</div>
          )}

          <div className="messages-container">
            {messages.length === 0 && (
              <div className="message-info">
                Share what is on your mind...
              </div>
            )}

            {messages.map((item) => (
              <div
                key={item.id}
                className={`message-row ${item.sender}`}
              >
                <div className="message-info">
                  {item.sender === "you" ? "YOU" : "AI"}
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
              placeholder="Type or speak what you want to reflect on..."
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
              onClick={sendMessage}
              disabled={typing}
            >
              →
            </button>
          </div>

          <div className="solo-actions">
            <button
              className="solo-finish-button"
              onClick={finishReflection}
              disabled={
                loadingReflection ||
                messages.length === 0
              }
            >
              {loadingReflection
                ? "Generating reflection..."
                : "Finish & Reflect"}
            </button>
          </div>

          <div className="conversation-disclaimer">
            <span>✦</span>
            Emotion Mirror offers possible interpretations —
            not certainty about how you feel.
          </div>
        </section>

        <aside className="private-mirror">
          <div className="mirror-heading">
            <div>
              <span className="section-label">
                YOUR MIRROR
              </span>
              <h2>Emotional signals</h2>
            </div>

            <div className="privacy-icon">🪞</div>
          </div>

          <div className="emotion-main-card">
            <div className="emotion-card-header">
              <span>LIKELY EMOTIONAL SIGNAL</span>
              <span>AI</span>
            </div>

            <div className="emotion-main">
              <div className="emotion-icon">💭</div>

              <div>
                <h3>{emotion}</h3>
                <p>
                  {reasoning ||
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
                <h3>{trend}</h3>
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
              These are possible interpretations, not facts
              about what you feel.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
