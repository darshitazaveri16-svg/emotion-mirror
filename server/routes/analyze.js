const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');

router.post('/', async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    // Dummy emotion logic for now — real AI/LLM call yaha aayega
    const result = {
      emotion: 'hurt',
      intensity: 0.68,
      temperature: 58,
      trend: 'rising',
      note: 'AI interpretation — not a fact'
    };

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

    res.json({ ...result, conversationId: conversation._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;