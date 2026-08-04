import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleTa: { type: String },
  category: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: Number, default: 4.8 },
  reviewsCount: { type: Number, default: 1000 },
  price: { type: String, required: true },
  timings: { type: String },
  ferryStatus: { type: String },
  image: { type: String },
  badge: { type: String },
  description: { type: String },
  amenities: [String]
}, { timestamps: true });

export default mongoose.models.Destination || mongoose.model('Destination', destinationSchema);
