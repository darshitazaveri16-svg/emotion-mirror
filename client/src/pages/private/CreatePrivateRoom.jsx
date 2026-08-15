import { useNavigate } from "react-router-dom";
import "./CreatePrivateRoom.css";

export default function CreatePrivateRoom() {
  const navigate = useNavigate();

  const createRoom = () => {
    navigate("/private/room-created");
  };

  return (
    <div className="create-room-page">
      <header className="create-room-header">
        <div className="create-room-logo" onClick={() => navigate("/")}>
          🪞 Emotion<span>Mirror</span>
        </div>

        <div className="create-room-private">🔒 PRIVATE</div>
      </header>

      <main className="create-room-content">
        <div className="room-step">STEP 1 OF 3</div>

        <h1>
          Create your
          <br />
          <span>private room.</span>
        </h1>

        <p className="create-room-description">
          Give your conversation a private space. Your partner will join using a
          secure room code.
        </p>

        <div className="room-preview-card">
          <div className="preview-icon">🔐</div>

          <div>
            <h3>Private conversation</h3>

            <p>Only you and your invited partner can join.</p>
          </div>
        </div>

        <button className="create-room-button" onClick={createRoom}>
          Create Private Room
          <span>→</span>
        </button>

        <button
          className="join-private-button"
          onClick={() => navigate("/private/join")}
        >
          Join Private Room
        </button>

        <button
          className="room-back-button"
          onClick={() => navigate("/private/setup")}
        >
          ← Back
        </button>
      </main>
    </div>
  );
}
