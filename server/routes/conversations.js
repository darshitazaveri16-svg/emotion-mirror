const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');

// Create a new conversation
router.post('/', async (req, res) => {
  try {
    const { mode, temperature } = req.body;

    const conversation = new Conversation({
      mode: mode || 'solo',
      temperature: temperature ?? 30,
      messages: []
    });

    await conversation.save();

    res.status(201).json({
      message: 'Conversation created successfully',
      conversation
    });
  } catch (error) {
    console.error('Create conversation error:', error);

    res.status(500).json({
      error: 'Failed to create conversation'
    });
  }
});

// Get a conversation by ID
router.get('/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({
        error: 'Conversation not found'
      });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Get conversation error:', error);

    res.status(500).json({
      error: 'Failed to fetch conversation'
    });
  }
});

// Delete a conversation
router.delete('/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndDelete(
      req.params.id
    );

    if (!conversation) {
      return res.status(404).json({
        error: 'Conversation not found'
      });
    }

    res.json({
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    console.error('Delete conversation error:', error);

    res.status(500).json({
      error: 'Failed to delete conversation'
    });
  }
});

module.exports = router;