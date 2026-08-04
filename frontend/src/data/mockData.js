export const MOCK_DESTINATIONS = [
  {
    id: 'vivekananda-rock',
    title: 'Vivekananda Rock Memorial',
    titleTa: 'விவேகானந்தர் பாறை நினைவு மண்டபம்',
    category: 'Heritage',
    location: 'Vavathurai, Kanyakumari',
    rating: 4.9,
    reviewsCount: 14280,
    price: '₹50 / Entry + Ferry',
    timings: '08:00 AM - 04:00 PM',
    ferryStatus: 'Operational (10-15 min wait)',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80&w=1000',
    badge: 'Must Visit',
    featured: true,
    description: 'Built in 1970 in honor of Swami Vivekananda who sat in meditation on this rock for three days. Situated 500m off the mainland where the Arabian Sea, Bay of Bengal, and Indian Ocean meet.',
    amenities: ['Ferry Access', 'Guided Audio', 'Restrooms', 'Photography Zone', 'Meditation Hall']
  },
  {
    id: 'thiruvalluvar-statue',
    title: 'Thiruvalluvar Statue',
    titleTa: 'திருவள்ளுவர் சிலை',
    category: 'Heritage',
    location: 'Vavathurai Rock Isle',
    rating: 4.8,
    reviewsCount: 11950,
    price: 'Included in Ferry Ticket',
    timings: '08:00 AM - 04:00 PM',
    ferryStatus: 'Operational',
    image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&q=80&w=1000',
    badge: 'Iconic Landmark',
    featured: true,
    description: 'A colossal 133-feet high stone sculpture of the immortal Tamil poet Thiruvalluvar. The 38-foot pedestal represents the 38 chapters of Virtue (Aram) in the Tirukkural.',
    amenities: ['Ferry Access', 'Staircase Access', 'Ocean Viewline', 'Security']
  },
  {
    id: 'sunset-point',
    title: 'Kanyakumari Sunset & Sunrise Point',
    titleTa: 'சூரிய அஸ்தமன முனை',
    category: 'Beaches',
    location: 'Southern Tip, Main Promenade',
    rating: 4.9,
    reviewsCount: 22400,
    price: 'Free',
    timings: 'Open 24 Hours (Best 05:45 AM & 06:15 PM)',
    ferryStatus: 'N/A',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000',
    badge: 'Natural Wonder',
    featured: true,
    description: 'The unique geographical convergence where you can witness both simultaneous moonrise and sunset on full moon days, over the three mingling oceans.',
    amenities: ['Seating Benches', 'Food Stalls', 'Watch Tower', 'Parking']
  },
  {
    id: 'padmanabhapuram-palace',
    title: 'Padmanabhapuram Wooden Palace',
    titleTa: 'பத்மநாபபுரம் அரண்மனை',
    category: 'Heritage',
    location: 'Thuckalay, 37 km from town',
    rating: 4.7,
    reviewsCount: 8900,
    price: '₹40 (Indians) / ₹300 (Foreigners)',
    timings: '09:00 AM - 04:30 PM (Closed Mondays)',
    ferryStatus: 'N/A',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000',
    badge: 'Architectural Gem',
    featured: true,
    description: '16th-century royal palace of the Travancore Kingdom, masterpiece of traditional Kerala wooden architecture with polished black granite floors made of burnt coconut shells & egg whites.',
    amenities: ['Guided Tours', 'Car Parking', 'Museum Store', 'Shoe Counters']
  },
  {
    id: 'vattakottai-fort',
    title: 'Vattakottai Seaside Fort',
    titleTa: 'வட்டக்கோட்டை கோட்டை',
    category: 'Forts',
    location: 'Agasteeswaram Beach',
    rating: 4.6,
    reviewsCount: 6540,
    price: 'Free Entry',
    timings: '08:00 AM - 05:00 PM',
    ferryStatus: 'N/A',
    image: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?auto=format&fit=crop&q=80&w=1000',
    badge: 'Coastal Fort',
    featured: false,
    description: 'An 18th-century coastal stone fort constructed by Eustachius De Lannoy for the Travancore kingdom. Command panoramic views of the sea on one side and Western Ghats on the other.',
    amenities: ['Garden Promenade', 'Sea Viewpoint', 'Historical Marker']
  },
  {
    id: 'mathur-aqueduct',
    title: 'Mathur Hanging Aqueduct',
    titleTa: 'மாத்தூர் தொங்கும் பாலம்',
    category: 'Heritage',
    location: 'Near Aruvikkarai, 48 km',
    rating: 4.7,
    reviewsCount: 5200,
    price: '₹10 per head',
    timings: '07:00 AM - 06:00 PM',
    ferryStatus: 'N/A',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1000',
    badge: 'Engineering Marvel',
    featured: false,
    description: 'One of South Asia’s longest and highest aqueducts built in 1966 across the Pahrali River. Spans 1 km length at a height of 115 feet with 28 massive stone pillars.',
    amenities: ['Bridge Walkway', 'Children Park', 'Fruit Stalls']
  },
  {
    id: 'thirparappu-falls',
    title: 'Thirparappu Waterfalls',
    titleTa: 'திருப்பரப்பு அருவி',
    category: 'Waterfalls',
    location: 'Thirparappu, 55 km',
    rating: 4.5,
    reviewsCount: 7800,
    price: '₹10 Entry / ₹50 Boat Ride',
    timings: '06:30 AM - 06:00 PM',
    ferryStatus: 'N/A',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&q=80&w=1000',
    badge: 'Family Favorite',
    featured: false,
    description: 'A 50ft high cascading waterfall fed by the Kodayar river. Features an ancient 9th-century Shiva temple adjacent to the falls and paddle boating facilities.',
    amenities: ['Shower Area', 'Pedal Boating', 'Shiva Temple', 'Dressing Rooms']
  }
];

