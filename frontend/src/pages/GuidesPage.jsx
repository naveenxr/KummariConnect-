import React, { useState } from 'react';
import { Star, ShieldCheck, MapPin, Check, Search } from 'lucide-react';

export default function GuidesPage({ onBookItem }) {
  // Filter States
  const [activeTabFilter, setActiveTabFilter] = useState('All'); // 'All' | 'Stays' | 'Guides'
  const [stayFilters, setStayFilters] = useState({
    Hotel: true,
    Homestay: false,
    Resort: false
  });
  const [guideFilters, setGuideFilters] = useState({
    History: true,
    Spiritual: false,
    Adventure: false
  });

  // Mock listings data matching exact prototype screenshots
  const allListings = [
    {
      id: 'l1',
      type: 'stay',
      stayType: 'Resort',
      title: 'Ocean Zenith Resort',
      rating: 4.9,
      price: '₹4,500',
      unit: '/night',
      verified: true,
      badgeText: 'VERIFIED',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      description: 'Experience luxury at the edge of the world. Panoramic views of the three seas meeting.',
      reviewers: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
      ],
      extraReviewersCount: '+12',
      reviewsText: '128 REVIEWS'
    },
    {
      id: 'l2',
      type: 'guide',
      specialty: 'History',
      title: 'Anand R. (History Expert)',
      rating: 5.0,
      price: '₹1,200',
      unit: '/day',
      isProGuide: true,
      badgeText: 'PRO GUIDE',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      description: 'Fluent in Tamil and English. Deep knowledge of the Chola architecture and local folklore.',
      tags: ['HISTORY', 'TAMIL HERITAGE'],
      guidedText: '84 TOURS GUIDED'
    },
    {
      id: 'l3',
      type: 'stay',
      stayType: 'Homestay',
      title: 'The Heritage Palms',
      rating: 4.8,
      price: '₹2,200',
      unit: '/night',
      verified: true,
      badgeText: 'VERIFIED',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      description: 'Authentic local stay. Wake up to the sound of temple bells and traditional breakfast.',
      reviewers: [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'
      ],
      extraReviewersCount: '+45',
      reviewsText: '46 REVIEWS'
    },
    {
      id: 'l4',
      type: 'guide',
      specialty: 'Adventure',
      title: 'Meera K. (Coastal Trails)',
      rating: 4.9,
      price: '₹1,800',
      unit: '/day',
      isProGuide: true,
      badgeText: 'PRO GUIDE',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      description: 'Specialized in coastal trekking and secret beach excursions. Nature lover and photographer.',
      tags: ['ADVENTURE', 'TREKKING'],
      guidedText: '52 TOURS GUIDED'
    }
  ];

  // Toggle stay filter checkboxes
  const handleStayFilterChange = (key) => {
    setStayFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Toggle guide filter checkboxes
  const handleGuideFilterChange = (key) => {
    setGuideFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Clear filters
  const handleClearFilters = () => {
    setStayFilters({ Hotel: false, Homestay: false, Resort: false });
    setGuideFilters({ History: false, Spiritual: false, Adventure: false });
    setActiveTabFilter('All');
  };

  // Filter listings based on selected tabs and checkboxes
  const filteredListings = allListings.filter(item => {
    if (activeTabFilter === 'Stays' && item.type !== 'stay') return false;
    if (activeTabFilter === 'Guides' && item.type !== 'guide') return false;
    return true;
  });

  return (
    <div style={{ backgroundColor: '#F9F7F4', minHeight: '100vh', paddingBottom: '80px' }}>
      <div className="container" style={{ paddingTop: '36px' }}>
        
        {/* =========================================================================
            HEADER & TOP SWITCHER BAR
            ========================================================================= */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: '1.4rem',
              fontWeight: '500',
              color: '#00334E',
              fontFamily: "'Inter', sans-serif",
              marginBottom: '4px'
            }}>
              Discover Kanyakumari
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#778899', fontWeight: '400' }}>
              24 Verified Stays & Professional Guides
            </div>
          </div>

          {/* Top Pill Tabs Switcher (All | Stays | Guides) */}
          <div style={{
            backgroundColor: '#EEEBE6',
            borderRadius: '9999px',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {['All', 'Stays', 'Guides'].map((tab) => {
              const isActive = activeTabFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTabFilter(tab)}
                  style={{
                    padding: '6px 20px',
                    borderRadius: '9999px',
                    fontSize: '0.88rem',
                    fontWeight: isActive ? '600' : '400',
                    backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                    color: isActive ? '#00334E' : '#778899',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            MAIN 2-COLUMN LAYOUT (Filters Sidebar + Cards Grid)
            ========================================================================= */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 260px) minmax(0, 1fr)',
          gap: '36px',
          alignItems: 'start'
        }}>

          {/* LEFT FILTERS SIDEBAR */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
            border: '1px solid #EFEAE4'
          }}>
            
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#00334E', marginBottom: '24px' }}>
              Filters
            </h3>

            {/* Section 1: STAY TYPE */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{
                fontSize: '0.72rem',
                fontWeight: '700',
                color: '#778899',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '14px'
              }}>
                STAY TYPE
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.keys(stayFilters).map(type => (
                  <label
                    key={type}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.9rem',
                      color: '#00334E',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={stayFilters[type]}
                      onChange={() => handleStayFilterChange(type)}
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: '#00334E',
                        cursor: 'pointer',
                        borderRadius: '4px'
                      }}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Section 2: GUIDE SPECIALTY */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                fontSize: '0.72rem',
                fontWeight: '700',
                color: '#778899',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '14px'
              }}>
                GUIDE SPECIALTY
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.keys(guideFilters).map(spec => (
                  <label
                    key={spec}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.9rem',
                      color: '#00334E',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={guideFilters[spec]}
                      onChange={() => handleGuideFilterChange(spec)}
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: '#00334E',
                        cursor: 'pointer',
                        borderRadius: '4px'
                      }}
                    />
                    <span>{spec}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear All Filters Button */}
            <button
              onClick={handleClearFilters}
              style={{
                width: '100%',
                backgroundColor: '#EAE7E1',
                color: '#00334E',
                border: 'none',
                padding: '0.65rem 1rem',
                borderRadius: '12px',
                fontSize: '0.88rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center'
              }}
            >
              Clear All Filters
            </button>

          </div>

          {/* RIGHT LISTINGS GRID (2 Cards Per Row) */}
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
              marginBottom: '40px'
            }}>
              {filteredListings.map(item => (
                <div
                  key={item.id}
                  onClick={() => onBookItem && onBookItem(item, item.type)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 18px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #EFEAE4',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, boxShadow 0.2s ease'
                  }}
                >
                  {/* Card Image Banner */}
                  <div style={{ position: 'relative', height: '230px' }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />

                    {/* Top-Left Badge: VERIFIED or PRO GUIDE */}
                    <div style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      backgroundColor: item.isProGuide ? '#C85C3A' : '#00334E',
                      color: '#FFFFFF',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      letterSpacing: '0.04em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {item.isProGuide ? '📍' : '✔'} {item.badgeText}
                    </div>

                    {/* Bottom-Right Price Badge */}
                    <div style={{
                      position: 'absolute',
                      bottom: '14px',
                      right: '14px',
                      backgroundColor: '#FFFFFF',
                      color: '#00334E',
                      borderRadius: '8px',
                      padding: '4px 12px',
                      fontSize: '0.88rem',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
                    }}>
                      <span style={{ fontWeight: '700' }}>{item.price}</span>
                      <span style={{ fontSize: '0.78rem', color: '#778899' }}> {item.unit}</span>
                    </div>

                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      {/* Title & Rating Row */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                      }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#00334E' }}>
                          {item.title}
                        </h3>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#C85C3A',
                          fontWeight: '700',
                          fontSize: '0.9rem'
                        }}>
                          <Star size={14} color="#C85C3A" fill="#C85C3A" />
                          <span>{item.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p style={{ fontSize: '0.86rem', color: '#556980', lineHeight: '1.55', marginBottom: '20px' }}>
                        {item.description}
                      </p>
                    </div>

                    {/* Footer Row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '12px',
                      borderTop: '1px solid #F5F1EC'
                    }}>
                      
                      {/* Left side: Reviewers Stack OR Tags */}
                      {item.type === 'stay' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {item.reviewers && item.reviewers.map((rev, idx) => (
                            <img
                              key={idx}
                              src={rev}
                              alt="Reviewer"
                              style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '50%',
                                border: '2px solid #FFFFFF',
                                objectFit: 'cover',
                                marginLeft: idx > 0 ? '-8px' : '0'
                              }}
                            />
                          ))}
                          <span style={{
                            backgroundColor: '#EAE7E1',
                            color: '#00334E',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            padding: '2px 6px',
                            borderRadius: '9999px',
                            marginLeft: '-6px',
                            border: '2px solid #FFFFFF'
                          }}>
                            {item.extraReviewersCount}
                          </span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {item.tags && item.tags.map((t, idx) => (
                            <span
                              key={idx}
                              style={{
                                backgroundColor: '#E0F2FE',
                                color: '#0284C7',
                                fontSize: '0.68rem',
                                fontWeight: '700',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                letterSpacing: '0.03em'
                              }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Right side text: REVIEWS count or TOURS GUIDED count */}
                      <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#778899', letterSpacing: '0.05em' }}>
                        {item.type === 'stay' ? item.reviewsText : item.guidedText}
                      </div>

                    </div>

                  </div>

                </div>
              ))}
            </div>

            {/* Explore More Listings Button */}
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <button
                onClick={() => alert('Loading more verified stays & professional guides...')}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#00334E',
                  border: '1.5px solid #00334E',
                  padding: '12px 36px',
                  borderRadius: '9999px',
                  fontSize: '0.92rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0, 51, 78, 0.05)'
                }}
              >
                Explore More Listings
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
