import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uuid: { type: String, unique: true },
  fullName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  country: { type: String },
  state: { type: String },
  userType: { type: String },
  picture: { type: String },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
