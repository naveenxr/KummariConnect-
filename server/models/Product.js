import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameTa: { type: String },
  artisan: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  rating: { type: Number, default: 4.8 },
  image: { type: String },
  badge: { type: String },
  category: { type: String },
  description: { type: String }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', productSchema);
