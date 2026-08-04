import React, { useState } from 'react';

const DESTINATIONS = [
  {
    id: 'vivekananda',
    title: 'Vivekananda Rock Memorial',
    desc: 'A sacred island memorial where Swami Vivekananda meditated, set where three seas converge.',
    price: '₹50',
    priceNote: 'Ferry',
    rating: 4.9,
    category: 'Spiritual',
    image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&q=80&w=800',
    bigImage: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&q=80&w=1200',
    location: 'Rock Island, Vavathurai',
    timings: '08:00 AM – 04:00 PM',
    amenities: ['Ferry Access', 'Meditation Hall', 'Audio Guide', 'Photography Zone']
  },
  {
    id: 'thiruvalluvar',
    title: 'Thiruvalluvar Statue',
    desc: 'A 133-foot tall stone sculpture of the legendary Tamil poet and philosopher.',
    price: '₹50',
    priceNote: 'Ferry',
    rating: 4.9,
    category: 'Spiritual',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80&w=800',
    bigImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80&w=1200',
    location: 'Vavathurai Rock Isle',
    timings: '08:00 AM – 04:00 PM',
    amenities: ['Ferry Access', 'Staircase Viewing', 'Security', 'Ocean Viewpoint']
  },
  {
    id: 'muttom',
    title: 'Muttom Beach',
    desc: 'Famous for its lighthouse and huge rocks that create a dramatic coastal landscape.',
    price: 'Free',
    priceNote: 'Entry',
    rating: 4.7,
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    bigImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
    location: 'Muttom, 27 km from town',
    timings: 'Open 24 Hours',
    amenities: ['Lighthouse', 'Rock Formations', 'Fishing Boats', 'Food Stalls']
  },
  {
    id: 'kumari-amman',
    title: 'Kumari Amman Temple',
    desc: 'A 3000-year-old temple dedicated to Goddess Kanya Kumari on the sea shore.',
    price: '₹20',
    priceNote: 'Darshan',
    rating: 4.8,
    category: 'Spiritual',
    image: 'https://images.unsplash.com/photo-1545126131-b0c4f9b10471?auto=format&fit=crop&q=80&w=800',
    bigImage: 'https://images.unsplash.com/photo-1545126131-b0c4f9b10471?auto=format&fit=crop&q=80&w=1200',
    location: 'Main Beach Road, Kanyakumari',
    timings: '04:30 AM – 12:30 PM, 04:00 PM – 08:00 PM',
    amenities: ['Darshan Pass', 'Seashore View', 'Prasad Counter', 'Shoe Counter']
  },
  {
    id: 'padmanabhapuram',
    title: 'Padmanabhapuram Palace',
    desc: 'A stunning 16th-century wooden palace of the Travancore Kingdom with black granite floors.',
    price: '₹40',
    priceNote: 'Entry',
    rating: 4.7,
    category: 'Heritage',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    bigImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    location: 'Thuckalay, 37 km from town',
    timings: '09:00 AM – 04:30 PM (Closed Mondays)',
    amenities: ['Guided Tours', 'Museum', 'Car Parking', 'Souvenir Shop']
  },
  {
    id: 'vattakottai',
    title: 'Vattakottai Fort',
    desc: 'An 18th-century coastal fort with panoramic sea views and stunning sunsets.',
    price: 'Free',
    priceNote: 'Entry',
    rating: 4.6,
    category: 'Heritage',
    image: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?auto=format&fit=crop&q=80&w=800',
    bigImage: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?auto=format&fit=crop&q=80&w=1200',
    location: 'Agasteeswaram Beach',
    timings: '08:00 AM – 05:00 PM',
    amenities: ['Sea Viewpoint', 'Fort Ramparts', 'Garden Walk', 'History Board']
  }
];

const FEATURED = [
  {
    title: 'Vivekananda Rock Memorial',
    badge: 'Spiritual',
    image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&q=80&w=1000'
  },
  {
    title: 'Vattakottai Fort',
    badge: 'Heritage',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800'
  }
];

