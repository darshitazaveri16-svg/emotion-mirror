import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">

      <div className="hero-glow glow-one"></div>
      <div className="hero-glow glow-two"></div>

      <div className="hero-content">

        <div className="hero-badge">
          <span className="status-dot"></span>
          AI-powered emotional understanding
        </div>

        <h1>
          See what
          <br />
          <span>words don't say.</span>
        </h1>

        <p className="hero-description">
          Emotion Mirror helps you understand the emotional signals
          behind difficult conversations — without taking sides.
        </p>

        <div className="hero-buttons">
          <button
            className="primary-button"
            onClick={() => navigate("/choose-mode")}
          >
            Start Understanding
            <span>→</span>
          </button>

          <a href="#how-it-works" className="secondary-button">
            See how it works
          </a>
        </div>

        <p className="hero-note">
          ✦ AI interpretations are possibilities, not facts.
        </p>

      </div>

      <div className="hero-visual">

        <div className="emotion-card">

          <div className="card-header">
            <div>
              <span className="mini-label">EMOTION MIRROR</span>
              <h3>Possible emotional signals</h3>
            </div>

            <span className="private-badge">PRIVATE</span>
          </div>

          <div className="message-preview">
            "You never really listen to me."
          </div>

          <div className="emotion-row">
            <div className="emotion-info">
              <span className="emotion-emoji">😔</span>
              <div>
                <strong>Hurt</strong>
                <small>Possible signal</small>
              </div>
            </div>

            <strong>76%</strong>
          </div>

          <div className="progress">
            <div style={{ width: "76%" }}></div>
          </div>

          <div className="emotion-row">
            <div className="emotion-info">
              <span className="emotion-emoji">🛡️</span>
              <div>
                <strong>Defensive</strong>
                <small>Possible signal</small>
              </div>
            </div>

            <strong>51%</strong>
          </div>

          <div className="progress">
            <div style={{ width: "51%" }}></div>
          </div>

          <div className="temperature">
            <div>
              <span>Conversation temperature</span>
              <strong>Rising ↑</strong>
            </div>

            <div className="temperature-value">68%</div>
          </div>

          <div className="card-disclaimer">
            AI interpretation — not a fact
          </div>

        </div>

      </div>

    </section>
  );
}