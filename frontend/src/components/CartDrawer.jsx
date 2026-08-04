import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cart, updateQuantity, removeFromCart, onCheckout }) {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 150 : 0;
  const total = subtotal + shipping;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2000,
      display: 'flex',
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(7, 25, 48, 0.6)',
      backdropFilter: 'blur(4px)'
    }}>
      {/* Overlay Backdrop Click */}
      <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />

      {/* Drawer Content */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '440px',
        height: '100%',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-8px 0 32px rgba(11, 37, 69, 0.2)',
        zIndex: 10
      }}>
        
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--primary)',
          color: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} color="var(--accent)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Your Artisan Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</h3>
          </div>
          <button 
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} color="#CBD5E1" style={{ margin: '0 auto 16px' }} />
              <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '6px' }}>Your marketplace cart is empty</p>
              <p style={{ fontSize: '0.85rem' }}>Support Kanyakumari artisans by adding authentic tribal handicrafts.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.map((item) => (
                <div 
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: '#F8FAFC'
                  }}
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: 'var(--radius-sm)',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '4px' }}>
                      {item.title}
                    </h4>
                    <div style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 700, marginBottom: '8px' }}>
                      Artisan: {item.artisan}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary)' }}>
                        ₹{item.price.toLocaleString()}
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', padding: '2px 8px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-light)' }}>
                        <button onClick={() => updateQuantity(item.id, -1)} style={{ color: 'var(--text-muted)' }}>
                          <Minus size={14} />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} style={{ color: 'var(--primary)' }}>
                          <Plus size={14} />
                        </button>
                      </div>

                      <button onClick={() => removeFromCart(item.id)} style={{ color: '#EF4444', padding: '4px' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div style={{
            padding: '24px',
            borderTop: '1px solid var(--border-light)',
            backgroundColor: '#ffffff'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Direct Artisan Shipping</span>
                <span>₹{shipping.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)', paddingTop: '10px', borderTop: '1px dashed var(--border-light)' }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--accent)' }}>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--emerald)', marginBottom: '16px' }}>
              <ShieldCheck size={14} />
              100% of proceeds go directly to Kanyakumari registered artisans.
            </div>

            <button 
              onClick={onCheckout}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
            >
              Proceed to Secure Checkout
              <ArrowRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
