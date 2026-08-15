import { useNavigate } from "react-router-dom";
import "./BothPrivateJoined.css";

export default function BothPrivateJoined() {
  const navigate = useNavigate();

  const startConversation = () => {
    navigate("/private/conversation");
  };

  return (
    <div className="both-joined-page">

      <main className="both-joined-content">

        <div className="joined-icon">
          ✓
        </div>

        <div className="joined-label">
          BOTH OF YOU ARE HERE
        </div>

        <h1>
          You're ready
          <br />
          <span>to talk.</span>
        </h1>

        <p>
          Your private conversation space is ready.
          Each person will receive their own private
          emotional mirror.
        </p>


        <div className="joined-people">

          <div className="joined-person">

            <div className="joined-avatar">
              Y
            </div>

            <div>
              <strong>You</strong>
              <small>Connected</small>
            </div>

            <span>✓</span>

          </div>


          <div className="joined-connector">
            <span></span>
            <span>PRIVATE</span>
            <span></span>
          </div>


          <div className="joined-person">

            <div className="joined-avatar partner">
              P
            </div>

            <div>
              <strong>Your Partner</strong>
              <small>Connected</small>
            </div>

            <span>✓</span>

          </div>

        </div>


        <div className="privacy-reminder">

          <span>🔒</span>

          <div>
            <strong>Your mirrors stay private.</strong>

            <p>
              You will only see your own emotional insights.
            </p>
          </div>

        </div>


        <button
          className="start-private-conversation"
          onClick={startConversation}
        >
          Start Conversation
          <span>→</span>
        </button>

      </main>

    </div>
  );
}