export const MOCK_CATEGORIES = [
  'All', 'Heritage', 'Beaches', 'Forts', 'Waterfalls', 'Culture', 'Food'
];

export const MOCK_GUIDES = [
  {
    id: 'g1',
    name: 'Ramesh Kumar',
    nameTa: 'ரமேஷ் குமார்',
    badge: 'Top Rated',
    rating: 4.9,
    reviews: 184,
    languages: ['Tamil', 'English', 'Malayalam'],
    specialty: 'Heritage & Maritime History',
    experience: '8 Years Experience',
    rate: '₹800 / Day',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    verified: true,
    bio: 'Government certified guide specializing in Chola-Chera maritime trade history, Vivekananda Philosophy, and secret photography spots.'
  },
  {
    id: 'g2',
    name: 'Anitha Selvam',
    nameTa: 'அனிதா செல்வம்',
    badge: 'Eco Specialist',
    rating: 4.95,
    reviews: 210,
    languages: ['Tamil', 'English', 'Hindi'],
    specialty: 'Tribal Crafts & Coastal Eco Trails',
    experience: '6 Years Experience',
    rate: '₹950 / Day',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    verified: true,
    bio: 'Native to Kanyakumari. Leads tours to Kanikkar tribal artisan villages, banana fiber workshops, and hidden beach coves.'
  },
  {
    id: 'g3',
    name: 'Muthu Krishnan',
    nameTa: 'முத்து கிருஷ்ணன்',
    badge: 'Local Historian',
    rating: 4.8,
    reviews: 142,
    languages: ['Tamil', 'English'],
    specialty: 'Padmanabhapuram & Travancore Dynasty',
    experience: '12 Years Experience',
    rate: '₹1,100 / Day',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    verified: true,
    bio: 'Deep knowledge of Travancore royal architecture, fort masonry, and ancient canal irrigation systems.'
  }
];

export const MOCK_MARKETPLACE_PRODUCTS = [
  {
    id: 'p1',
    name: 'Kanikkar Eco Banana Fiber Handbag',
    nameTa: 'வாழை நாரில் நெய்த கைப்பை',
    artisan: 'Kanikkar Tribal Women Self-Help Group',
    price: 499,
    originalPrice: 750,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600',
    badge: 'Eco Friendly',
    category: 'Fiber Crafts',
    description: 'Handwoven from 100% natural banana plant fiber. Extremely durable, biodegradable, and styled with traditional motifs.'
  },
  {
    id: 'p2',
    name: 'Hand-Carved Sea Shell Table Lamp',
    nameTa: 'சங்கில் செதுக்கப்பட்ட மேஜை விளக்கு',
    artisan: 'Coastal Shell Artisans Cooperative',
    price: 850,
    originalPrice: 1200,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600',
    badge: 'Best Seller',
    category: 'Shell Decor',
    description: 'Carved natural conch shell mounted on a rosewood base with warm LED glow interior. Made from sustainably sourced shells.'
  },
  {
    id: 'p3',
    name: 'Kanyakumari Terracotta Herbal Water Jug',
    nameTa: 'பாரம்பரிய களிமண் குடிநீர் பாத்திரம்',
    artisan: 'Vadasery Pottery Guild',
    price: 380,
    originalPrice: 500,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600',
    badge: 'Handmade Pottery',
    category: 'Terracotta',
    description: 'Natural clay jug seasoned with vetiver root and herbal clay wash. Keeps drinking water naturally cool at 20°C.'
  },
  {
    id: 'p4',
    name: 'Handcrafted Teakwood Miniature Thiruvalluvar',
    nameTa: 'மரத்தால் செதுக்கப்பட்ட திருவள்ளுவர் சிலை',
    artisan: 'Nagercoil Woodwork Masters',
    price: 1250,
    originalPrice: 1600,
    rating: 4.95,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=600',
    badge: 'Master Art',
    category: 'Woodcraft',
    description: 'Intricately hand-carved solid teakwood replica of the 133-ft statue with smooth beeswax finish.'
  }
];

