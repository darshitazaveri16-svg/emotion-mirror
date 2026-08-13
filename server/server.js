require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const analyzeRoute = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'Emotion Mirror backend is running' });
});

app.use('/api/analyze', analyzeRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});