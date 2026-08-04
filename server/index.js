import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env explicitly with absolute path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Debug: Confirm env vars are loaded
console.log(`📧 ENV Check: EMAIL_USER=${process.env.EMAIL_USER || 'NOT SET'}, EMAIL_PASS=${process.env.EMAIL_PASS ? '[SET]' : 'NOT SET'}`);

import authRoutes from './routes/auth.js';
import destinationRoutes from './routes/destinations.js';
import guideRoutes from './routes/guides.js';
import marketplaceRoutes from './routes/marketplace.js';
import bookingRoutes from './routes/bookings.js';
import supportRoutes from './routes/support.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kummari-connect';

// Middleware
app.use(cors());
app.use(express.json());

// Serve static public folder if needed
app.use('/public', express.static(path.resolve('../public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/support', supportRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    message: 'Kummari Connect MERN Backend operational',
    dbState: mongoose.connection.readyState === 1 ? 'Connected to MongoDB' : 'Standalone Mode'
  });
});

// Connect to MongoDB & Start Express
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch((err) => console.log('ℹ️ MongoDB connection notice (running Express endpoints in fallback mode):', err.message));

app.listen(PORT, () => {
  console.log(`🚀 Kummari Connect Backend running at http://localhost:${PORT}`);
});
