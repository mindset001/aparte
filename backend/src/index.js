import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/aparte';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Aparte backend is running');
});





import apartmentsRouter from './routes/apartments.js';
import authRouter from './routes/auth.js';
import signupRouter from './routes/signup.js';
import messagesRouter from './routes/messages.js';
import usersRouter from './routes/users.js';

app.use('/apartments', apartmentsRouter);
app.use('/auth', authRouter);
app.use('/auth/signup', signupRouter);
app.use('/messages', messagesRouter);
app.use('/users', usersRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
