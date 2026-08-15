const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    enum: ['user', 'ai'],
  },

  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },

  text: {
    type: String,
    required: true,
  },

  emotion: {
    type: String,
    default: null,
  },

  intensity: {
    type: Number,
    default: null,
  },

  temperature: {
    type: Number,
    default: null,
  },

  trend: {
    type: String,
    enum: ['rising', 'falling', 'stable', null],
    default: null,
  },

  reasoning: {
    type: String,
    default: null,
  },

  note: {
    type: String,
    default: null,
  },

  language: {
    type: String,
    enum: ['en', 'hi', 'gu'],
    default: 'en',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  roomId: {
    type: String,
    unique: true,
    sparse: true,
  },

  mode: {
    type: String,
    enum: ['live', 'private', 'solo'],
    default: 'solo',
  },

  language: {
    type: String,
    enum: ['en', 'hi', 'gu'],
    default: 'en',
  },

  status: {
    type: String,
    enum: ['waiting', 'active', 'completed'],
    default: 'waiting',
  },

  temperature: {
    type: Number,
    default: 30,
  },

  messages: [messageSchema],

  reflection: {
    summary: String,
    strongestSignal: String,
    trend: String,
    turningPoints: [String],
    suggestion: String,
    note: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


conversationSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});


module.exports = mongoose.model(
  'Conversation',
  conversationSchema
);