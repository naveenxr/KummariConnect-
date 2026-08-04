import React, { useState } from 'react';
import { Star, ShieldCheck, Languages, Award, CheckCircle, Calendar } from 'lucide-react';
import { MOCK_GUIDES } from '../data/mockData';

export default function GuidesSection({ lang, onBookGuide }) {
  const [selectedLang, setSelectedLang] = useState('All');

  const filteredGuides = MOCK_GUIDES.filter(guide => {
    if (selectedLang === 'All') return true;
    return guide.languages.includes(selectedLang);
  });

  return (
    <div className="container section-padding">
      <div className="section-header" style={{ alignItems: 'center' }}>
        <div>
          <div className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>
            <ShieldCheck size={14} /> {lang === 'EN' ? 'GOVT CERTIFIED GUIDES' : 'சான்றளிக்கப்பட்ட வழிகாட்டிகள்'}
          </div>
          <h2 className="section-title">
            {lang === 'EN' ? 'Hire a Local Expert' : 'உள்ளூர் வழிகாட்டியை முன்பதிவு செய்க'}
          </h2>
          <p className="section-desc">
            {lang === 'EN' 
              ? 'Connect directly with native guides fluent in Tamil, English, Malayalam, and Hindi.'
              : 'தமிழ், ஆங்கிலம், மலையாளம் பேசும் உள்ளூர் வழிகாட்டிகள்.'}
          </p>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'Tamil', 'English', 'Malayalam', 'Hindi'].map(l => (
            <button
              key={l}
              className={`category-btn ${selectedLang === l ? 'active' : ''}`}
              onClick={() => setSelectedLang(l)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="cards-grid">
        {filteredGuides.map(guide => (
          <div key={guide.id} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', marginBottom: '1rem' }}>
              <img 
                src={guide.avatar} 
                alt={guide.name} 
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #FF6B4A' }} 
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#0B2545', fontWeight: '700' }}>
                    {lang === 'EN' ? guide.name : guide.nameTa}
                  </h3>
                  {guide.verified && <CheckCircle size={16} color="#10B981" fill="#10B981" />}
                </div>
                <span className="badge badge-coral" style={{ marginTop: '0.2rem', fontSize: '0.7rem' }}>
                  {guide.badge}
                </span>
                <div style={{ fontSize: '0.85rem', color: '#F59E0B', fontWeight: '700', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={14} fill="#F59E0B" /> {guide.rating} ({guide.reviews} reviews)
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1rem' }}>
              {guide.bio}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#0B2545', marginBottom: '1.2rem', background: '#F8FAFC', padding: '0.8rem', borderRadius: '10px' }}>
              <div><strong>Specialty:</strong> {guide.specialty}</div>
              <div><strong>Experience:</strong> {guide.experience}</div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <strong>Languages:</strong>
                {guide.languages.map(langItem => (
                  <span key={langItem} style={{ background: '#E2E8F0', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                    {langItem}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
              <div>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0B2545' }}>{guide.rate}</span>
              </div>
              <button className="btn-primary" onClick={() => onBookGuide(guide)}>
                <Calendar size={16} />
                {lang === 'EN' ? 'Book Guide' : 'முன்பதிவு'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