export const MOCK_ITINERARY = {
  title: '3-Day Coastal & Heritage Immersion',
  duration: '3 Days / 2 Nights',
  totalDistance: '85 km',
  estimatedCost: '₹3,400 per traveler',
  days: [
    {
      dayNumber: 1,
      dayTitle: 'Ocean Confluence & Sunrise Magic',
      activities: [
        { time: '05:30 AM', title: 'Sunrise View at Southern Tip', desc: 'Watch the sun rise over the Bay of Bengal.', icon: 'Sun' },
        { time: '08:00 AM', title: 'Ferry Ride to Vivekananda Rock & Statue', desc: 'Visit the meditation hall and 133ft Thiruvalluvar sculpture.', icon: 'Ship' },
        { time: '01:00 PM', title: 'Authentic Nagercoil Meal', desc: 'Savor Kerala-Tamil fusion fish curry meal served on banana leaf.', icon: 'Utensils' },
        { time: '04:30 PM', title: 'Sunset Point & Triveni Sangam', desc: 'Witness three oceans blending into evening twilight.', icon: 'Camera' }
      ]
    },
    {
      dayNumber: 2,
      dayTitle: 'Palaces, Forts & Maritime Defense',
      activities: [
        { time: '09:00 AM', title: 'Padmanabhapuram Wooden Palace', desc: 'Explore 400-year-old royal Travancore chambers.', icon: 'Landmark' },
        { time: '02:00 PM', title: 'Vattakottai Seaside Fort', desc: 'Walk along sea-facing ramparts overlooking the calm bay.', icon: 'Shield' },
        { time: '05:30 PM', title: 'Sunset at Chitharal Jain Rock Cut Caves', desc: 'Ancient 9th-century rock cut relief carvings.', icon: 'Mountain' }
      ]
    },
    {
      dayNumber: 3,
      dayTitle: 'Hanging Aqueducts & Tribal Crafts',
      activities: [
        { time: '08:30 AM', title: 'Mathur Hanging Aqueduct Bridge Walk', desc: 'Traverse 115-ft high canal bridge above lush palm canopy.', icon: 'Compass' },
        { time: '11:30 AM', title: 'Kanikkar Tribal Artisan Craft Village', desc: 'Meet fiber weavers & purchase direct authentic handicrafts.', icon: 'ShoppingBag' },
        { time: '03:00 PM', title: 'Thirparappu Waterfalls Dip & Departure', desc: 'Refresh in cool river cascades before heading home.', icon: 'Waves' }
      ]
    }
  ]
};

export const MOCK_WEATHER = {
  temp: '28°C',
  condition: 'Partly Cloudy & Breezy',
  humidity: '74%',
  wind: '18 km/h SW',
  sunrise: '06:04 AM',
  sunset: '06:36 PM',
  ferryStatus: 'Operational',
  nextFerry: 'In 8 minutes',
  seaCondition: 'Calm Waters (Safe for Ferry & Boating)'
};

export const MOCK_ADMIN_STATS = {
  totalVisitorsToday: 8420,
  ferryTicketsIssued: 4190,
  activeGuidesOnDuty: 28,
  marketplaceSalesMonth: '₹2,48,900',
  pendingApprovals: 4,
  recentBookings: [
    { id: 'BK-9021', name: 'Siddharth Rao', type: 'Ferry Express Pass + Guide', date: '2026-07-29', amount: '₹850', status: 'Confirmed' },
    { id: 'BK-9022', name: 'Meera Nambiar', type: 'Padmanabhapuram Private Tour', date: '2026-07-29', amount: '₹1,100', status: 'Confirmed' },
    { id: 'BK-9023', name: 'Arun V.', type: 'Banana Fiber Bag Order', date: '2026-07-29', amount: '₹499', status: 'Dispatched' }
  ]
};
