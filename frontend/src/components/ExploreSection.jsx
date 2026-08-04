import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, Star, ArrowRight, ShieldCheck, Sun, Ship, Compass, Clock } from 'lucide-react';
import { MOCK_DESTINATIONS, MOCK_CATEGORIES, MOCK_WEATHER } from '../data/mockData';

export default function ExploreSection({ lang, onSelectDestination, setActiveTab }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [guestCount, setGuestCount] = useState('2 Guests');

  const filteredDestinations = MOCK_DESTINATIONS.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="badge badge-gold" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
              <Compass size={14} /> {lang === 'EN' ? 'OFFICIAL KANYAKUMARI TOURISM & HERITAGE' : 'அதிகாரப்பூர்வ சுற்றுலா தளம்'}
            </div>

            <h1 className="hero-title">
              {lang === 'EN' ? 'Where Three Seas Meet Harmony' : 'மூன்று கடல்கள் சங்கமிக்கும் அமைதி பூமி'}
            </h1>

            <p className="hero-subtitle">
              {lang === 'EN'
                ? 'Discover Vivekananda Rock, ancient Travancore forts, certified local guides, and authentic Kanikkar tribal handicrafts.'
                : 'விவேகானந்தர் பாறை, பழங்காலக் கோட்டைகள், சான்றளிக்கப்பட்ட வழிகாட்டிகள் மற்றும் பழங்குடி கைவினைப் பொருட்களைக் கண்டறியுங்கள்.'}
            </p>

            {/* FLOATING SEARCH WIDGET */}
            <div className="search-widget">
              <div className="search-field">
                <label><MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} /> {lang === 'EN' ? 'Destination' : 'இடம்'}</label>
                <input 
                  type="text" 
                  placeholder={lang === 'EN' ? 'Search Vivekananda Rock, Forts...' : 'தேடுக...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="search-field">
                <label><Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} /> {lang === 'EN' ? 'Travel Date' : 'தேதி'}</label>
                <input type="date" defaultValue="2026-07-30" />
              </div>

              <div className="search-field">
                <label><Users size={12} style={{ display: 'inline', marginRight: '4px' }} /> {lang === 'EN' ? 'Travelers' : 'நபர்கள்'}</label>
                <select value={guestCount} onChange={(e) => setGuestCount(e.target.value)}>
                  <option>1 Traveler</option>
                  <option>2 Guests</option>
                  <option>Family (4+)</option>
                  <option>Group Tour</option>
                </select>
              </div>

              <button className="btn-primary" style={{ height: '100%', borderRadius: '14px', justifyContent: 'center' }}>
                <Search size={18} />
                {lang === 'EN' ? 'Search' : 'தேடுக'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* REAL-TIME WEATHER & FERRY TICKER */}
      <section className="ticker-bar">
        <div className="container ticker-inner">
          <div className="ticker-item">
            <Sun size={16} color="#F59E0B" />
            <span>{lang === 'EN' ? 'Weather Today:' : 'வானிலை:'} <strong>{MOCK_WEATHER.temp}</strong> ({MOCK_WEATHER.condition})</span>
          </div>

          <div className="ticker-item">
            <Ship size={16} color="#FF6B4A" />
            <span>{lang === 'EN' ? 'Rock Ferry Status:' : 'படகு நிலை:'} <strong style={{ color: '#10B981' }}>{MOCK_WEATHER.ferryStatus}</strong> ({MOCK_WEATHER.nextFerry})</span>
          </div>

          <div className="ticker-item">
            <Clock size={16} color="#93C5FD" />
            <span>{lang === 'EN' ? 'Sunset Time:' : 'சூரிய அஸ்தமனம்:'} <strong>{MOCK_WEATHER.sunset}</strong></span>
          </div>

          <div className="ticker-item" style={{ cursor: 'pointer', color: '#FF6B4A', fontWeight: '700' }} onClick={() => setActiveTab('itinerary')}>
            {lang === 'EN' ? '⚡ Try AI Trip Planner →' : '⚡ AI பயணத் திட்டம் →'}
          </div>
        </div>
      </section>

      {/* DESTINATIONS EXPLORER */}
      <section className="container section-padding">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              {lang === 'EN' ? 'Top Rated Destinations' : 'பிரபலமான சுற்றுலா இடங்கள்'}
            </h2>
            <p className="section-desc">
              {lang === 'EN' ? 'Explore iconic rock memorials, waterfalls, and coastal defense forts.' : 'வரலாற்றுச் சிறப்புமிக்க இடங்கள் மற்றும் கடற்கரைகள்.'}
            </p>
          </div>
        </div>

        {/* CATEGORY TABS */}
        <div className="category-tabs">
          {MOCK_CATEGORIES.map(cat => (
            <button 
              key={cat} 
              className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* CARDS GRID */}
        <div className="cards-grid">
          {filteredDestinations.map(item => (
            <div key={item.id} className="card">
              <div className="card-img-wrap">
                <img src={item.image} alt={item.title} className="card-img" />
                <span className="badge badge-coral card-badge">
                  {item.badge}
                </span>
              </div>

              <div className="card-body">
                <h3 className="card-title">
                  {lang === 'EN' ? item.title : item.titleTa}
                </h3>
                
                <div className="card-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="#64748B" /> {item.location}
                  </span>
                </div>

                <p className="card-desc">{item.description}</p>

                <div className="card-footer">
                  <div>
                    <div className="card-price">{item.price}</div>
                    <div style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={12} fill="#F59E0B" /> {item.rating} ({item.reviewsCount.toLocaleString()} reviews)
                    </div>
                  </div>

                  <button className="btn-outline" style={{ padding: '0.5rem 1rem' }} onClick={() => onSelectDestination(item)}>
                    {lang === 'EN' ? 'View Details' : 'விவரங்கள்'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
