import { useNavigate } from "react-router-dom";
import "./ChooseMode.css";

export default function ChooseMode() {
  const navigate = useNavigate();

  const modes = [
    {
      icon: "🗣️",
      title: "Live Conversation",
      subtitle: "Talk together, understand together.",
      description:
        "Have a real-time conversation while Emotion Mirror helps both people see possible emotional signals and conversation temperature.",
      tags: ["Real-time", "Two people", "Emotion tracking"],
      button: "Start Live",
      path: "/live/setup",
      className: "live-mode",
    },
    {
      icon: "🪞",
      title: "Private Mirror",
      subtitle: "See their perspective privately.",
      description:
        "Share a conversation while each person receives their own private AI mirror of what the other person might be experiencing.",
      tags: ["Private AI", "Two people", "Separate mirrors"],
      button: "Create Private Room",
      path: "/private/setup",
      className: "private-mode",
    },
    {
      icon: "🧠",
      title: "Solo Reflection",
      subtitle: "Understand a conversation on your own.",
      description:
        "Paste, upload, or describe a conversation and explore emotional signals, temperature, turning points and reflection.",
      tags: ["One person", "Conversation analysis", "Reflection"],
      button: "Start Solo",
      path: "/solo",
      className: "solo-mode",
    },
  ];

  return (
    <div className="choose-mode-page">

      {/* Background decoration */}
      <div className="choose-glow choose-glow-one"></div>
      <div className="choose-glow choose-glow-two"></div>

      {/* Top bar */}
      <header className="choose-header">
        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

        <div
          className="choose-logo"
          onClick={() => navigate("/")}
        >
          <span>🪞</span>
          Emotion<span>Mirror</span>
        </div>

        <div className="step-indicator">
          STEP <strong>1</strong> OF <strong>2</strong>
        </div>
      </header>

      {/* Main content */}
      <main className="choose-content">

        <div className="choose-heading">

          <div className="choose-badge">
            <span></span>
            FIND YOUR WAY IN
          </div>

          <h1>
            How do you want to use
            <br />
            <span>Emotion Mirror?</span>
          </h1>

          <p>
            Choose the experience that fits your conversation.
            You can always come back and choose another mode.
          </p>

        </div>

        {/* Mode cards */}
        <div className="choose-modes-grid">

          {modes.map((mode) => (
            <div
              className={`choose-mode-card ${mode.className}`}
              key={mode.title}
              onClick={() => navigate(mode.path)}
            >

              <div className="mode-card-top">

                <div className="choose-mode-icon">
                  {mode.icon}
                </div>

                <span className="mode-arrow">
                  ↗
                </span>

              </div>

              <div className="mode-card-content">

                <h2>{mode.title}</h2>

                <h3>{mode.subtitle}</h3>

                <p>{mode.description}</p>

              </div>

              <div className="mode-tags">

                {mode.tags.map((tag) => (
                  <span key={tag}>
                    {tag}
                  </span>
                ))}

              </div>

              <button
                className="choose-mode-button"
                onClick={(event) => {
                  event.stopPropagation();
                  navigate(mode.path);
                }}
              >
                {mode.button}
                <span>→</span>
              </button>

            </div>
          ))}

        </div>

        <div className="choose-note">
          <span>✦</span>
          Emotion Mirror offers possible interpretations — not mind reading.
        </div>

      </main>

    </div>
  );
}