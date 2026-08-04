import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'General'
  },
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  urgency: {
    type: String,
    default: 'Normal'
  },
  rating: {
    type: Number,
    default: 5
  },
  status: {
    type: String,
    enum: ['IN REVIEW', 'IN PROGRESS', 'RESOLVED'],
    default: 'IN REVIEW'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('SupportTicket', supportTicketSchema);
