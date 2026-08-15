import { useNavigate } from "react-router-dom";
import "./PrivateSetup.css";

export default function PrivateSetup() {
  const navigate = useNavigate();

  const createPrivateRoom = () => {
    navigate("/private/create-room");
  };

  return (
    <div className="private-setup-page">

      <div className="private-glow private-glow-one"></div>
      <div className="private-glow private-glow-two"></div>

      <header className="private-header">

        <div
          className="private-logo"
          onClick={() => navigate("/")}
        >
          <span>🪞</span>
          Emotion<span>Mirror</span>
        </div>

        <div className="private-label">
          🔒 PRIVATE MODE
        </div>

      </header>


      <main className="private-setup-content">

        <div className="private-icon">
          🔒
        </div>

        <div className="private-badge">
          PRIVATE SPACE
        </div>

        <h1>
          A private space
          <br />
          <span>for both of you.</span>
        </h1>

        <p className="private-description">
          Have a difficult conversation without worrying
          about being misunderstood. Emotion Mirror gives
          each person their own private emotional perspective.
        </p>


        <div className="private-info-card">

          <div className="private-info-row">

            <div className="info-icon">
              👤
            </div>

            <div>
              <h3>Your private mirror</h3>

              <p>
                Your emotional insights are visible only to you.
              </p>
            </div>

          </div>


          <div className="private-info-row">

            <div className="info-icon">
              🪞
            </div>

            <div>
              <h3>AI doesn't take sides</h3>

              <p>
                It helps both people understand what may
                be happening emotionally.
              </p>
            </div>

          </div>


          <div className="private-info-row">

            <div className="info-icon">
              ✦
            </div>

            <div>
              <h3>Two private perspectives</h3>

              <p>
                Each person receives their own emotional mirror.
              </p>
            </div>

          </div>

        </div>


        <button
          className="create-private-button"
          onClick={createPrivateRoom}
        >
          Create Private Room
          <span>→</span>
        </button>


        <button
          className="private-back-button"
          onClick={() => navigate("/choose-mode")}
        >
          ← Back to modes
        </button>

      </main>

    </div>
  );
}