import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true },
  userName: { type: String, default: 'Guest Traveler' },
  userEmail: { type: String },
  type: { type: String, required: true },
  details: { type: Object },
  amount: { type: String },
  status: { type: String, default: 'Confirmed' }
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