const FILTERS = ['All Spots', 'Spiritual', 'Nature', 'Heritage', 'Hidden Gems'];

export default function TouristSection({ onSelectDestination, lang }) {
  const [activeFilter, setActiveFilter] = useState('All Spots');
  const [searchVal, setSearchVal] = useState('');

  const filtered = DESTINATIONS.filter(d => {
    const matchCat = activeFilter === 'All Spots' || d.category === activeFilter || (activeFilter === 'Hidden Gems' && d.id === 'muttom');
    const matchSearch = d.title.toLowerCase().includes(searchVal.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      {/* ---- HERO ---- */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Where Three Seas Meet Eternity</h1>
          <p className="hero-sub">
            Experience the mystical convergence of the Arabian Sea, the Bay of Bengal, and the<br />
            Indian Ocean at the southernmost tip of India.
          </p>

          {/* Search Bar */}
          <div className="search-bar">
            <span style={{ color: '#A0AEC0', fontSize: '1rem' }}>🔍</span>
            <input
              type="text"
              placeholder="Search destinations, activities..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
            />
            <div className="search-divider" />
            <div className="search-date">
              <span style={{ fontSize: '0.9rem' }}>📅</span>
              Dec 12 – Dec 18
            </div>
            <button className="btn-explore">Explore</button>
          </div>
        </div>
      </section>

      {/* ---- CURATED EXPERIENCES ---- */}
      <section className="experiences-section">
        <div className="container">

          {/* Header Row */}
          <div className="section-head">
            <div>
              <div className="section-label">Curated Experiences</div>
              <h2 className="section-title">Discover Your Path</h2>
            </div>
            <div className="filter-pills">
              {FILTERS.map(f => (
                <button
                  key={f}
                  className={`pill-btn ${activeFilter === f ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Large Cards */}
          <div className="featured-grid">
            {FEATURED.map(card => (
              <div key={card.title} className="featured-card">
                <img src={card.image} alt={card.title} />
                <span className="featured-card-badge">{card.badge}</span>
                <div className="featured-card-title">{card.title}</div>
              </div>
            ))}
          </div>

          {/* Destination Cards */}
          <div className="cards-row">
            {filtered.map(dest => (
              <div key={dest.id} className="dest-card">
                <div className="dest-card-img">
                  <img src={dest.image} alt={dest.title} />
                  <div className="dest-card-rating">
                    <span style={{ color: '#F5A623' }}>★</span>
                    {dest.rating}
                  </div>
                </div>
                <div className="dest-card-body">
                  <h3 className="dest-card-title">{dest.title}</h3>
                  <p className="dest-card-desc">{dest.desc}</p>
                  <div className="dest-card-footer">
                    <div className="dest-card-price">
                      <strong>{dest.price}</strong> / {dest.priceNote}
                    </div>
                    <button className="btn-book" onClick={() => onSelectDestination(dest)}>
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Weather Bar */}
          <div className="weather-bar">
            <div className="weather-item">
              <span className="weather-icon" style={{ fontSize: '1.4rem' }}>☀️</span>
              <div>
                <div className="weather-value">28°C</div>
                <div className="weather-label">Partly Cloudy</div>
              </div>
            </div>

            <div className="weather-item">
              <span className="weather-icon" style={{ fontSize: '1.4rem' }}>🕐</span>
              <div>
                <div className="weather-value">06:24 AM</div>
                <div className="weather-label">Sunrise Today</div>
              </div>
            </div>

            <div className="weather-item">
              <span className="weather-icon" style={{ fontSize: '1.4rem' }}>🌊</span>
              <div>
                <div className="weather-value">High Tide</div>
                <div className="weather-label">Next: 02:45 PM</div>
              </div>
            </div>

            <button className="btn-plan">Plan Your Visit</button>
          </div>

        </div>
      </section>
    </div>
  );
}
