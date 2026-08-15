const Conversation = require('../models/Conversation');

const generateRoomCode = () => {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `EM-${num}`;
};

const generateUniqueRoomId = async () => {
  let roomId = generateRoomCode();
  let attempts = 0;

  while (attempts < 20) {
    const existing = await Conversation.findOne({ roomId });

    if (!existing) {
      return roomId;
    }

    roomId = generateRoomCode();
    attempts += 1;
  }

  throw new Error('Unable to generate a unique room ID');
};

module.exports = {
  generateRoomCode,
  generateUniqueRoomId,
};
