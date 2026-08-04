import React, { useState } from 'react';
import { Search, Calendar, Star, Sun, Clock, Waves, ArrowRight, MapPin } from 'lucide-react';

export default function ExplorePage({ onBookItem, setActiveTab, lang }) {
  const [activeCategory, setActiveCategory] = useState('All Spots');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Dec 12 - Dec 18');

  // Curated Experiences & Top Rated Destinations Data matching prototype
  const curatedHeroCards = [
    {
      id: 'c1',
      title: 'Vivekananda Rock Memorial',
      category: 'Spiritual',
      categoryColor: '#00334E',
      image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
      description: 'A sacred monument built on a massive rock where Swami Vivekananda attained enlightenment.',
      rating: 4.9,
      price: 50,
      priceUnit: 'Ferry'
    },
    {
      id: 'c2',
      title: 'Vattakottai Fort',
      category: 'Nature',
      categoryColor: '#E85A4F',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      description: 'An 18th-century coastal fort offering sweeping views of the sea and Western Ghats.',
      rating: 4.8,
      price: 0,
      priceUnit: 'Entry'
    }
  ];

  const topRatedDestinations = [
    {
      id: 'd1',
      title: 'Thiruvalluvar Statue',
      category: 'Heritage',
      rating: 4.9,
      price: 50,
      priceUnit: 'Ferry',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      description: 'A 133-foot tall stone sculpture of the legendary Tamil poet and philosopher.'
    },
    {
      id: 'd2',
      title: 'Muttom Beach',
      category: 'Nature',
      rating: 4.7,
      price: 'Free',
      priceUnit: 'Entry',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      description: 'Famous for its lighthouse and huge rocks that create a dramatic coastal landscape.'
    },
    {
      id: 'd3',
      title: 'Kumari Amman Temple',
      category: 'Spiritual',
      rating: 4.8,
      price: 20,
      priceUnit: 'Darshan',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      description: 'A 3000-year-old temple dedicated to Goddess Kanya Kumari on the sea shore.'
    }
  ];

  // Category list from prototype
  const categories = ['All Spots', 'Spiritual', 'Nature', 'Heritage', 'Hidden Gems'];

  return (
    <div style={{ backgroundColor: '#F9F7F4', minHeight: '100vh' }}>
      
      {/* =========================================================================
          HERO SECTION (Matching Image 3 Prototype)
          ========================================================================= */}
      <section style={{
        position: 'relative',
        height: '82vh',
        minHeight: '520px',
        maxHeight: '680px',
        backgroundImage: 'linear-gradient(180deg, rgba(15, 23, 42, 0.25) 0%, rgba(15, 23, 42, 0.40) 100%), url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85")',
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 20px'
      }}>
        <div style={{ zIndex: 2, maxWidth: '780px', width: '100%' }}>
          
          {/* Main Hero Headline */}
          <h1 style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
            fontWeight: '400',
            fontFamily: "'Playfair Display', Georgia, serif",
            color: '#FFFFFF',
            letterSpacing: '-0.01em',
            marginBottom: '1rem',
            textShadow: '0 2px 14px rgba(0, 0, 0, 0.35)'
          }}>
            Where Three Seas Meet Eternity
          </h1>

          {/* Hero Subtitle */}
          <p style={{
            fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
            color: 'rgba(255, 255, 255, 0.92)',
            maxWidth: '640px',
            margin: '0 auto 2.5rem',
            lineHeight: '1.6',
            fontWeight: '400',
            textShadow: '0 1px 8px rgba(0, 0, 0, 0.3)'
          }}>
            Experience the mystical convergence of the Arabian Sea, the Bay of Bengal, and the Indian Ocean at the southernmost tip of India.
          </p>

          {/* Floating Search Pill Bar */}
          <div style={{
            backgroundColor: 'rgba(238, 233, 227, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '9999px',
            padding: '8px 10px 8px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            maxWidth: '680px',
            margin: '0 auto',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.22)',
            border: '1px solid rgba(255, 255, 255, 0.4)'
          }}>
            
            {/* Search Input */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Search size={18} color="#556980" />
              <input
                type="text"
                placeholder="Search destinations, activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '0.92rem',
                  color: '#00334E',
                  fontWeight: '500'
                }}
              />
            </div>

            {/* Vertical Divider Line */}
            <div style={{ width: '1px', height: '26px', backgroundColor: 'rgba(0, 51, 78, 0.15)' }} />

            {/* Date Range Picker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '6px' }}>
              <Calendar size={18} color="#00334E" />
              <input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '0.9rem',
                  color: '#00334E',
                  fontWeight: '500',
                  width: '125px',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Dark Navy Explore Pill Button */}
            <button
              onClick={() => {
                const el = document.getElementById('curated-experiences');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                backgroundColor: '#00334E',
                color: '#FFFFFF',
                padding: '0.75rem 2rem',
                borderRadius: '9999px',
                fontSize: '0.92rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 51, 78, 0.3)',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              Explore
            </button>

          </div>

        </div>
      </section>

      {/* =========================================================================
          CURATED EXPERIENCES SECTION (Matching Image 1 Prototype)
          ========================================================================= */}
      <section id="curated-experiences" style={{ padding: '60px 0 40px' }}>
        <div className="container">
          
          {/* Header Row */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: '#C85C3A',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '4px'
              }}>
                CURATED EXPERIENCES
              </div>
              <h2 style={{
                fontSize: '1.85rem',
                fontWeight: '600',
                color: '#00334E',
                fontFamily: "'Inter', sans-serif"
              }}>
                Discover Your Path
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '9999px',
                      fontSize: '0.88rem',
                      fontWeight: '500',
                      border: isActive ? '1.5px solid #00334E' : '1px solid #E0D9D0',
                      backgroundColor: isActive ? '#E5E9EE' : '#FFFFFF',
                      color: isActive ? '#00334E' : '#556980',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2 Large Hero Feature Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
            gap: '24px',
            marginBottom: '48px'
          }}>
            {/* Hero Card 1: Vivekananda Rock Memorial */}
            <div 
              onClick={() => onBookItem(curatedHeroCards[0], 'destination')}
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                height: '380px',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)'
              }}
            >
              <img
                src={curatedHeroCards[0].image}
                alt={curatedHeroCards[0].title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.4s ease'
                }}
              />
              {/* Gradient Overlay for Readable Text */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.05) 40%, rgba(0, 51, 78, 0.88) 100%)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                color: '#FFFFFF'
              }}>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: '#00334E',
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  padding: '4px 14px',
                  borderRadius: '9999px',
                  width: 'fit-content',
                  marginBottom: '12px'
                }}>
                  Spiritual
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '6px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                  {curatedHeroCards[0].title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', maxWidth: '90%', lineHeight: '1.5' }}>
                  {curatedHeroCards[0].description}
                </p>
              </div>
            </div>

            {/* Hero Card 2: Vattakottai Fort */}
            <div 
              onClick={() => onBookItem(curatedHeroCards[1], 'destination')}
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                height: '380px',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)'
              }}
            >
              <img
                src={curatedHeroCards[1].image}
                alt={curatedHeroCards[1].title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.4s ease'
                }}
              />
              {/* Gradient Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.05) 50%, rgba(15, 23, 42, 0.85) 100%)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                color: '#FFFFFF'
              }}>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: '#FF6F61',
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  padding: '4px 14px',
                  borderRadius: '9999px',
                  width: 'fit-content',
                  marginBottom: '12px'
                }}>
                  Nature
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '600', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                  {curatedHeroCards[1].title}
                </h3>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          TOP RATED DESTINATIONS SECTION (Matching Image 2 Prototype)
          ========================================================================= */}
      <section style={{ padding: '0 0 60px' }}>
        <div className="container">
          
          {/* Header Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '28px'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#00334E' }}>
              Top Rated Destinations
            </h2>
            <div 
              onClick={() => setActiveTab('explore')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.92rem',
                fontWeight: '500',
                color: '#00334E',
                cursor: 'pointer'
              }}
            >
              View all <ArrowRight size={16} />
            </div>
          </div>

          {/* 3 Destination Cards Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '48px'
          }}>
            {topRatedDestinations.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 18px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #EFEAE4',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, boxShadow 0.2s ease'
                }}
              >
                {/* Image Container */}
                <div style={{ position: 'relative', height: '220px' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Rating Badge Top Right */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: '#00334E',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)'
                  }}>
                    <Star size={14} color="#F5A623" fill="#F5A623" />
                    <span>{item.rating}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#00334E', marginBottom: '8px' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'rgba(0, 51, 78, 0.7)', lineHeight: '1.55', marginBottom: '20px' }}>
                      {item.description}
                    </p>
                  </div>

                  {/* Card Bottom Row: Price & Action */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px' }}>
                    <div style={{ fontSize: '0.9rem', color: '#00334E' }}>
                      <span style={{ fontWeight: '700' }}>{typeof item.price === 'number' ? `₹${item.price}` : item.price}</span>
                      <span style={{ fontSize: '0.8rem', color: '#778899' }}> /{item.priceUnit}</span>
                    </div>

                    <button
                      onClick={() => onBookItem(item, 'destination')}
                      style={{
                        backgroundColor: '#00334E',
                        color: '#FFFFFF',
                        padding: '0.55rem 1.3rem',
                        borderRadius: '9999px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0, 51, 78, 0.15)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Book Now
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* =========================================================================
              AUTHENTIC LOCAL RESTAURANTS & COASTAL DINING (New A-to-Z Section)
              ========================================================================= */}
          <div style={{ marginTop: '56px', marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <span style={{ backgroundColor: '#DCFCE7', color: '#166534', fontSize: '0.75rem', fontWeight: '800', padding: '4px 12px', borderRadius: '9999px', letterSpacing: '0.05em' }}>
                  GOVT CERTIFIED DINING
                </span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#00334E', marginTop: '6px' }}>
                  Authentic Kanyakumari Restaurants & Seafood
                </h2>
              </div>
              <div style={{ fontSize: '0.86rem', color: '#778899' }}>
                6 Official Partners
              </div>
            </div>

            {/* 6 Restaurant Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {[
                { name: 'The Sea Shell Restaurant', cuisine: 'Coastal Seafood & South Indian', rating: 4.8, price: '₹300 - ₹700 for two', specialty: 'Kanyakumari Fish Curry & Tandoori Crab', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80' },
                { name: 'Hotel Tamilnadu Govt Restaurant', cuisine: 'Traditional Tamil Thali & Veg', rating: 4.6, price: '₹150 - ₹400 for two', specialty: 'Authentic Banana Leaf Meals & Filter Coffee', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80' },
                { name: 'Sunset View Rooftop Dining', cuisine: 'Multi-Cuisine & Oceanview', rating: 4.7, price: '₹500 - ₹1200 for two', specialty: 'Sunset Grilled Prawns & Ocean View', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80' },
                { name: 'Hotel Sangam Seafood Shack', cuisine: 'Chettinad & Nagercoil Seafood', rating: 4.7, price: '₹400 - ₹800 for two', specialty: 'Nagercoil Fish Fry & Coconut Curry', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80' },
                { name: 'Saravana Bhavan Pure Veg', cuisine: 'Pure Vegetarian & Tiffin', rating: 4.8, price: '₹200 - ₹500 for two', specialty: 'Ghee Roast Dosa & Filter Coffee', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80' },
                { name: 'Oceans Coastal Bistro', cuisine: 'Seafood & International', rating: 4.6, price: '₹450 - ₹900 for two', specialty: 'Butter Garlic Lobster & Fish Tacos', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80' }
              ].map((r, idx) => (
                <div key={idx} style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', overflow: 'hidden', border: '1px solid #EFEAE4', boxShadow: '0 4px 14px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '180px', backgroundImage: `url("${r.image}")`, backgroundSize: 'cover', backgroundPosition: 'center', padding: '12px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ backgroundColor: '#166534', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: '800', padding: '4px 10px', borderRadius: '9999px', height: 'fit-content' }}>
                      CERTIFIED
                    </span>
                    <span style={{ backgroundColor: '#FFFFFF', color: '#00334E', fontSize: '0.8rem', fontWeight: '700', padding: '4px 10px', borderRadius: '8px', height: 'fit-content', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      ⭐ {r.rating}
                    </span>
                  </div>

                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#00334E', marginBottom: '4px' }}>{r.name}</h3>
                      <div style={{ fontSize: '0.8rem', color: '#778899', marginBottom: '8px' }}>{r.cuisine}</div>
                      <div style={{ fontSize: '0.84rem', color: '#166534', fontWeight: '600', marginBottom: '12px' }}>
                        🍛 Specialty: {r.specialty}
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                      <span style={{ color: '#00334E', fontWeight: '700' }}>{r.price}</span>
                      <button
                        onClick={() => alert(`Table reservation query sent for ${r.name}!`)}
                        style={{ backgroundColor: '#00334E', color: '#FFFFFF', border: 'none', borderRadius: '9999px', padding: '6px 14px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                      >
                        Reserve Table
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =========================================================================
              OFFICIAL A-TO-Z GOVERNMENT TRAVELER MANUAL
              ========================================================================= */}
          <div style={{ backgroundColor: '#00334E', borderRadius: '28px', padding: '36px 40px', color: '#FFFFFF', marginBottom: '56px', boxShadow: '0 12px 36px rgba(0, 51, 78, 0.2)' }}>
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: '800', color: '#52B788', textTransform: 'uppercase', marginBottom: '6px' }}>
              OFFICIAL GOVERNMENT TOURIST INFORMATION
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '20px' }}>
              Kanyakumari A-to-Z Traveler Guide
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', fontSize: '0.88rem' }}>
              
              <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '18px', padding: '20px', border: '1px solid rgba(255,255,255,0.15)' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#52B788', marginBottom: '8px' }}>🌐 Geographic Coordinates</h3>
                <p style={{ lineHeight: '1.5', color: '#EAE5DF', marginBottom: '10px' }}>
                  <strong>8.0883° N, 77.5385° E</strong> • Southernmost mainland tip of India.
                </p>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                  Triveni Sangam: Indian Ocean, Arabian Sea & Bay of Bengal confluence.
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '18px', padding: '20px', border: '1px solid rgba(255,255,255,0.15)' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#52B788', marginBottom: '8px' }}>⛴️ Govt Ferry Service</h3>
                <p style={{ lineHeight: '1.5', color: '#EAE5DF', marginBottom: '10px' }}>
                  Operated by <strong>Tamil Nadu Poompuhar Shipping Corp</strong>.
                </p>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                  Timings: 08:00 AM – 04:00 PM Daily • Fare: ₹75 Standard / ₹200 Priority.
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '18px', padding: '20px', border: '1px solid rgba(255,255,255,0.15)' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#52B788', marginBottom: '8px' }}>📞 Tourist Helplines</h3>
                <p style={{ lineHeight: '1.5', color: '#EAE5DF', marginBottom: '10px' }}>
                  TTDC Tourist Bureau: <strong>+91 4652 246276</strong>
                </p>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                  Tourist Police: 100 • Medical Emergency: 108
                </div>
              </div>

            </div>
          </div>

          {/* =========================================================================
              FLOATING LIVE WEATHER & INFOBAR WIDGET (Matching Image 2 Prototype)
              ========================================================================= */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '20px 32px',
            boxShadow: '0 10px 32px rgba(0, 0, 0, 0.05)',
            border: '1px solid #EFEAE4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px'
          }}>
            
            {/* Weather Column 1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Sun size={28} color="#00334E" />
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#00334E' }}>28°C</div>
                <div style={{ fontSize: '0.82rem', color: '#778899' }}>Partly Cloudy</div>
              </div>
            </div>

            {/* Divider Line */}
            <div style={{ width: '1px', height: '36px', backgroundColor: '#EFEAE4' }} />

            {/* Weather Column 2 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Clock size={28} color="#00334E" />
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#00334E' }}>06:24 AM</div>
                <div style={{ fontSize: '0.82rem', color: '#778899' }}>Sunrise Today</div>
              </div>
            </div>

            {/* Divider Line */}
            <div style={{ width: '1px', height: '36px', backgroundColor: '#EFEAE4' }} />

            {/* Weather Column 3 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Waves size={28} color="#00334E" />
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#00334E' }}>High Tide</div>
                <div style={{ fontSize: '0.82rem', color: '#778899' }}>Next: 02:45 PM</div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setActiveTab('itinerary')}
              style={{
                backgroundColor: '#00334E',
                color: '#FFFFFF',
                padding: '0.75rem 2rem',
                borderRadius: '9999px',
                fontSize: '0.9rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 51, 78, 0.2)',
                whiteSpace: 'nowrap'
              }}
            >
              Plan Your Visit
            </button>

          </div>

        </div>
      </section>

    </div>
  );
}
