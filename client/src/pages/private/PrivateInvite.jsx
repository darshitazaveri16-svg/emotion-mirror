import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socket, { connectSocket } from "../../services/socket";
import {
  getSessionUserId,
  getSessionUserName,
  persistSessionRoom,
} from "../../utils/session";
import "./PrivateInvite.css";

export default function PrivateInvite() {
  const navigate = useNavigate();
  const location = useLocation();

  const roomCode =
    location.state?.roomCode ||
    localStorage.getItem("roomId") ||
    "";
  const hostName =
    location.state?.hostName || getSessionUserName();

  const [partnerJoined, setPartnerJoined] = useState(false);

  useEffect(() => {
    if (!roomCode) {
      navigate("/private/create-room");
      return undefined;
    }

    persistSessionRoom({
      roomId: roomCode,
      conversationId: location.state?.conversationId,
      language: location.state?.language,
      mode: "private",
    });

    const handleConnect = () => {
      socket.emit("join-room", {
        roomId: roomCode,
        userId: getSessionUserId(),
        userName: hostName,
      });
    };

    const handleBothJoined = () => {
      navigate("/private/both-joined", {
        state: {
          roomCode,
          ...location.state,
        },
      });
    };

    socket.on("connect", handleConnect);
    socket.on("user-joined", () => setPartnerJoined(true));
    socket.on("both-joined", handleBothJoined);

    connectSocket();

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("user-joined");
      socket.off("both-joined", handleBothJoined);
    };
  }, [roomCode, hostName, location.state, navigate]);

  const copyInvite = async () => {
    const inviteText = `Join my private Emotion Mirror conversation. Room code: ${roomCode}`;

    await navigator.clipboard.writeText(inviteText);
    alert("Invite copied!");
  };

  return (
    <div className="private-invite-page">
      <main className="private-invite-content">
        <div className="invite-icon">💌</div>

        <div className="invite-label">INVITE YOUR PARTNER</div>

        <h1>
          Bring the other
          <br />
          <span>person in.</span>
        </h1>

        <p>
          Share the room code or invite message. Your partner
          can join from their own device.
        </p>

        <div className="invite-code">
          <small>ROOM CODE</small>
          <strong>{roomCode}</strong>
        </div>

        <button className="invite-button" onClick={copyInvite}>
          Copy Invite
          <span>↗</span>
        </button>

        <button
          className="waiting-button"
          onClick={() =>
            navigate("/private/waiting", {
              state: location.state,
            })
          }
        >
          {partnerJoined
            ? "Partner joined — continue"
            : "I've invited them"}
        </button>
      </main>
    </div>
  );
}
