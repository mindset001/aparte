import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Step 1: POST /auth/signup/step-1
router.post('/step-1', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }
    const uuid = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    // Save partial user with uuid, email, password
    const user = new User({ email, password: hashedPassword, uuid });
    await user.save();
    res.status(201).json({ uuid });
  } catch (err) {
    res.status(500).json({ message: 'Signup step 1 failed.' });
  }
});

// Step 2: POST /auth/signup/step-2
router.post('/step-2', async (req, res) => {
  try {
    const { fullName, phone, country, state, userType, uuid, picture } = req.body;
    if (!fullName || !phone || !country || !state || !userType || !uuid) {
      return res.status(400).json({ message: 'All fields except picture are required.' });
    }
    const user = await User.findOne({ uuid });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    user.fullName = fullName;
    user.phone = phone;
    user.country = country;
    user.state = state;
    user.userType = userType;
    user.picture = picture;
    await user.save();
    res.json({ message: 'Signup completed.' });
  } catch (err) {
    res.status(500).json({ message: 'Signup step 2 failed.' });
  }
});

export default router;
