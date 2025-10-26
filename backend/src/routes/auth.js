
import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// POST /auth/register - user registration
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, phone, country, state, userType, picture } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email, and password are required.' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }
  // Generate uuid for user
  const uuid = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ uuid, fullName, email, password: hashedPassword, phone, country, state, userType, picture });
    await user.save();
    res.status(201).json({ uuid });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed.' });
  }
});

// POST /auth/login - user login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
  res.json({ message: 'Login successful.', user: { uuid: user.uuid, id: user._id, fullName: user.fullName, email: user.email, userType: user.userType, picture: user.picture } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed.' });
  }
});

export default router;
