const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const { analyzeEmotion } = require('../services/emotionService');

router.post('/', async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    // Analyze message using Gemini AI
    const result = await analyzeEmotion(message);

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation) {
      conversation = new Conversation({ mode: 'solo' });
    }

    conversation.messages.push({
      sender: 'user',
      text: message,
      emotion: result.emotion,
      intensity: result.intensity
    });

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