import { useLocation, useNavigate } from "react-router-dom";
import "./BothJoined.css";

export default function BothJoined() {
  const navigate = useNavigate();
  const location = useLocation();

  const name = location.state?.name || "You";
  const roomCode = location.state?.roomCode || "EM-4827";

  const startConversation = () => {
    navigate("/live/room", {
      state: {
        name,
        roomCode,
      },
    });
  };

  return (
    <div className="both-joined-page">

      <div className="both-glow both-glow-one"></div>
      <div className="both-glow both-glow-two"></div>

      {/* HEADER */}

      <header className="both-header">

        <div
          className="both-logo"
          onClick={() => navigate("/")}
        >
          <span>🪞</span>
          Emotion<span>Mirror</span>
        </div>

        <div className="both-room">
          ROOM <strong>{roomCode}</strong>
        </div>

      </header>


      {/* MAIN */}

      <main className="both-content">

        <div className="both-badge">
          <span></span>
          BOTH CONNECTED
        </div>

        <h1>
          You're both
          <br />
          <span>here.</span>
        </h1>

        <p className="both-description">
          The room is ready. When you start, you'll share
          the conversation while your emotional mirror
          remains completely private.
        </p>


        {/* PEOPLE */}

        <section className="both-people-card">

          <div className="both-person">

            <div className="both-avatar you">
              👤
            </div>

            <h3>{name}</h3>

            <div className="person-connected">
              <span></span>
              CONNECTED
            </div>

          </div>


          <div className="both-connection">

            <div className="connection-glow"></div>

            <span>↔</span>

            <small>CONNECTED</small>

          </div>


          <div className="both-person">

            <div className="both-avatar partner">
              👤
            </div>

            <h3>Your partner</h3>

            <div className="person-connected">
              <span></span>
              CONNECTED
            </div>

          </div>

        </section>


        {/* READY MESSAGE */}

        <div className="ready-message">

          <div className="ready-icon">
            ✦
          </div>

          <div>
            <h3>Ready to understand, not to win.</h3>

            <p>
              Emotion Mirror won't take sides.
              It simply helps make emotions easier to see.
            </p>
          </div>

        </div>


        {/* START */}

        <button
          className="start-conversation-button"
          onClick={startConversation}
        >
          Start Conversation
          <span>→</span>
        </button>


        <div className="both-privacy">
          🔒 Your emotional interpretation will only be visible to you.
        </div>

      </main>

    </div>
  );
}