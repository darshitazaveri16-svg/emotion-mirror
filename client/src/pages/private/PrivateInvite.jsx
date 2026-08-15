import { useNavigate } from "react-router-dom";
import "./PrivateInvite.css";

export default function PrivateInvite() {
  const navigate = useNavigate();

  const roomCode = "EM-4829";

  const copyInvite = async () => {
    const inviteText =
      `Join my private Emotion Mirror conversation. Room code: ${roomCode}`;

    await navigator.clipboard.writeText(inviteText);

    alert("Invite copied!");
  };

  return (
    <div className="private-invite-page">

      <main className="private-invite-content">

        <div className="invite-icon">
          💌
        </div>

        <div className="invite-label">
          INVITE YOUR PARTNER
        </div>

        <h1>
          Bring the other
          <br />
          <span>person in.</span>
        </h1>

        <p>
          Share the room code or invite message.
          Your partner can join from their own device.
        </p>


        <div className="invite-code">
          <small>ROOM CODE</small>
          <strong>{roomCode}</strong>
        </div>


        <button
          className="invite-button"
          onClick={copyInvite}
        >
          Copy Invite
          <span>↗</span>
        </button>


        <button
          className="waiting-button"
          onClick={() => navigate("/private/waiting")}
        >
          I've invited them
        </button>

      </main>

    </div>
  );
}