import { useNavigate } from "react-router-dom";
import "./PrivateReflection.css";

export default function PrivateReflection() {

  const navigate = useNavigate();

  return (
    <div className="reflection-page">

      <main className="reflection-content">

        <div className="reflection-label">
          YOUR PRIVATE REFLECTION
        </div>

        <h1>
          What the conversation
          <br />
          <span>may have revealed.</span>
        </h1>

        <p>
          This reflection is private to you.
          It helps you understand the emotional
          patterns in the conversation.
        </p>


        <div className="reflection-grid">

          <div className="reflection-card">

            <small>
              YOUR PARTNER MAY HAVE FELT
            </small>

            <h3>
              Frustrated
            </h3>

            <p>
              They may have felt that their perspective
              wasn't being fully understood.
            </p>

          </div>


          <div className="reflection-card">

            <small>
              CONVERSATION TEMPERATURE
            </small>

            <h3 className="cooling">
              Cooling down
            </h3>

            <p>
              The conversation appeared to move toward
              greater understanding.
            </p>

          </div>


          <div className="reflection-card">

            <small>
              TURNING POINT
            </small>

            <h3>
              A moment of listening
            </h3>

            <p>
              The tone shifted when both sides began
              explaining feelings rather than blame.
            </p>

          </div>


          <div className="reflection-card">

            <small>
              GENTLE NEXT STEP
            </small>

            <h3>
              Ask before assuming.
            </h3>

            <p>
              Try understanding what the other person
              needs before responding.
            </p>

          </div>

        </div>


        <div className="reflection-privacy">
          🔒 This reflection belongs only to you.
        </div>


        <button
          onClick={() => navigate("/choose-mode")}
        >
          Start New Conversation →
        </button>

      </main>

    </div>
  );
}