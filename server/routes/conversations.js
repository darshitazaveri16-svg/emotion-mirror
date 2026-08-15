const express = require('express');
const mongoose = require('mongoose');

const Conversation = require('../models/Conversation');
const authMiddleware = require('../middleware/authMiddleware');
const {
  generateFinalReflection,
} = require('../services/emotionService');

const router = express.Router();


// CREATE CONVERSATION
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      mode = 'solo',
      language = 'en',
    } = req.body;

    const conversation = new Conversation({
      userId: req.user.userId,
      mode,
      language,
      status: mode === 'solo' ? 'active' : 'waiting',
      messages: [],
    });

    await conversation.save();

    res.status(201).json({
      message: 'Conversation created successfully',
      conversation,
    });
  } catch (error) {
    console.error('Create conversation error:', error);

    res.status(500).json({
      error: 'Failed to create conversation',
    });
  }
});


// GET MY CONVERSATIONS
router.get('/', authMiddleware, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      userId: req.user.userId,
    }).sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);

    res.status(500).json({
      error: 'Failed to fetch conversations',
    });
  }
});


// GET ONE CONVERSATION
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        error: 'Invalid conversation ID',
      });
    }

    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!conversation) {
      return res.status(404).json({
        error: 'Conversation not found',
      });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Get conversation error:', error);

    res.status(500).json({
      error: 'Failed to fetch conversation',
    });
  }
});


// FINAL REFLECTION
router.post(
  '/:id/reflection',
  authMiddleware,
  async (req, res) => {
    try {
      const conversation = await Conversation.findOne({
        _id: req.params.id,
        userId: req.user.userId,
      });

      if (!conversation) {
        return res.status(404).json({
          error: 'Conversation not found',
        });
      }

      const reflection = await generateFinalReflection(
        conversation.messages,
        conversation.language
      );

      conversation.reflection = reflection;
      conversation.status = 'completed';

      await conversation.save();

      res.json({
        message: 'Reflection generated successfully',
        reflection,
      });
    } catch (error) {
      console.error(
        'Reflection error:',
        error
      );

      res.status(500).json({
        error: 'Failed to generate reflection',
      });
    }
  }
);


// DELETE CONVERSATION
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const conversation =
      await Conversation.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.userId,
      });

    if (!conversation) {
      return res.status(404).json({
        error: 'Conversation not found',
      });
    }

    res.json({
      message: 'Conversation deleted successfully',
    });
  } catch (error) {
    console.error('Delete conversation error:', error);

    res.status(500).json({
      error: 'Failed to delete conversation',
    });
  }
});


module.exports = router;