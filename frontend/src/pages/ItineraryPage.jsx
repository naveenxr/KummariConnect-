import React, { useState } from 'react';
import { Share2, Download, Sun, Calendar, MapPin, Map, Sparkles, Clock, Ship, Compass } from 'lucide-react';

export default function ItineraryPage({ onBookItem }) {
  const [budget, setBudget] = useState('');
  const [people, setPeople] = useState(2);
  const [days, setDays] = useState(3);
  const [isSaved, setIsSaved] = useState(false);

  // State for generated itinerary data
  const [currentItinerary, setCurrentItinerary] = useState({
    title: 'Your 3–Day Coastal Journey',
    estimatedTotal: '₹22,400',
    totalDistance: '7.2km total distance',
    days: [
      {
        dayNum: 'Day 01',
        title: 'The Sacred Sunrise',
        nodeColor: '#00334E',
        activities: [
          {
            id: 'a1',
            timePill: 'MORNING • 05:30 AM',
            estPrice: 'Est. ₹0',
            title: 'Sunrise at Kanyakumari Beach',
            description: 'Witness the spectacular dawn where the Arabian Sea, Bay of Bengal, and Indian Ocean meet.',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
            tags: []
          },
          {
            id: 'a2',
            timePill: 'MIDDAY • 10:00 AM',
            estPrice: 'Est. ₹150',
            title: 'Vivekananda Rock Memorial',
            description: 'Take the iconic ferry ride to the offshore rock memorial and meditation hall.',
            image: null,
            tags: [
              { icon: '⛵', label: 'Ferry' },
              { icon: '⏱️', label: '2 hrs' }
            ]
          }
        ]
      },
      {
        dayNum: 'Day 02',
        title: 'Heritage & Heights',
        nodeColor: '#8ECAE6',
        activities: [
          {
            id: 'a3',
            timePill: 'AFTERNOON • 02:00 PM',
            estPrice: 'Est. ₹200',
            title: 'Padmanabhapuram Palace',
            description: 'Explore one of the finest examples of traditional wooden architecture in Kerala style.',
            image: null,
            tags: []
          },
          {
            id: 'a4',
            timePill: 'EVENING • 05:00 PM',
            estPrice: 'Est. ₹50',
            title: 'Sunset View Point',
            description: 'A designated point to watch the sun dip directly into the Arabian Sea.',
            image: null,
            tags: []
          }
        ]
      }
    ]
  });

  const handleGenerate = (e) => {
    e.preventDefault();
    alert(`Generating customized ${days}-day coastal itinerary for ${people} travelers with budget ₹${budget || '22,400'}...`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Kanyakumari Coastal Journey',
        text: 'Check out my 3-Day Coastal Journey in Kanyakumari!',
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert('Itinerary link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    alert('Downloading PDF Itinerary for Kanyakumari Coastal Journey...');
  };

  return (
    <div style={{ backgroundColor: '#F9F7F4', minHeight: '100vh', paddingBottom: '80px' }}>
      <div className="container" style={{ paddingTop: '32px' }}>
        
        {/* =========================================================================
            1. HERO / GENERATOR BANNER (Plan Your Coastal Escape)
            ========================================================================= */}
        <div style={{
          position: 'relative',
          borderRadius: '28px',
          overflow: 'hidden',
          minHeight: '300px',
          backgroundImage: 'linear-gradient(180deg, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.65) 100%), url("https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          padding: '44px 36px',
          color: '#FFFFFF',
          marginBottom: '44px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)'
        }}>
          
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: '600',
            fontFamily: "'Playfair Display', Georgia, serif",
            color: '#FFFFFF',
            marginBottom: '8px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            Plan Your Coastal Escape
          </h1>
          <p style={{
            fontSize: '1rem',
            color: 'rgba(255, 255, 255, 0.92)',
            marginBottom: '32px',
            fontWeight: '400'
          }}>
            AI-powered itineraries tailored to the meeting of three seas.
          </p>

          {/* Glassmorphism Inputs Bar */}
          <form 
            onSubmit={handleGenerate}
            style={{
              backgroundColor: 'rgba(238, 233, 227, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '20px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
              maxWidth: '680px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.5)'
            }}
          >
            {/* Field 1: Budget */}
            <div style={{ flex: 1, minWidth: '110px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#556980', marginBottom: '4px' }}>
                Budget (INR)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: '10px', padding: '6px 12px', border: '1px solid #E2D9CF' }}>
                <span style={{ color: '#00334E', fontWeight: '600', marginRight: '4px' }}>₹</span>
                <input
                  type="number"
                  placeholder="22400"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem', color: '#00334E', fontWeight: '600' }}
                />
              </div>
            </div>

            {/* Field 2: People */}
            <div style={{ width: '90px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#556980', marginBottom: '4px' }}>
                People
              </label>
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', padding: '6px 12px', border: '1px solid #E2D9CF' }}>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                  style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem', color: '#00334E', fontWeight: '600', textAlign: 'center' }}
                />
              </div>
            </div>

            {/* Field 3: Days */}
            <div style={{ width: '90px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#556980', marginBottom: '4px' }}>
                Days
              </label>
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', padding: '6px 12px', border: '1px solid #E2D9CF' }}>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem', color: '#00334E', fontWeight: '600', textAlign: 'center' }}
                />
              </div>
            </div>

            {/* Action Button: Generate Itinerary */}
            <button
              type="submit"
              style={{
                backgroundColor: '#00334E',
                color: '#FFFFFF',
                padding: '0.75rem 1.6rem',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0, 51, 78, 0.25)',
                whiteSpace: 'nowrap',
                height: '42px',
                marginTop: '18px'
              }}
            >
              <Sparkles size={16} fill="#FFFFFF" />
              <span>Generate Itinerary</span>
            </button>

          </form>

        </div>

        {/* =========================================================================
            2. ITINERARY HEADER ROW (Your 3–Day Coastal Journey)
            ========================================================================= */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#00334E', marginBottom: '4px' }}>
              {currentItinerary.title}
            </h2>
            <div style={{ fontSize: '0.95rem', color: '#556980', fontWeight: '500' }}>
              Estimated Total: <span style={{ color: '#00334E', fontWeight: '700' }}>{currentItinerary.estimatedTotal}</span>
            </div>
          </div>

          {/* Share & Download Icon Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handleShare}
              title="Share Itinerary"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#EAE5DF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00334E',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Share2 size={18} />
            </button>

            <button
              onClick={handleDownload}
              title="Download Itinerary PDF"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#EAE5DF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00334E',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* =========================================================================
            3. MAIN CONTENT GRID (Timeline Column + Sidebar Map Box)
            ========================================================================= */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)',
          gap: '36px',
          alignItems: 'start'
        }}>

          {/* LEFT TIMELINE COLUMN */}
          <div>
            {currentItinerary.days.map((day, dayIdx) => (
              <div key={day.dayNum} style={{ position: 'relative', paddingLeft: '32px', marginBottom: '40px' }}>
                
                {/* Vertical Timeline Line */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  bottom: dayIdx === currentItinerary.days.length - 1 ? '20px' : '-40px',
                  left: '7px',
                  width: '2px',
                  backgroundColor: '#D1D5DB'
                }} />

                {/* Timeline Circle Node */}
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  left: 0,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: day.nodeColor,
                  boxShadow: '0 0 0 4px #F9F7F4'
                }} />

                {/* Day Header Title */}
                <h3 style={{
                  fontSize: '1.35rem',
                  fontWeight: '700',
                  color: '#00334E',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {day.dayNum}: {day.title}
                </h3>

                {/* Activity Cards Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '20px'
                }}>
                  {day.activities.map((act) => (
                    <div
                      key={act.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '20px',
                        padding: '24px',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                        border: '1px solid #EFEAE4',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        {/* Card Top Row: Time Pill & Price */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '16px'
                        }}>
                          <span style={{
                            backgroundColor: '#00334E',
                            color: '#FFFFFF',
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            padding: '5px 12px',
                            borderRadius: '9999px',
                            letterSpacing: '0.04em'
                          }}>
                            {act.timePill}
                          </span>

                          <span style={{ fontSize: '0.85rem', color: '#778899', fontWeight: '500' }}>
                            {act.estPrice}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#00334E', marginBottom: '8px' }}>
                          {act.title}
                        </h4>

                        {/* Description */}
                        <p style={{ fontSize: '0.86rem', color: '#556980', lineHeight: '1.55', marginBottom: act.image ? '16px' : '12px' }}>
                          {act.description}
                        </p>

                        {/* Activity Image (if present) */}
                        {act.image && (
                          <div style={{ height: '140px', borderRadius: '14px', overflow: 'hidden', marginBottom: '8px' }}>
                            <img src={act.image} alt={act.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        )}
                      </div>

                      {/* Tag badges (e.g. Ferry, 2 hrs) */}
                      {act.tags && act.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                          {act.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              style={{
                                backgroundColor: '#F0EDE8',
                                border: '1px solid #E5E0D8',
                                color: '#00334E',
                                fontSize: '0.78rem',
                                fontWeight: '500',
                                padding: '4px 10px',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <span>{tag.icon}</span> {tag.label}
                            </span>
                          ))}
                        </div>
                      )}

                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

          {/* RIGHT SIDEBAR COLUMN (Route Preview & Quick Info) */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #EFEAE4',
              boxShadow: '0 6px 24px rgba(0, 0, 0, 0.05)',
              overflow: 'hidden'
            }}>
              
              {/* Sidebar Header */}
              <div style={{
                padding: '20px 24px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #F5F1EC'
              }}>
                <span style={{ fontSize: '1rem', fontWeight: '600', color: '#00334E' }}>
                  Route Preview
                </span>
                <Map size={18} color="#00334E" />
              </div>

              {/* Map Preview Graphic Container */}
              <div style={{
                position: 'relative',
                height: '240px',
                backgroundColor: '#EAEAE6',
                backgroundImage: 'radial-gradient(#D0D0C8 1px, transparent 1px)',
                backgroundSize: '16px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                
                {/* SVG Outline Map of Peninsular India / Kanyakumari Tip */}
                <svg viewBox="0 0 300 240" style={{ width: '100%', height: '100%', opacity: 0.75 }}>
                  <path
                    d="M 40 20 L 260 20 L 220 140 L 150 210 L 80 140 Z"
                    fill="#E0E0D8"
                    stroke="#C5C5BC"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  {/* Kanyakumari Tip Pin Dot */}
                  <circle cx="150" cy="205" r="5" fill="#C85C3A" />
                  <circle cx="150" cy="205" r="11" fill="rgba(200, 92, 58, 0.25)" />
                </svg>

                {/* Overlay Pill Badge: 7.2km total distance */}
                <div style={{
                  position: 'absolute',
                  backgroundColor: '#FFFFFF',
                  color: '#00334E',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ color: '#C85C3A', fontWeight: 'bold' }}>●</span>
                  <span>{currentItinerary.totalDistance}</span>
                </div>

              </div>

              {/* Quick Info Box */}
              <div style={{ padding: '24px' }}>
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  color: '#778899',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '16px'
                }}>
                  QUICK INFO
                </div>

                {/* Weather Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    backgroundColor: '#E0F2FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Sun size={20} color="#0284C7" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#778899', fontWeight: '500' }}>Weather</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#00334E' }}>28°C • Sunny</div>
                  </div>
                </div>

                {/* Best Time Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    backgroundColor: '#E0F2FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Calendar size={20} color="#0284C7" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#778899', fontWeight: '500' }}>Best Time</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#00334E' }}>Oct to March</div>
                  </div>
                </div>

                {/* Save to My Trips Outline Button */}
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  style={{
                    width: '100%',
                    backgroundColor: isSaved ? '#00334E' : '#FFFFFF',
                    color: isSaved ? '#FFFFFF' : '#00334E',
                    border: '1.5px solid #00334E',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center'
                  }}
                >
                  {isSaved ? '✓ Saved to My Trips' : 'Save to My Trips'}
                </button>

              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
