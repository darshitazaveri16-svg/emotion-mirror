import { useNavigate } from "react-router-dom";
import "./PrivateWaiting.css";

export default function PrivateWaiting() {
  const navigate = useNavigate();

  const demoPartnerJoined = () => {
    navigate("/private/both-joined");
  };

  return (
    <div className="private-waiting-page">

      <main className="private-waiting-content">

        <div className="waiting-animation">
          🪞
        </div>

        <div className="waiting-label">
          PRIVATE ROOM
        </div>

        <h1>
          Waiting for
          <br />
          <span>your partner.</span>
        </h1>

        <p>
          Your private space is ready.
          We're waiting for the other person to join.
        </p>


        <div className="waiting-card">

          <div className="waiting-person active">
            <div className="person-avatar">
              Y
            </div>

            <div>
              <strong>You</strong>
              <small>Connected</small>
            </div>

            <span>✓</span>
          </div>


          <div className="waiting-line"></div>


          <div className="waiting-person">

            <div className="person-avatar muted">
              ?
            </div>

            <div>
              <strong>Your partner</strong>
              <small>Waiting to join...</small>
            </div>

            <span className="pulse-dot"></span>

          </div>

        </div>


        <button
          className="demo-join-button"
          onClick={demoPartnerJoined}
        >
          Simulate Partner Joining
        </button>

        <p className="demo-note">
          Demo control — remove when backend is connected.
        </p>

      </main>

    </div>
  );
}