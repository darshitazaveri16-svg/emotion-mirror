import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { roomsApi } from "../../services/api";
import {
  getSessionUserId,
  LANGUAGES,
  persistSessionRoom,
  setGuestName,
} from "../../utils/session";
import "./LiveSetup.css";

export default function LiveSetup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [language, setLanguage] = useState("en");
  const [conversationType, setConversationType] =
    useState("Relationship");
  const [focus, setFocus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    setLoading(true);
    setError("");
    setGuestName(name.trim());

    try {
      const data = await roomsApi.create({
        mode: "live",
        language,
        hostName: name.trim(),
        guestUserId: getSessionUserId(),
        conversationType,
        focus,
      });

      persistSessionRoom({
        roomId: data.roomId,
        conversationId: data.conversationId,
        language: data.language,
        mode: "live",
      });

      navigate("/live/invite", {
        state: {
          name: name.trim(),
          conversationType,
          focus,
          roomCode: data.roomId,
          conversationId: data.conversationId,
          language: data.language,
        },
      });
    } catch (createError) {
      setError(
        createError.message ||
          "Unable to create room. Is the backend running?"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="live-setup-page">
      <div className="live-setup-glow live-glow-one"></div>
      <div className="live-setup-glow live-glow-two"></div>

      <header className="live-setup-header">
        <button
          className="live-back-button"
          onClick={() => navigate("/choose-mode")}
        >
          ← Back
        </button>

        <div
          className="live-logo"
          onClick={() => navigate("/")}
        >
          <span>🪞</span>
          Emotion<span>Mirror</span>
        </div>

        <div className="live-step">
          LIVE <span>•</span> 01
        </div>
      </header>

      <main className="live-setup-content">
        <div className="live-intro">
          <div className="live-badge">
            <span></span>
            LIVE CONVERSATION
          </div>

          <h1>
            Start a conversation
            <br />
            <span>with understanding.</span>
          </h1>

          <p>
            Set up your conversation before inviting the other
            person. Emotion Mirror will stay neutral and help
            make possible emotional signals visible.
          </p>
        </div>

        <div className="live-setup-layout">
          <section className="live-form-card">
            <div className="form-heading">
              <span>01</span>
              <div>
                <h2>Set up your session</h2>
                <p>A few details to get started.</p>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="name">YOUR NAME</label>

              <input
                id="name"
                type="text"
                placeholder="How should we call you?"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                maxLength={40}
              />
            </div>

            <div className="form-group">
              <label htmlFor="language">LANGUAGE</label>

              <select
                id="language"
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

            <div className="form-group">
              <label htmlFor="conversationType">
                CONVERSATION TYPE
              </label>

              <select
                id="conversationType"
                value={conversationType}
                onChange={(event) =>
                  setConversationType(event.target.value)
                }
              >
                <option>Relationship</option>
                <option>Friendship</option>
                <option>Family</option>
                <option>Workplace</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="focus">
                WHAT WOULD YOU LIKE TO UNDERSTAND?
                <span className="optional">OPTIONAL</span>
              </label>

              <textarea
                id="focus"
                placeholder="For example: I want to understand why the conversation became tense."
                value={focus}
                onChange={(event) =>
                  setFocus(event.target.value)
                }
                maxLength={250}
                rows={4}
              />

              <div className="character-count">
                {focus.length}/250
              </div>
            </div>

            {error && (
              <p className="live-setup-error">{error}</p>
            )}

            <button
              className="create-live-button"
              onClick={handleCreate}
              disabled={loading}
            >
              {loading
                ? "Creating room..."
                : "Create Conversation"}
              {!loading && <span>→</span>}
            </button>

            <div className="form-security">
              <span>🔒</span>
              Your perspective remains private.
            </div>
          </section>

          <aside className="live-preview">
            <div className="preview-label">
              YOUR LIVE EXPERIENCE
            </div>

            <div className="preview-card">
              <div className="preview-top">
                <div>
                  <span className="preview-small">
                    EMOTION MIRROR
                  </span>
                  <h3>Live Mirror</h3>
                </div>

                <span className="live-status">
                  <i></i>
                  LIVE
                </span>
              </div>

              <div className="preview-message">
                <span>YOU</span>
                <p>
                  "I just wish you understood where I'm
                  coming from."
                </p>
              </div>

              <div className="preview-analysis">
                <div className="analysis-title">
                  <span>Possible signals</span>
                  <span>PRIVATE</span>
                </div>

                <div className="signal">
                  <div>
                    <span>😔</span>
                    Possible hurt
                  </div>
                  <strong>—</strong>
                </div>

                <div className="signal-bar">
                  <div style={{ width: "60%" }}></div>
                </div>
              </div>

              <div className="preview-temperature">
                <div>
                  <small>CONVERSATION TEMPERATURE</small>
                  <strong>Live tracking</strong>
                </div>
                <span>—</span>
              </div>

              <div className="preview-disclaimer">
                AI interpretation — not a fact
              </div>
            </div>

            <div className="preview-note">
              <span>✦</span>
              The mirror doesn't take sides.
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
