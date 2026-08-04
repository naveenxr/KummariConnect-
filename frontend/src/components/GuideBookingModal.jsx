import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, User } from 'lucide-react';
import { createBooking } from '../services/api';

export default function GuideBookingModal({ guide, onClose, lang }) {
  const [date, setDate] = useState('2026-07-30');
  const [duration, setDuration] = useState('Full Day (8 Hours)');
  const [booked, setBooked] = useState(false);

  if (!guide) return null;

  const handleBook = async (e) => {
    e.preventDefault();
    await createBooking({ guideId: guide.id, date, duration });
    setBooked(true);
    setTimeout(() => {
      setBooked(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px', padding: '1.8rem' }}>
        <button className="close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {booked ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <CheckCircle2 size={56} color="#10B981" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.4rem', color: '#0B2545', fontWeight: '800' }}>Guide Booked!</h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.3rem' }}>
              {guide.name} has been notified and will contact you shortly.
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #E2E8F0' }}>
              <img src={guide.avatar} alt={guide.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FF6B4A' }} />
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0B2545', fontWeight: '700' }}>Hire {guide.name}</h3>
                <div style={{ fontSize: '0.85rem', color: '#FF6B4A', fontWeight: '700' }}>{guide.rate}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{guide.specialty}</div>
              </div>
            </div>

            <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748B' }}>Tour Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '0.3rem', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748B' }}>Tour Duration</label>
                <select 
                  value={duration} 
                  onChange={(e) => setDuration(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '0.3rem', fontSize: '0.9rem' }}
                >
                  <option>Half Day (4 Hours)</option>
                  <option>Full Day (8 Hours)</option>
                  <option>2-Day Heritage Package</option>
                </select>
              </div>

              <button className="btn-primary" type="submit" style={{ justifyContent: 'center', padding: '0.85rem', marginTop: '0.5rem' }}>
                <Calendar size={16} /> Confirm Guide Booking
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
