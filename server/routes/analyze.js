const express = require('express');

const router = express.Router();

const Conversation = require('../models/Conversation');
const { analyzeEmotion } = require('../services/emotionService');
const authMiddleware = require('../middleware/authMiddleware');


// =====================================================
// ANALYZE MESSAGE
// =====================================================

router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      message,
      conversationId,
      language = 'en',
    } = req.body;

    // -------------------------
    // VALIDATION
    // -------------------------

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


    // -------------------------
    // FIND OR CREATE CONVERSATION
    // -------------------------

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findById(
        conversationId
      );
    }

    if (!conversation) {
      conversation = new Conversation({
        userId: req.user.userId,
        mode: 'solo',
        language,
        status: 'active',
        messages: [],
      });
    }


    // -------------------------
    // GEMINI EMOTION ANALYSIS
    // -------------------------

    const result = await analyzeEmotion(
      message.trim()
    );


    // -------------------------
    // SAVE USER MESSAGE
    // -------------------------

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
    });


    // -------------------------
    // UPDATE CONVERSATION
    // -------------------------

    conversation.language = language;

    if (
      typeof result.temperature === 'number'
    ) {
      conversation.temperature =
        result.temperature;
    }

    await conversation.save();


    // -------------------------
    // RESPONSE
    // -------------------------

    res.json({
      message: 'Message analyzed successfully',

      emotion: result.emotion,

      intensity: result.intensity,

      temperature: result.temperature,

      trend: result.trend,

      reasoning: result.reasoning,

      note: result.note,

      conversationId:
        conversation._id,

      language,

      saved: true,
    });

  } catch (error) {
    console.error(
      'Emotion analysis error:',
      error
    );

    res.status(500).json({
      error:
        'Something went wrong while analyzing the message',
    });
  }
});


module.exports = router;