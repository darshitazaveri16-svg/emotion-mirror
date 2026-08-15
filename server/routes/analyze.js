const express = require('express');

const router = express.Router();

const Conversation = require('../models/Conversation');
const {
  analyzeEmotion,
  generateAIReply,
} = require('../services/emotionService');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      message,
      conversationId,
      language = 'en',
    } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: 'message is required',
      });
    }

    if (!['en', 'hi', 'gu'].includes(language)) {
      return res.status(400).json({
        error: 'Invalid language. Use en, hi or gu',
      });
    }

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId: req.user.userId,
      });

      if (!conversation) {
        return res.status(404).json({
          error: 'Conversation not found',
        });
      }
    } else {
      conversation = new Conversation({
        userId: req.user.userId,
        mode: 'solo',
        language,
        status: 'active',
        messages: [],
      });
    }

    const context = conversation.messages
      .slice(-10)
      .map(
        (entry) =>
          `${entry.sender}: ${entry.text}`
      )
      .join('\n');

    const result = await analyzeEmotion(
      message.trim(),
      context
    );

    const aiReply = await generateAIReply(
      message.trim(),
      language,
      result.emotion,
      context
    );

    conversation.messages.push({
      sender: 'user',
      senderId: req.user.userId,
      text: message.trim(),
      emotion: result.emotion || null,
      intensity:
        typeof result.intensity === 'number'
          ? result.intensity
          : null,
      temperature:
        typeof result.temperature === 'number'
          ? result.temperature
          : null,
      trend: result.trend || null,
      language,
      reasoning: result.reasoning || null,
      note: result.note || null,
    });

    conversation.messages.push({
      sender: 'ai',
      text: aiReply,
      language,
      temperature: result.temperature || null,
      trend: result.trend || null,
    });

    conversation.language = language;

    if (typeof result.temperature === 'number') {
      conversation.temperature = result.temperature;
    }

    await conversation.save();

    res.json({
      message: 'Message analyzed successfully',
      emotion: result.emotion,
      intensity: result.intensity,
      temperature: result.temperature,
      trend: result.trend,
      reasoning: result.reasoning,
      note: result.note,
      aiReply,
      conversationId: conversation._id,
      language,
      saved: true,
    });
  } catch (error) {
    console.error('Emotion analysis error:', error);

    res.status(500).json({
      error:
        'Something went wrong while analyzing the message',
    });
  }
});


module.exports = router;
