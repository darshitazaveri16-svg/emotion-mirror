import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LiveRoom.css";

export default function LiveRoom() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "them",
      text: "I didn't mean it that way...",
    },
    {
      id: 2,
      sender: "you",
      text: "But it felt like you did.",
    },
    {
      id: 3,
      sender: "them",
      text: "I honestly wasn't trying to hurt you.",
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessages([
      ...messages,
      {
        id: Date.now(),
        sender: "you",
        text: message,
      },
    ]);

    setMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="live-room-page">

      {/* HEADER */}

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
          ROOM <strong>EM-4827</strong>
        </div>

        <button
          className="leave-room-button"
          onClick={() => navigate("/choose-mode")}
        >
          Leave
        </button>

      </header>


      {/* MAIN */}

      <main className="live-room-main">

        {/* CONVERSATION */}

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
              2 people connected
            </div>

          </div>


          {/* MESSAGES */}

          <div className="messages-container">

            {messages.map((item) => (

              <div
                key={item.id}
                className={`message-row ${item.sender}`}
              >

                <div className="message-info">
                  {item.sender === "you"
                    ? "YOU"
                    : "THEM"}
                </div>

                <div className="message-bubble">
                  {item.text}
                </div>

              </div>

            ))}

            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
              Them is typing...
            </div>

          </div>


          {/* INPUT */}

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

            <button
              className="send-message-button"
              onClick={sendMessage}
            >
              →
            </button>

          </div>

          <div className="conversation-disclaimer">
            <span>✦</span>
            Emotion Mirror is observing patterns, not judging either person.
          </div>

        </section>


        {/* PRIVATE MIRROR */}

        <aside className="private-mirror">

          <div className="mirror-heading">

            <div>
              <span className="section-label">
                PRIVATE TO YOU
              </span>

              <h2>Their Mirror</h2>
            </div>

            <div className="privacy-icon">
              🔒
            </div>

          </div>


          {/* Emotional state */}

          <div className="emotion-main-card">

            <div className="emotion-card-header">
              <span>LIKELY EMOTIONAL SIGNAL</span>
              <span>AI</span>
            </div>

            <div className="emotion-main">

              <div className="emotion-icon">
                😔
              </div>

              <div>
                <h3>Hurt</h3>
                <p>
                  They may be feeling affected
                  by what was said.
                </p>
              </div>

              <strong>76%</strong>

            </div>

            <div className="emotion-progress">
              <div style={{ width: "76%" }}></div>
            </div>

          </div>


          {/* Other emotions */}

          <div className="emotion-list">

            <div className="emotion-item">

              <div>
                <span>🛡️</span>
                Defensive
              </div>

              <strong>51%</strong>

            </div>

            <div className="emotion-item">

              <div>
                <span>😟</span>
                Anxious
              </div>

              <strong>34%</strong>

            </div>

            <div className="emotion-item">

              <div>
                <span>💭</span>
                Uncertain
              </div>

              <strong>28%</strong>

            </div>

          </div>


          {/* Temperature */}

          <div className="temperature-card">

            <div className="temperature-header">
              <span>CONVERSATION TEMPERATURE</span>
              <span>NOW</span>
            </div>

            <div className="temperature-main">

              <div className="temperature-icon">
                🔥
              </div>

              <div>
                <h3>Rising</h3>
                <p>
                  Emotional intensity appears
                  to be increasing.
                </p>
              </div>

              <strong>68%</strong>

            </div>

            <div className="temperature-line">
              <div style={{ width: "68%" }}></div>
            </div>

          </div>


          {/* AI note */}

          <div className="mirror-note">

            <span>✦</span>

            <p>
              These are possible interpretations,
              not facts about what someone feels.
            </p>

          </div>

        </aside>

      </main>

    </div>
  );
}