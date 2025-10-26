import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  apartmentId: { type: String, required: true },
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
