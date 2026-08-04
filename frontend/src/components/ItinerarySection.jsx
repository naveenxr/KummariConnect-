import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Sparkles, Sun, Ship, Utensils, Camera, Shield, Landmark, Mountain, Compass, ShoppingBag, Waves, Plus, Check } from 'lucide-react';
import { MOCK_ITINERARY } from '../data/mockData';

const ICON_MAP = {
  Sun: <Sun size={18} color="#F59E0B" />,
  Ship: <Ship size={18} color="#FF6B4A" />,
  Utensils: <Utensils size={18} color="#10B981" />,
  Camera: <Camera size={18} color="#3B82F6" />,
  Landmark: <Landmark size={18} color="#8B5CF6" />,
  Shield: <Shield size={18} color="#EC4899" />,
  Mountain: <Mountain size={18} color="#14B8A6" />,
  Compass: <Compass size={18} color="#F59E0B" />,
  ShoppingBag: <ShoppingBag size={18} color="#FF6B4A" />,
  Waves: <Waves size={18} color="#06B6D4" />
};

export default function ItinerarySection({ lang }) {
  const [activeDay, setActiveDay] = useState(1);
  const [customDays, setCustomDays] = useState(MOCK_ITINERARY.days);
  const [newActivityText, setNewActivityText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!newActivityText.trim()) return;

    const newAct = {
      time: '04:00 PM',
      title: newActivityText,
      desc: 'User customized activity added to itinerary.',
      icon: 'Compass'
    };

    setCustomDays(prev => prev.map(day => {
      if (day.dayNumber === activeDay) {
        return { ...day, activities: [...day.activities, newAct] };
      }
      return day;
    }));

    setNewActivityText('');
    setShowAddForm(false);
  };

  const currentDayData = customDays.find(d => d.dayNumber === activeDay);

  return (
    <div className="container section-padding">
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
        <div className="badge badge-coral" style={{ marginBottom: '0.8rem' }}>
          <Sparkles size={14} /> {lang === 'EN' ? 'SMART AI TRIP GENERATOR' : 'செயற்கை நுண்ணறிவு பயண திட்டம்'}
        </div>
        <h1 className="section-title" style={{ fontSize: '2.5rem' }}>
          {lang === 'EN' ? MOCK_ITINERARY.title : '3 நாள் கடற்கரை மற்றும் பாரம்பரிய பயணம்'}
        </h1>
        <p className="section-desc">
          {lang === 'EN'
            ? 'Optimized route accounting for ferry queue times, tide conditions, and sun orientation.'
            : 'படகு நேரம் மற்றும் அலைகளை கணக்கிட்டு தயாரிக்கப்பட்ட உகந்த பயண திட்டம்.'}
        </p>

        {/* Stats Pills */}
        <div style={{ 
          display: 'flex', 
          justify: 'center', 
          gap: '1.5rem', 
          marginTop: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <span className="badge badge-navy" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            ⏱️ {MOCK_ITINERARY.duration}
          </span>
          <span className="badge badge-navy" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            📍 {MOCK_ITINERARY.totalDistance} Total Route
          </span>
          <span className="badge badge-gold" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            💰 Est. {MOCK_ITINERARY.estimatedCost}
          </span>
        </div>
      </div>

      {/* Day Selector Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        {customDays.map(day => (
          <button
            key={day.dayNumber}
            className={`btn-${activeDay === day.dayNumber ? 'primary' : 'outline'}`}
            onClick={() => setActiveDay(day.dayNumber)}
            style={{ borderRadius: '12px', padding: '0.75rem 1.5rem' }}
          >
            Day {day.dayNumber}: {day.dayTitle}
          </button>
        ))}
      </div>

      {/* Timeline Card */}
      <div className="day-card" style={{ maxWidth: '850px', margin: '0 auto' }}>
        <div className="day-header">
          <div>
            <span className="day-badge">Day {currentDayData.dayNumber}</span>
            <h3 style={{ fontSize: '1.4rem', color: '#0B2545', marginTop: '0.5rem', fontWeight: '700' }}>
              {currentDayData.dayTitle}
            </h3>
          </div>
          <button 
            className="btn-outline" 
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={14} /> {lang === 'EN' ? 'Add Stop' : 'இடம் சேர்'}
          </button>
        </div>

        {/* Add Activity Form */}
        {showAddForm && (
          <form onSubmit={handleAddActivity} style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              placeholder="e.g., Sunset Photography at Beach, Coconut Water Refreshment..."
              value={newActivityText}
              onChange={(e) => setNewActivityText(e.target.value)}
              style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none' }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1rem' }}>Save</button>
          </form>
        )}

        {/* Activity Items */}
        <div className="activity-list">
          {currentDayData.activities.map((act, idx) => (
            <div key={idx} className="activity-item" style={{ 
              background: '#F8FAFC', 
              padding: '1.2rem', 
              borderRadius: '12px',
              borderLeft: '4px solid #FF6B4A'
            }}>
              <div className="activity-time">
                <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {act.time}
              </div>
              <div className="activity-detail">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  {ICON_MAP[act.icon] || <Compass size={18} color="#FF6B4A" />}
                  <h4>{act.title}</h4>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#64748B' }}>{act.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
