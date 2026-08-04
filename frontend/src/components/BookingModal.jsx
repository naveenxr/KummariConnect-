import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle, Ticket, User, ShieldCheck } from 'lucide-react';

export default function BookingModal({ isOpen, onClose, item, type }) {
  const [date, setDate] = useState('2026-08-01');
  const [guests, setGuests] = useState(2);
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen || !item) return null;

  const handleBooking = (e) => {
    e.preventDefault();
    setConfirmed(true);
  };

  const resetAndClose = () => {
    setConfirmed(false);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(7, 25, 48, 0.7)',
      backdropFilter: 'blur(6px)',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '500px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        animation: 'fadeIn 0.3s ease'
      }}>
        
        {/* Header */}
        <div style={{
          backgroundColor: 'var(--primary)',
          color: '#ffffff',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Ticket size={22} color="var(--accent)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              {type === 'guide' ? 'Book Local Guide' : 'Reserve Destination Ticket'}
            </h3>
          </div>
          <button onClick={resetAndClose} style={{ color: '#ffffff', opacity: 0.8 }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {confirmed ? (
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#D1FAE5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <CheckCircle size={36} />
              </div>

              <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '4px' }}>
                Booking Confirmed!
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Your instant digital pass is generated for Kanyakumari.
              </p>

              {/* Digital Pass Card */}
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                border: '1.5px dashed var(--accent)',
                textAlign: 'left',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.05em' }}>
                    PASS ID: #KK-2026-{Math.floor(1000 + Math.random() * 9000)}
                  </span>
                  <span className="badge badge-emerald">Verified</span>
                </div>
                <h5 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '8px' }}>
                  {item.title || item.name}
                </h5>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>📅 Date: {date}</div>
                  <div>👥 Visitors / Guests: {guests} Person(s)</div>
                  <div>📍 Location: {item.location || 'Kanyakumari Coast'}</div>
                </div>
              </div>

              <button onClick={resetAndClose} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Done & Return to Site
              </button>
            </div>
          ) : (
            <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: '#F8FAFC', border: '1px solid var(--border-light)' }}>
                {item.image && (
                  <img src={item.image} alt={item.title || item.name} style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                )}
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                    {item.title || item.name}
                  </h4>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {item.location || item.specialty || 'Kanyakumari Tourism'}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent)', marginTop: '2px' }}>
                    {item.price ? `₹${item.price} per person` : 'Free / Govt Tourism Pass'}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>
                  Select Visit Date
                </label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 40px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>
                  Number of Visitors / Guests
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                  <input 
                    type="number" 
                    min="1" 
                    max="10"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 40px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--emerald)' }}>
                <ShieldCheck size={14} />
                Instant SMS confirmation & priority ferry queue entry included.
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                Confirm Booking & Generate Pass
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
