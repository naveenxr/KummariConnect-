import mongoose from 'mongoose';
import Destination from './models/Destination.js';
import Guide from './models/Guide.js';
import Product from './models/Product.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kummari-connect';

const initialDestinations = [
  {
    title: 'Vivekananda Rock Memorial',
    titleTa: 'விவேகானந்தர் பாறை நினைவு மண்டபம்',
    category: 'Heritage',
    location: 'Vavathurai, Kanyakumari',
    rating: 4.9,
    price: '₹50 / Entry + Ferry',
    description: 'Built in 1970 in honor of Swami Vivekananda who sat in meditation on this rock for three days.',
    amenities: ['Ferry Access', 'Guided Audio', 'Restrooms', 'Meditation Hall']
  },
  {
    title: 'Thiruvalluvar Statue',
    titleTa: 'திருவள்ளுவர் சிலை',
    category: 'Heritage',
    location: 'Vavathurai Rock Isle',
    rating: 4.8,
    price: 'Included in Ferry Ticket',
    description: 'A colossal 133-feet high stone sculpture of the immortal Tamil poet Thiruvalluvar.',
    amenities: ['Ferry Access', 'Staircase Access', 'Ocean Viewline']
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Clearing existing records...');
    await Destination.deleteMany({});
    await Destination.insertMany(initialDestinations);
    console.log('✅ Seeded MongoDB database successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
