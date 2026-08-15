require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const crypto = require('crypto');

const { Server } = require('socket.io');

const connectDB = require('./config/db');

const Conversation = require('./models/Conversation');

const analyzeRoute = require('./routes/analyze');
const conversationsRoute = require('./routes/conversations');
const authRoute = require('./routes/auth');

const {
  analyzeEmotion,
  generateAIReply,
} = require('./services/emotionService');

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();


app.use(
  cors({
    origin: '*',
    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
    ],
  })
);

app.use(express.json());


app.use('/api/auth', authRoute);
app.use('/api/analyze', analyzeRoute);
app.use('/api/conversations', conversationsRoute);


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


io.on('connection', (socket) => {
  console.log('User connected:', socket.id);


  // ==========================================
  // CREATE ROOM
  // ==========================================

  socket.on(
    'create-room',
    async ({
      userId,
      mode = 'live',
      language = 'en',
    }) => {
      try {
        if (!userId) {
          return socket.emit('room-error', {
            error: 'User ID is required',
          });
        }

        const roomId =
          crypto.randomBytes(4).toString('hex');

        const conversation =
          new Conversation({
            userId,
            roomId,
            mode,
            language,
            status: 'waiting',
            messages: [],
          });

        await conversation.save();

        socket.join(roomId);

        socket.roomId = roomId;
        socket.userId = userId;

        socket.emit('room-created', {
          roomId,
          conversationId: conversation._id,
          mode,
          language,
        });

      } catch (error) {
        console.error(
          'Create room error:',
          error
        );

        socket.emit('room-error', {
          error: 'Failed to create room',
        });
      }
    }
  );


  // ==========================================
  // JOIN ROOM
  // ==========================================

  socket.on(
    'join-room',
    async ({ roomId, userId }) => {
      try {
        if (!roomId) {
          return socket.emit('room-error', {
            error: 'Room ID is required',
          });
        }

        const conversation =
          await Conversation.findOne({
            roomId,
          });

        if (!conversation) {
          return socket.emit('room-error', {
            error: 'Room not found',
          });
        }

        socket.join(roomId);

        socket.roomId = roomId;
        socket.userId = userId || null;

        conversation.status = 'active';

        await conversation.save();

        socket.emit('room-joined', {
          roomId,
          conversationId: conversation._id,
          mode: conversation.mode,
          language: conversation.language,
          status: conversation.status,
        });

        socket
          .to(roomId)
          .emit('user-joined', {
            userId: userId || null,
            roomId,
          });

      } catch (error) {
        console.error(
          'Join room error:',
          error
        );

        socket.emit('room-error', {
          error: 'Failed to join room',
        });
      }
    }
  );


  // ==========================================
  // SEND MESSAGE
  // ==========================================

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
        if (!roomId || !text?.trim()) {
          return socket.emit('room-error', {
            error:
              'Room ID and message are required',
          });
        }

        if (
          !['en', 'hi', 'gu'].includes(language)
        ) {
          return socket.emit('room-error', {
            error: 'Invalid language',
          });
        }

        const conversation =
          await Conversation.findById(
            conversationId
          );

        if (!conversation) {
          return socket.emit('room-error', {
            error: 'Conversation not found',
          });
        }


        // Previous context
        const context =
          conversation.messages
            .slice(-10)
            .map(
              (m) =>
                `${m.sender}: ${m.text}`
            )
            .join('\n');


        // AI EMOTION ANALYSIS
        const result =
          await analyzeEmotion(
            text.trim(),
            context
          );


        // SAVE USER MESSAGE
        conversation.messages.push({
          sender: 'user',
          senderId: userId || null,
          text: text.trim(),
          emotion: result.emotion,
          intensity: result.intensity,
          temperature: result.temperature,
          trend: result.trend,
          reasoning: result.reasoning,
          note: result.note,
          language,
        });


        conversation.temperature =
          result.temperature;

        conversation.language =
          language;


        // AI REPLY
        const aiReply =
          await generateAIReply(
            text.trim(),
            language,
            result.emotion,
            context
          );


        // SAVE AI MESSAGE
        conversation.messages.push({
          sender: 'ai',
          senderId: null,
          text: aiReply,
          language,
        });


        await conversation.save();


        // ======================================
        // PUBLIC/LIVE MESSAGE
        // ======================================

        io.to(roomId).emit(
          'new-message',
          {
            sender: 'user',
            senderId: userId || null,
            text: text.trim(),
            emotion: result.emotion,
            intensity: result.intensity,
            temperature: result.temperature,
            trend: result.trend,
            reasoning: result.reasoning,
            note: result.note,
            language,
            conversationId:
              conversation._id,
          }
        );


        // ======================================
        // AI MESSAGE
        // ======================================

        io.to(roomId).emit(
          'ai-message',
          {
            sender: 'ai',
            text: aiReply,
            language,
            conversationId:
              conversation._id,
          }
        );

      } catch (error) {
        console.error(
          'Socket send-message error:',
          error
        );

        socket.emit('room-error', {
          error:
            'Failed to send message',
        });
      }
    }
  );


  // ==========================================
  // LEAVE ROOM
  // ==========================================

  socket.on(
    'leave-room',
    async () => {
      const roomId = socket.roomId;

      if (!roomId) return;

      socket.leave(roomId);

      socket
        .to(roomId)
        .emit('user-left', {
          userId:
            socket.userId || null,
          roomId,
        });

      socket.roomId = null;
    }
  );


  // ==========================================
  // DISCONNECT
  // ==========================================

  socket.on(
    'disconnect',
    () => {
      console.log(
        'User disconnected:',
        socket.id
      );
    }
  );
});


server.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});