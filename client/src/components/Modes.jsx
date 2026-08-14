import { useNavigate } from "react-router-dom";

export default function Modes() {
  const navigate = useNavigate();

  const modes = [
    {
      icon: "🗣️",
      title: "Live Conversation",
      label: "BOTH PARTICIPATE",
      description:
        "Talk together in real time while Emotion Mirror tracks emotional signals and conversation temperature.",
      features: ["Real-time analysis", "Emotion mirror", "Temperature tracking"],
      button: "Start Live",
      route: "/live/setup",
      className: "mode-live"
    },
    {
      icon: "🪞",
      title: "Private Mirror",
      label: "PRIVATE PERSPECTIVES",
      description:
        "Both people participate while each person receives their own private AI perspective.",
      features: ["Private AI insights", "Shared conversation", "Optional reflection sharing"],
      button: "Create Private Room",
      route: "/private/setup",
      className: "mode-private"
    },
    {
      icon: "🧠",
      title: "Solo Reflection",
      label: "YOU ONLY",
      description:
        "Analyze a conversation even when the other person doesn't want to participate.",
      features: ["Paste or upload", "Turning points", "Emotional reflection"],
      button: "Analyze Conversation",
      route: "/solo",
      className: "mode-solo"
    }
  ];

  return (
    <section className="section modes-section" id="modes">

      <div className="section-heading">
        <span className="eyebrow">CHOOSE YOUR EXPERIENCE</span>

        <h2>
          Understanding doesn't always
          <br />
          look the <span>same.</span>
        </h2>

        <p>
          Choose the experience that fits your conversation.
        </p>
      </div>

      <div className="modes-grid">

        {modes.map((mode) => (
          <div className={`mode-card ${mode.className}`} key={mode.title}>

            <div className="mode-icon">{mode.icon}</div>

            <span className="mode-label">{mode.label}</span>

            <h3>{mode.title}</h3>

            <p>{mode.description}</p>

            <div className="mode-features">
              {mode.features.map((feature) => (
                <div key={feature}>
                  <span>✓</span>
                  {feature}
                </div>
              ))}
            </div>

            <button
              className="mode-button"
              onClick={() => navigate(mode.route)}
            >
              {mode.button}
              <span>→</span>
            </button>

          </div>
        ))}

      </div>

    </section>
  );
}