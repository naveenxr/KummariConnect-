import express from 'express';
import Booking from '../models/Booking.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await Booking.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const bookingId = 'BK-' + Math.floor(1000 + Math.random() * 9000);
    const item = new Booking({
      bookingId,
      type: req.body.destinationId ? 'Ferry Pass' : 'Guide Booking',
      details: req.body,
      amount: '₹500',
      status: 'Confirmed'
    });
    await item.save();
    res.status(201).json({ success: true, bookingId, booking: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
