// models/VerificationCode.js
import mongoose from 'mongoose';

const VerificationCodeSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // код живёт 5 минут
});

export default mongoose.model('VerificationCode', VerificationCodeSchema);
