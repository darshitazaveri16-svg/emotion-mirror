const express = require('express');
const router = express.Router();

const Conversation = require('../models/Conversation');
const authMiddleware = require('../middleware/authMiddleware');

// =========================
// CREATE A NEW CONVERSATION
// =========================

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { mode, temperature } = req.body;

    const conversation = new Conversation({
      userId: req.user.userId,
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


// =========================
// GET A CONVERSATION BY ID
// =========================

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

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


// =========================
// DELETE A CONVERSATION
// =========================

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

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