import express from 'express';
import Destination from '../models/Destination.js';
import { kanyakumariDestinations, kanyakumariRestaurants, kanyakumariTravelInfo } from '../../frontend/src/data/kanyakumariData.js';

const router = express.Router();

// GET all destinations & places
router.get('/', async (req, res) => {
  try {
    const dbItems = await Destination.find();
    if (dbItems && dbItems.length > 0) {
      return res.json(dbItems);
    }
    res.json(kanyakumariDestinations);
  } catch {
    res.json(kanyakumariDestinations);
  }
});

// GET all authentic restaurants
router.get('/restaurants', (req, res) => {
  res.json({ success: true, restaurants: kanyakumariRestaurants });
});

// GET official A-to-Z travel info & ferry schedules
router.get('/travel-info', (req, res) => {
  res.json({ success: true, travelInfo: kanyakumariTravelInfo });
});

// POST new destination
router.post('/', async (req, res) => {
  try {
    const item = new Destination(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
