import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// GET /messages/:apartmentId - get all messages for an apartment
router.get('/:apartmentId', async (req, res) => {
  try {
    const messages = await Message.find({ apartmentId: req.params.apartmentId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// POST /messages - send a new message
router.post('/', async (req, res) => {
  try {
    const { apartmentId, sender, receiver, content } = req.body;
    if (!apartmentId || !sender || !receiver || !content) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const message = new Message({ apartmentId, sender, receiver, content });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Error sending message' });
  }
});

export default router;
