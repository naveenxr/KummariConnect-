import React, { useState } from 'react';
import { X, MapPin, Clock, Star, CheckCircle, Ticket, Ship } from 'lucide-react';
import { createBooking } from '../services/api';

export default function DestinationModal({ destination, onClose, lang }) {
  const [booked, setBooked] = useState(false);
  const [ticketCount, setTicketCount] = useState(2);

  if (!destination) return null;

  const handleBook = async () => {
    await createBooking({ destinationId: destination.id, count: ticketCount });
    setBooked(true);
    setTimeout(() => {
      setBooked(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Hero Image */}
        <div style={{ height: '260px', position: 'relative' }}>
          <img src={destination.image} alt={destination.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            background: 'linear-gradient(transparent, rgba(11, 37, 69, 0.9))', 
            padding: '1.5rem',
            color: '#ffffff'
          }}>
            <span className="badge badge-coral" style={{ marginBottom: '0.4rem' }}>{destination.badge}</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{lang === 'EN' ? destination.title : destination.titleTa}</h2>
            <div style={{ fontSize: '0.85rem', color: '#CBD5E1', display: 'flex', gap: '1rem', marginTop: '0.2rem' }}>
              <span><MapPin size={14} style={{ display: 'inline' }} /> {destination.location}</span>
              <span><Clock size={14} style={{ display: 'inline' }} /> {destination.timings}</span>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div style={{ padding: '1.8rem' }}>
          {booked ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <CheckCircle size={48} color="#10B981" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.4rem', color: '#0B2545', fontWeight: '800' }}>Pass Issued Successfully!</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.4rem' }}>Express QR Pass sent to your registered mobile/email.</p>
            </div>
          ) : (
            <>
              <h4 style={{ color: '#0B2545', fontWeight: '700', marginBottom: '0.5rem' }}>About Destination</h4>
              <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '1.5rem' }}>{destination.description}</p>

              {/* Amenities Grid */}
              <h4 style={{ color: '#0B2545', fontWeight: '700', marginBottom: '0.8rem' }}>Available Facilities</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.8rem' }}>
                {destination.amenities.map(amenity => (
                  <div key={amenity} style={{ background: '#F8FAFC', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', color: '#0B2545', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={14} color="#FF6B4A" /> {amenity}
                  </div>
                ))}
              </div>

              {/* Booking Action */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC', padding: '1.2rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Ticket Pricing</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0B2545' }}>{destination.price}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button style={{ background: '#CBD5E1', width: '28px', height: '28px', borderRadius: '6px', fontWeight: '700' }} onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}>-</button>
                    <span style={{ fontWeight: '700', fontSize: '1rem' }}>{ticketCount}</span>
                    <button style={{ background: '#CBD5E1', width: '28px', height: '28px', borderRadius: '6px', fontWeight: '700' }} onClick={() => setTicketCount(ticketCount + 1)}>+</button>
                  </div>

                  <button className="btn-primary" onClick={handleBook}>
                    <Ticket size={16} /> Book Pass
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
