import { useNavigate } from "react-router-dom";
import "./PrivateRoomCreated.css";

export default function PrivateRoomCreated() {
  const navigate = useNavigate();

  const roomCode = "EM-4829";

  const copyRoomCode = async () => {
    await navigator.clipboard.writeText(roomCode);
    alert("Room code copied!");
  };

  const continueToInvite = () => {
    navigate("/private/invite");
  };

  return (
    <div className="room-created-page">

      <main className="room-created-content">

        <div className="success-icon">
          ✓
        </div>

        <div className="room-created-label">
          PRIVATE ROOM CREATED
        </div>

        <h1>
          Your private room
          <br />
          <span>is ready.</span>
        </h1>

        <p>
          Share this room code with the person
          you want to have the conversation with.
        </p>


        <div className="room-code-card">

          <small>ROOM CODE</small>

          <strong>{roomCode}</strong>

          <button onClick={copyRoomCode}>
            Copy code
          </button>

        </div>


        <button
          className="invite-next-button"
          onClick={continueToInvite}
        >
          Invite Partner
          <span>→</span>
        </button>

      </main>

    </div>
  );
}