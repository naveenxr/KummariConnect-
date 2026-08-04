import React, { useState } from 'react';

const GUIDES = [
  {
    id: 'g1',
    name: 'Ramesh Kumar',
    spec: 'Heritage & Maritime History',
    experience: '8 Years',
    rate: '₹800 / Day',
    rating: 4.9,
    reviews: 184,
    verified: true,
    languages: ['Tamil', 'English', 'Malayalam'],
    bio: 'Government certified guide specializing in Chola-Chera maritime trade history, Vivekananda philosophy, and hidden photography spots.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'g2',
    name: 'Anitha Selvam',
    spec: 'Tribal Crafts & Eco Trails',
    experience: '6 Years',
    rate: '₹950 / Day',
    rating: 4.95,
    reviews: 210,
    verified: true,
    languages: ['Tamil', 'English', 'Hindi'],
    bio: 'Native to Kanyakumari. Leads immersive tours to Kanikkar tribal villages, banana fiber workshops, and hidden beach coves.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'g3',
    name: 'Muthu Krishnan',
    spec: 'Padmanabhapuram & Travancore History',
    experience: '12 Years',
    rate: '₹1,100 / Day',
    rating: 4.8,
    reviews: 142,
    verified: true,
    languages: ['Tamil', 'English'],
    bio: 'Deep knowledge of Travancore royal architecture, fort masonry, and ancient canal irrigation systems.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
  }
];

export default function GuideSection({ onBookGuide, lang }) {
  const [selectedLang, setSelectedLang] = useState('All');
  const [booked, setBooked] = useState(null);

  const filtered = GUIDES.filter(g => selectedLang === 'All' || g.languages.includes(selectedLang));

  return (
    <div className="guides-section">
      <div className="container">

        <div className="section-head" style={{ marginBottom: '2rem' }}>
          <div>
            <div className="section-label">Local Experts</div>
            <h2 className="section-title">Certified Guides</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
              Connect with verified native guides fluent in multiple languages.
            </p>
          </div>
          <div className="filter-pills">
            {['All', 'Tamil', 'English', 'Malayalam', 'Hindi'].map(l => (
              <button
                key={l}
                className={`pill-btn ${selectedLang === l ? 'active' : ''}`}
                onClick={() => setSelectedLang(l)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="cards-row">
          {filtered.map(guide => (
            <div key={guide.id} className="guide-card">
              <img src={guide.avatar} alt={guide.name} className="guide-avatar" />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="guide-name">
                    {guide.name}
                    {guide.verified && <span style={{ color: '#10B981', fontSize: '0.85rem', marginLeft: '6px' }}>✓ Verified</span>}
                  </div>
                  <div className="guide-spec">{guide.spec}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#F5A623', fontWeight: '700', fontSize: '0.85rem' }}>
                    ★ {guide.rating}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({guide.reviews} reviews)</div>
                </div>
              </div>

              <div className="guide-langs" style={{ marginTop: '0.6rem' }}>
                {guide.languages.map(l => (
                  <span key={l} className="guide-lang-tag">{l}</span>
                ))}
              </div>

              <p className="guide-bio">{guide.bio}</p>

              <div style={{
                background: '#F8F6F3',
                borderRadius: '10px',
                padding: '0.7rem 0.9rem',
                fontSize: '0.82rem',
                color: 'var(--text-mid)',
                marginBottom: '1rem'
              }}>
                <span>📅 {guide.experience} experience</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Rate per day</div>
                  <div className="guide-rate">{guide.rate}</div>
                </div>
                <button className="btn-book" onClick={() => onBookGuide(guide)}>
                  Book Guide
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
