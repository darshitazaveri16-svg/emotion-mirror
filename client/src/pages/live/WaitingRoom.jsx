import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./WaitingRoom.css";

export default function WaitingRoom() {
  const navigate = useNavigate();
  const location = useLocation();

  const name = location.state?.name || "You";
  const roomCode = location.state?.roomCode || "EM-4827";

  // FRONTEND DEMO ONLY
  // Later your backend will tell us when the partner joins.
  useEffect(() => {
    // Nothing here yet.
  }, []);

  return (
    <div className="waiting-room-page">

      <div className="waiting-glow waiting-glow-one"></div>
      <div className="waiting-glow waiting-glow-two"></div>

      {/* HEADER */}

      <header className="waiting-header">

        <button
          className="waiting-back"
          onClick={() => navigate("/live/join")}
        >
          ← Back
        </button>

        <div
          className="waiting-logo"
          onClick={() => navigate("/")}
        >
          <span>🪞</span>
          Emotion<span>Mirror</span>
        </div>

        <div className="waiting-room-code">
          ROOM <strong>{roomCode}</strong>
        </div>

      </header>


      {/* MAIN */}

      <main className="waiting-content">

        <div className="waiting-badge">
          <span></span>
          ROOM CONNECTED
        </div>

        <h1>
          You're in.
          <br />
          <span>We're waiting for them.</span>
        </h1>

        <p className="waiting-description">
          Your room is ready. Once the other person joins,
          you'll both be able to start the conversation.
        </p>


        {/* PEOPLE CARD */}

        <section className="people-card">

          <div className="person-block">

            <div className="person-avatar you-avatar">
              👤
            </div>

            <div className="person-name">
              {name}
            </div>

            <div className="person-status connected">
              <span></span>
              YOU'RE CONNECTED
            </div>

          </div>


          <div className="connection-line">

            <div className="connection-dot"></div>

            <div className="connection-dashes"></div>

            <div className="connection-dot waiting-dot"></div>

          </div>


          <div className="person-block">

            <div className="person-avatar partner-avatar">
              👤
            </div>

            <div className="person-name">
              Your partner
            </div>

            <div className="person-status waiting">
              <span></span>
              WAITING
            </div>

          </div>

        </section>


        {/* STATUS */}

        <div className="waiting-status-card">

          <div className="status-spinner"></div>

          <div>
            <h3>Waiting for your partner</h3>

            <p>
              Keep this page open. We'll let you know
              as soon as they join.
            </p>
          </div>

        </div>


        {/* ROOM CODE */}

        <div className="waiting-code">

          <span>ROOM CODE</span>

          <strong>{roomCode}</strong>

          <button
            onClick={() =>
              navigator.clipboard.writeText(roomCode)
            }
          >
            Copy
          </button>

        </div>


        {/* DEMO BUTTON */}

        <button
          className="demo-connected-button"
          onClick={() => navigate("/live/room")}
        >
          Simulate Partner Joining →
        </button>


        <div className="waiting-privacy">
          🔒 Your personal emotional mirror will remain private.
        </div>

      </main>

    </div>
  );
}