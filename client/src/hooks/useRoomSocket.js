import { useEffect, useState } from "react";
import socket, {
  connectSocket,
  disconnectSocket,
} from "../services/socket";
import { getSessionUserId } from "../utils/session";

export default function useRoomSocket({
  roomId,
  conversationId: initialConversationId,
  userName,
  onBothJoined,
}) {
  const [conversationId, setConversationId] = useState(
    initialConversationId || ""
  );
  const [messages, setMessages] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState(1);
  const [typing, setTyping] = useState(false);
  const [mirror, setMirror] = useState({
    emotion: "Neutral",
    intensity: 0,
    temperature: 30,
    trend: "stable",
    reasoning: "",
    note: "",
  });
  const [roomError, setRoomError] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (!roomId) {
      return undefined;
    }

    const userId = getSessionUserId();

    const handleConnect = () => {
      socket.emit("join-room", {
        roomId,
        userId,
        userName,
      });
    };

    const handleRoomJoined = (data) => {
      setJoined(true);
      setConversationId(data.conversationId);

      if (typeof data.participantCount === "number") {
        setConnectedUsers(data.participantCount);
      }

      localStorage.setItem(
        "conversationId",
        data.conversationId
      );
    };

    const handleUserJoined = (data) => {
      if (typeof data.participantCount === "number") {
        setConnectedUsers(data.participantCount);
      } else {
        setConnectedUsers((count) => count + 1);
      }
    };

    const handleUserLeft = (data) => {
      if (typeof data.participantCount === "number") {
        setConnectedUsers(Math.max(1, data.participantCount));
      } else {
        setConnectedUsers((count) =>
          Math.max(1, count - 1)
        );
      }
    };

    const handleBothJoined = (data) => {
      if (onBothJoined) {
        onBothJoined(data);
      }
    };

    const handleNewMessage = (data) => {
      const myUserId = getSessionUserId();
      const sender =
        data.senderId === myUserId ? "you" : "them";

      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-${Math.random()}`,
          sender,
          text: data.text,
          language: data.language,
        },
      ]);

      setTyping(false);
    };

    const handleAIMessage = (data) => {
      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-${Math.random()}`,
          sender: "ai",
          text: data.text,
          language: data.language,
        },
      ]);

      setTyping(false);
    };

    const handlePrivateMirror = (data) => {
      setMirror({
        emotion: data.emotion || "Neutral",
        intensity:
          typeof data.intensity === "number"
            ? data.intensity
            : 0,
        temperature:
          typeof data.temperature === "number"
            ? data.temperature
            : 30,
        trend: data.trend || "stable",
        reasoning: data.reasoning || "",
        note: data.note || "",
      });
    };

    const handleRoomError = (data) => {
      setRoomError(
        data?.error ||
          "Something went wrong with the room."
      );
      setTyping(false);
    };

    socket.on("connect", handleConnect);
    socket.on("room-joined", handleRoomJoined);
    socket.on("user-joined", handleUserJoined);
    socket.on("user-left", handleUserLeft);
    socket.on("both-joined", handleBothJoined);
    socket.on("new-message", handleNewMessage);
    socket.on("ai-message", handleAIMessage);
    socket.on("private-mirror", handlePrivateMirror);
    socket.on("room-error", handleRoomError);

    connectSocket();

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("room-joined", handleRoomJoined);
      socket.off("user-joined", handleUserJoined);
      socket.off("user-left", handleUserLeft);
      socket.off("both-joined", handleBothJoined);
      socket.off("new-message", handleNewMessage);
      socket.off("ai-message", handleAIMessage);
      socket.off("private-mirror", handlePrivateMirror);
      socket.off("room-error", handleRoomError);
    };
  }, [roomId, userName, onBothJoined]);

  const sendMessage = (text, language = "en") => {
    const trimmedMessage = text.trim();

    if (!trimmedMessage || !roomId || !conversationId) {
      return false;
    }

    setTyping(true);

    socket.emit("send-message", {
      roomId,
      conversationId,
      userId: getSessionUserId(),
      text: trimmedMessage,
      language,
    });

    return true;
  };

  const leaveRoom = () => {
    socket.emit("leave-room");
    disconnectSocket();
  };

  return {
    conversationId,
    messages,
    connectedUsers,
    typing,
    mirror,
    roomError,
    joined,
    sendMessage,
    leaveRoom,
    setRoomError,
  };
}
