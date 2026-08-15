const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    name: {
      type: String,
      required: true,
    },

    socketId: {
      type: String,
      default: null,
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },

    isConnected: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    roomType: {
      type: String,
      enum: ['live', 'private'],
      required: true,
    },

    host: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },

      name: {
        type: String,
        required: true,
      },

      socketId: {
        type: String,
        default: null,
      },
    },

    participants: [participantSchema],

    status: {
      type: String,
      enum: ['waiting', 'active', 'ended'],
      default: 'waiting',
    },

    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      default: null,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    endedAt: {
      type: Date,
      default: null,
    },
  }
);

module.exports = mongoose.model('Room', roomSchema);