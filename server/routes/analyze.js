const express = require('express');
const router = express.Router();

const Conversation = require('../models/Conversation');
const { analyzeEmotion } = require('../services/emotionService');
const authMiddleware = require('../middleware/authMiddleware');

// =========================
// ANALYZE EMOTION
// =========================

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'message is required'
      });
    }

    // Analyze message using Gemini AI
    const result = await analyzeEmotion(message);

    let conversation;

    // If conversation ID is provided,
    // make sure it belongs to the logged-in user
    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId: req.user.userId
      });
    }

    // Create a new conversation if one doesn't exist
    if (!conversation) {
      conversation = new Conversation({
        userId: req.user.userId,
        mode: 'solo',
        messages: []
      });
    }

    // Save user's message + emotion analysis
    conversation.messages.push({
      sender: 'user',
      text: message,
      emotion: result.emotion,
      intensity: result.intensity
    });

    // Update emotional temperature
    conversation.temperature = result.temperature;

    await conversation.save();

    res.json({
      ...result,
      conversationId: conversation._id
    });

  } catch (error) {
    console.error('Emotion analysis error:', error);

    res.status(500).json({
      error: 'Something went wrong while analyzing the message'
    });
  }
});

module.exports = router;