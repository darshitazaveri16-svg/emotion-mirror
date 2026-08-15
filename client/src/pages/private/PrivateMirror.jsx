import { useNavigate } from "react-router-dom";
import "./PrivateMirror.css";

export default function PrivateMirror() {
  const navigate = useNavigate();

  return (
    <div className="private-mirror-page">
      <header className="mirror-header">
        <div className="mirror-logo">
          🪞 Emotion<span>Mirror</span>
        </div>

        <div className="mirror-private">🔒 ONLY YOU CAN SEE THIS</div>

        <button onClick={() => navigate("/private/conversation")}>
          ← Conversation
        </button>
      </header>

      <main className="mirror-main">
        <div className="mirror-label">YOUR PRIVATE EMOTIONAL MIRROR</div>

        <h1>
          What might be
          <br />
          <span>happening underneath?</span>
        </h1>

        <p className="mirror-description">
          Based on the conversation so far, here's a neutral interpretation of
          what your partner may be experiencing.
        </p>

        <div className="emotion-main-card">
          <div className="emotion-list">
            <div className="emotion-item">
              <div className="emotion-info">
                <span>Frustrated</span>
                <strong>72%</strong>
              </div>

              <div className="emotion-bar">
                <div style={{ width: "72%" }}></div>
              </div>
            </div>

            <div className="emotion-item">
              <div className="emotion-info">
                <span>Hurt</span>
                <strong>58%</strong>
              </div>

              <div className="emotion-bar">
                <div style={{ width: "58%" }}></div>
              </div>
            </div>

            <div className="emotion-item">
              <div className="emotion-info">
                <span>Defensive</span>
                <strong>36%</strong>
              </div>

              <div className="emotion-bar">
                <div style={{ width: "36%" }}></div>
              </div>
            </div>
            <div className="temperature-card">
              <div className="temperature-header">
                <span>CONVERSATION TEMPERATURE</span>

                <strong>Cooling down</strong>
              </div>

              <div className="temperature-track">
                <div className="temperature-point"></div>
              </div>

              <div className="temperature-labels">
                <span>Calm</span>

                <span>Tense</span>

                <span>Escalating</span>
              </div>
            </div>
            <div className="turning-point-card">
              <div className="turning-point-title">✦ RECENT TURNING POINT</div>

              <p>
                The conversation appears to be shifting from defensiveness
                toward understanding.
              </p>

              <span>A few moments ago</span>
            </div>
            <div className="suggestion-card">
              <div className="suggestion-title">💡 A GENTLE SUGGESTION</div>

              <p>
                Try asking what they need right now, rather than immediately
                explaining your own position.
              </p>

              <button>Helpful</button>
            </div>
          </div>

          <div className="emotion-icon">💭</div>

          <div>
            <small>POSSIBLE EMOTION</small>

            <h2>Frustrated</h2>

            <p>
              They may feel unheard and unsure how to communicate what they
              need.
            </p>
          </div>
        </div>

        <div className="mirror-grid">
          <div className="mirror-small-card">
            <span>Emotion strength</span>
            <strong>Moderate</strong>
          </div>

          <div className="mirror-small-card">
            <span>Direction</span>
            <strong>Cooling down</strong>
          </div>
        </div>

        <div className="mirror-note">
          🔒 This interpretation is private to you. It is not shown to your
          partner.
        </div>
      </main>
    </div>
  );
}
