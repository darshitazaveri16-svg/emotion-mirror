import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PrivateJoin.css";

export default function PrivateJoin() {
  const navigate = useNavigate();

  const [roomCode, setRoomCode] = useState("");

  const joinRoom = (e) => {
    e.preventDefault();

    if (roomCode.trim().length < 4) {
      return;
    }

    navigate("/private/waiting");
  };

  return (
    <div className="partner-join-page">

      <main className="partner-join-content">

        <div className="join-icon">
          🔗
        </div>

        <div className="join-label">
          JOIN PRIVATE ROOM
        </div>

        <h1>
          Someone invited
          <br />
          <span>you in.</span>
        </h1>

        <p>
          Enter the private room code shared with you
          to join the conversation.
        </p>


        <form onSubmit={joinRoom}>

          <label>ROOM CODE</label>

          <input
            value={roomCode}
            onChange={(e) =>
              setRoomCode(e.target.value.toUpperCase())
            }
            placeholder="EM-4829"
            maxLength={12}
          />

          <button type="submit">
            Join Private Room
            <span>→</span>
          </button>

        </form>

      </main>

    </div>
  );
}