import express from 'express';
import Guide from '../models/Guide.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await Guide.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const item = new Guide(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
