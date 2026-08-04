import express from 'express';
import SupportTicket from '../models/SupportTicket.js';

const router = express.Router();

// Fallback memory store if MongoDB Atlas offline
let memoryTickets = [
  {
    ticketId: 'TKT-89012',
    userName: 'Karthik Raja',
    userEmail: 'karthik.r@gmail.com',
    category: 'Technical / App Difficulty',
    subject: 'OTP verification delay on Gmail',
    description: 'Received OTP after 45 seconds during register page submission.',
    urgency: 'Medium',
    rating: 4,
    status: 'IN REVIEW',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    ticketId: 'TKT-89011',
    userName: 'Meera Nair',
    userEmail: 'meera.nair@ecotravel.in',
    category: 'Eco-Guide Experience',
    subject: 'Wonderful experience with guide Rajesh Kumar',
    description: 'Rajesh was extremely knowledgeable about coastal marine biology!',
    urgency: 'Low',
    rating: 5,
    status: 'RESOLVED',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// POST /api/support/submit - User submits ticket or difficulty feedback
router.post('/submit', async (req, res) => {
  try {
    const { userName, userEmail, category, subject, description, urgency, rating } = req.body;
    const ticketId = 'TKT-' + Math.floor(10000 + Math.random() * 90000);

    const newTicket = {
      ticketId,
      userName: userName || 'Eco Traveler',
      userEmail: userEmail || 'user@kanyakumari.com',
      category: category || 'General Difficulty',
      subject: subject || 'Feedback Query',
      description: description || 'No details provided.',
      urgency: urgency || 'Normal',
      rating: Number(rating) || 5,
      status: 'IN REVIEW',
      createdAt: new Date().toISOString()
    };

    try {
      const doc = new SupportTicket(newTicket);
      await doc.save();
    } catch {
      memoryTickets.unshift(newTicket);
    }

    res.json({
      success: true,
      ticketId,
      message: 'Support query submitted successfully! Sent to Admin portal for review.',
      ticket: newTicket
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/support/tickets - Admin fetches all submitted queries & feedback
router.get('/tickets', async (req, res) => {
  try {
    let tickets = [];
    try {
      tickets = await SupportTicket.find().sort({ createdAt: -1 });
    } catch {
      tickets = memoryTickets;
    }
    if (!tickets || tickets.length === 0) {
      tickets = memoryTickets;
    }
    res.json({ success: true, tickets });
  } catch (err) {
    res.json({ success: true, tickets: memoryTickets });
  }
});

// PATCH /api/support/tickets/:id - Admin updates ticket status
router.patch('/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    try {
      await SupportTicket.findOneAndUpdate({ ticketId: id }, { status });
    } catch {
      const idx = memoryTickets.findIndex(t => t.ticketId === id);
      if (idx !== -1) {
        memoryTickets[idx].status = status;
      }
    }

    res.json({ success: true, message: `Ticket ${id} status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
