require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./config/db');

const analyzeRoute = require('./routes/analyze');
const conversationsRoute = require('./routes/conversations');
const authRoute = require('./routes/auth');

const app = express();

const PORT = process.env.PORT || 5000;

// =========================
// DATABASE
// =========================

connectDB();

// =========================
// MIDDLEWARE
// =========================

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

app.use(express.json());

// =========================
// ROUTES
// =========================

app.use('/api/auth', authRoute);
app.use('/api/analyze', analyzeRoute);
app.use('/api/conversations', conversationsRoute);

// =========================
// HOME
// =========================

app.get('/', (req, res) => {
  res.json({
    status: 'Emotion Mirror backend is running',
  });
});

// =========================
// HTTP SERVER
// =========================

const server = http.createServer(app);

// =========================
// SOCKET.IO
// =========================

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// =========================
// SOCKET CONNECTION
// =========================

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// =========================
// START SERVER
// =========================

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});