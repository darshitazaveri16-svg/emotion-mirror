const mongoose = require('mongoose');

// Schema for individual messages
const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true
  },

  text: {
    type: String,
    required: true
  },

  emotion: {
    type: String
  },

  intensity: {
    type: Number
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Schema for a conversation
const conversationSchema = new mongoose.Schema({
  // User who owns this conversation
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  mode: {
    type: String,
    enum: ['live', 'private', 'solo'],
    default: 'solo'
  },

  temperature: {
    type: Number,
    default: 30
  },

  messages: [messageSchema],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create and export Conversation model
module.exports = mongoose.model('Conversation', conversationSchema);