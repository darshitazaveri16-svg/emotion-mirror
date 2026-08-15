require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const connectDB = require('./config/db');

const Conversation = require('./models/Conversation');
const Room = require('./models/Room');

const analyzeRoute = require('./routes/analyze');
const conversationsRoute = require('./routes/conversations');
const authRoute = require('./routes/auth');
const roomsRoute = require('./routes/rooms');

const {
  analyzeEmotion,
  generateAIReply,
} = require('./services/emotionService');
const { generateUniqueRoomId } = require('./utils/generateRoomId');

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
);

app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/analyze', analyzeRoute);
app.use('/api/conversations', conversationsRoute);
app.use('/api/rooms', roomsRoute);

app.get('/', (req, res) => {
  res.json({
    status: 'Emotion Mirror backend is running',
  });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const roomParticipants = new Map();

const getParticipantCount = (roomId) => {
  const participants = roomParticipants.get(roomId);

  if (!participants) {
    return 0;
  }

  return participants.size;
};

const addParticipant = (roomId, socketId, userId) => {
  if (!roomParticipants.has(roomId)) {
    roomParticipants.set(roomId, new Map());
  }

  roomParticipants.get(roomId).set(socketId, {
    userId: userId || null,
    socketId,
  });
};

const removeParticipant = (roomId, socketId) => {
  const participants = roomParticipants.get(roomId);

  if (!participants) {
    return;
  }

  participants.delete(socketId);

  if (participants.size === 0) {
    roomParticipants.delete(roomId);
  }
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on(
    'create-room',
    async ({
      mode = 'live',
      language = 'en',
      userId = null,
      hostName = 'Host',
    }) => {
      try {
        if (!['live', 'private'].includes(mode)) {
          socket.emit('room-error', {
            error: 'Mode must be live or private',
          });
          return;
        }

        if (!['en', 'hi', 'gu'].includes(language)) {
          socket.emit('room-error', {
            error: 'Invalid language',
          });
          return;
        }

        const resolvedUserId =
          userId &&
          mongoose.Types.ObjectId.isValid(userId)
            ? userId
            : new mongoose.Types.ObjectId();

        const roomId = await generateUniqueRoomId();

        const conversation = new Conversation({
          userId: resolvedUserId,
          roomId,
          mode,
          language,
          status: 'waiting',
          messages: [],
          metadata: {
            hostName: hostName || 'Host',
          },
        });

        await conversation.save();

        await Room.create({
          roomId,
          roomType: mode,
          host: {
            userId:
              userId &&
              mongoose.Types.ObjectId.isValid(userId)
                ? userId
                : null,
            name: hostName || 'Host',
          },
          participants: [
            {
              userId:
                userId &&
                mongoose.Types.ObjectId.isValid(userId)
                  ? userId
                  : null,
              name: hostName || 'Host',
            },
          ],
          status: 'waiting',
          conversationId: conversation._id,
        });

        socket.emit('room-created', {
          roomId,
          conversationId: conversation._id,
          mode,
          language,
          status: conversation.status,
        });
      } catch (error) {
        console.error('Socket create-room error:', error);

        socket.emit('room-error', {
          error: 'Failed to create room',
        });
      }
    }
  );

  socket.on(
    'join-room',
    async ({ roomId, userId, userName = 'Guest' }) => {
      try {
        if (!roomId) {
          socket.emit('room-error', {
            error: 'Room ID is required',
          });
          return;
        }

        const normalizedRoomId = roomId.toUpperCase();

        const conversation = await Conversation.findOne({
          roomId: normalizedRoomId,
        });

        if (!conversation) {
          socket.emit('room-error', {
            error: 'Room not found',
          });
          return;
        }

        socket.join(normalizedRoomId);

        socket.roomId = normalizedRoomId;
        socket.userId = userId || null;
        socket.userName = userName || 'Guest';

        addParticipant(
          normalizedRoomId,
          socket.id,
          userId || null
        );

        const participantCount =
          getParticipantCount(normalizedRoomId);

        if (participantCount >= 2) {
          conversation.status = 'active';
          await conversation.save();

          await Room.findOneAndUpdate(
            { roomId: normalizedRoomId },
            {
              status: 'active',
              startedAt: new Date(),
            }
          );
        }

        socket.emit('room-joined', {
          roomId: normalizedRoomId,
          conversationId: conversation._id,
          mode: conversation.mode,
          language: conversation.language,
          status: conversation.status,
          participantCount,
        });

        socket.to(normalizedRoomId).emit('user-joined', {
          userId: userId || null,
          userName: userName || 'Guest',
          roomId: normalizedRoomId,
          participantCount,
        });

        if (participantCount >= 2) {
          io.to(normalizedRoomId).emit('both-joined', {
            roomId: normalizedRoomId,
            conversationId: conversation._id,
            participantCount,
          });
        }

        console.log(
          `User ${userId || 'unknown'} joined room ${normalizedRoomId}`
        );
      } catch (error) {
        console.error('Socket join-room error:', error);

        socket.emit('room-error', {
          error: 'Failed to join room',
        });
      }
    }
  );

  socket.on(
    'send-message',
    async ({
      roomId,
      conversationId,
      userId,
      text,
      language = 'en',
    }) => {
      try {
        if (!roomId || !text || !text.trim()) {
          socket.emit('room-error', {
            error: 'Room ID and message are required',
          });
          return;
        }

        const conversation =
          await Conversation.findById(conversationId);

        if (!conversation) {
          socket.emit('room-error', {
            error: 'Conversation not found',
          });
          return;
        }

        if (!['en', 'hi', 'gu'].includes(language)) {
          socket.emit('room-error', {
            error: 'Invalid language',
          });
          return;
        }

        const context = conversation.messages
          .slice(-10)
          .map(
            (message) =>
              `${message.sender}: ${message.text}`
          )
          .join('\n');

        const result = await analyzeEmotion(
          text.trim(),
          context
        );

        const aiReply = await generateAIReply(
          text.trim(),
          language,
          result.emotion,
          context
        );

        conversation.messages.push({
          sender: 'user',
          senderId:
            userId &&
            mongoose.Types.ObjectId.isValid(userId)
              ? userId
              : null,
          text: text.trim(),
          emotion: result.emotion,
          intensity: result.intensity,
          temperature: result.temperature,
          trend: result.trend,
          language,
          reasoning: result.reasoning,
          note: result.note,
        });

        conversation.messages.push({
          sender: 'ai',
          text: aiReply,
          emotion: null,
          intensity: null,
          temperature: result.temperature,
          trend: result.trend,
          language,
          reasoning: null,
        });

        conversation.temperature = result.temperature;
        conversation.language = language;

        if (conversation.status === 'waiting') {
          conversation.status = 'active';
        }

        await conversation.save();

        io.to(roomId).emit('new-message', {
          sender: 'user',
          senderId: userId || null,
          text: text.trim(),
          language,
          conversationId: conversation._id,
        });

        socket.to(roomId).emit('private-mirror', {
          aboutUserId: userId || null,
          emotion: result.emotion,
          intensity: result.intensity,
          temperature: result.temperature,
          trend: result.trend,
          reasoning: result.reasoning,
          note: result.note,
          language,
          conversationId: conversation._id,
        });

        if (
          conversation.mode === 'live' ||
          conversation.mode === 'private'
        ) {
          socket.emit('emotion-update', {
            emotion: result.emotion,
            intensity: result.intensity,
            temperature: result.temperature,
            trend: result.trend,
            reasoning: result.reasoning,
            note: result.note,
            language,
          });
        }

        io.to(roomId).emit('ai-message', {
          sender: 'ai',
          text: aiReply,
          language,
          conversationId: conversation._id,
        });
      } catch (error) {
        console.error('Socket send-message error:', error);

        socket.emit('room-error', {
          error: 'Failed to send message',
        });
      }
    }
  );

  socket.on('leave-room', () => {
    const roomId = socket.roomId;

    if (roomId) {
      removeParticipant(roomId, socket.id);
      socket.leave(roomId);

      const participantCount = getParticipantCount(roomId);

      socket.to(roomId).emit('user-left', {
        userId: socket.userId || null,
        roomId,
        participantCount,
      });

      socket.roomId = null;
    }
  });

  socket.on('disconnect', () => {
    const roomId = socket.roomId;

    if (roomId) {
      removeParticipant(roomId, socket.id);

      const participantCount = getParticipantCount(roomId);

      socket.to(roomId).emit('user-left', {
        userId: socket.userId || null,
        roomId,
        participantCount,
      });
    }

    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});
