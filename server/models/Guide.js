import mongoose from 'mongoose';

const guideSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameTa: { type: String },
  badge: { type: String },
  rating: { type: Number, default: 4.9 },
  reviews: { type: Number, default: 50 },
  languages: [String],
  specialty: { type: String },
  experience: { type: String },
  rate: { type: String, required: true },
  avatar: { type: String },
  verified: { type: Boolean, default: true },
  bio: { type: String }
}, { timestamps: true });

export default mongoose.models.Guide || mongoose.model('Guide', guideSchema);
