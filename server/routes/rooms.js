const express = require("express");
const mongoose = require("mongoose");

const Conversation = require("../models/Conversation");
const Room = require("../models/Room");
const optionalAuth = require("../middleware/optionalAuth");
const { generateUniqueRoomId } = require("../utils/generateRoomId");

const router = express.Router();

// ======================================================
// CREATE ROOM
// ======================================================

router.post("/", optionalAuth, async (req, res) => {
  try {
    const {
      mode = "live",
      language = "en",
      hostName = "Host",
      guestUserId = null,
      conversationType = null,
      focus = null,
    } = req.body;

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!["live", "private"].includes(mode)) {
      return res.status(400).json({
        error: "Mode must be live or private",
      });
    }

    if (!["en", "hi", "gu"].includes(language)) {
      return res.status(400).json({
        error: "Invalid language. Use en, hi or gu",
      });
    }

    if (!hostName || !hostName.trim()) {
      return res.status(400).json({
        error: "Host name is required",
      });
    }

    // -----------------------------
    // RESOLVE USER
    // -----------------------------

    let userId = null;

    // Logged-in user from JWT
    if (
      req.user?.userId &&
      mongoose.Types.ObjectId.isValid(req.user.userId)
    ) {
      userId = req.user.userId;
    }

    // Guest/session user fallback
    else if (
      guestUserId &&
      mongoose.Types.ObjectId.isValid(guestUserId)
    ) {
      userId = guestUserId;
    }

    /*
      Conversation.userId is required.

      If neither authenticated user nor valid guest ID
      exists, create a temporary ObjectId so guest mode
      can still work.
    */
    else {
      userId = new mongoose.Types.ObjectId();
    }

    // -----------------------------
    // GENERATE UNIQUE ROOM ID
    // -----------------------------

    const roomId = await generateUniqueRoomId();

    console.log("Creating room:", {
      roomId,
      mode,
      language,
      hostName: hostName.trim(),
      userId: userId.toString(),
    });

    // -----------------------------
    // CREATE CONVERSATION
    // -----------------------------

    const conversation = new Conversation({
      userId,
      roomId,
      mode,
      language,
      status: "waiting",
      messages: [],
      metadata: {
        conversationType,
        focus,
        hostName: hostName.trim(),
      },
    });

    await conversation.save();

    console.log(
      "Conversation created:",
      conversation._id.toString()
    );

    // -----------------------------
    // CREATE ROOM
    // -----------------------------

    const room = new Room({
      roomId,
      roomType: mode,

      host: {
        userId,
        name: hostName.trim(),
        socketId: null,
      },

      participants: [
        {
          userId,
          name: hostName.trim(),
          socketId: null,
          isConnected: false,
        },
      ],

      status: "waiting",
      conversationId: conversation._id,
    });

    await room.save();

    console.log(
      "Room created:",
      room.roomId
    );

    // -----------------------------
    // RESPONSE
    // -----------------------------

    return res.status(201).json({
      message: "Room created successfully",

      roomId: room.roomId,

      conversationId: conversation._id,

      mode: room.roomType,

      language,

      status: conversation.status,
    });

  } catch (error) {
    console.error("Create room error:", error);

    return res.status(500).json({
      error:
        error.message ||
        "Failed to create room",
    });
  }
});


// ======================================================
// GET / VALIDATE ROOM
// ======================================================

router.get("/:roomId", async (req, res) => {
  try {
    const roomId = req.params.roomId.toUpperCase();

    const room = await Room.findOne({
      roomId,
    });

    if (!room) {
      return res.status(404).json({
        error: "Room not found",
      });
    }

    const conversation = await Conversation.findById(
      room.conversationId
    );

    return res.json({
      roomId: room.roomId,

      conversationId:
        room.conversationId,

      mode: room.roomType,

      language:
        conversation?.language || "en",

      status: room.status,

      participantCount:
        room.participants?.length || 0,
    });

  } catch (error) {
    console.error(
      "Get room error:",
      error
    );

    return res.status(500).json({
      error:
        error.message ||
        "Failed to fetch room",
    });
  }
});


module.exports = router;