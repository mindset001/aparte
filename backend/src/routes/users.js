import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET /users/:id - get user info by MongoDB _id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ id: user._id, uuid: user.uuid, fullName: user.fullName, email: user.email, userType: user.userType, picture: user.picture });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user info.' });
  }
});

export default router;
