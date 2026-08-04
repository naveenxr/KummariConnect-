import React from 'react';

export default function Navbar({ activeTab, setActiveTab, lang, setLang, openAuth, cartCount, openCart, currentUser, onUserLogout }) {
  const isTourist = activeTab === 'explore' || activeTab === 'tourist';
  const isGuide = activeTab === 'guides' || activeTab === 'guide';

  return (
    <nav className="navbar">
      <div className="container navbar-inner">

        {/* Logo */}
        <div 
          className="nav-logo" 
          onClick={() => setActiveTab('explore')} 
          style={{ cursor: 'pointer', fontSize: '1.25rem', fontWeight: '700', color: '#00334E', letterSpacing: '-0.02em' }}
        >
          Kanyakumari Explore
        </div>

        {/* Nav Links */}
        <ul className="nav-links">
          <li
            className={`nav-link ${isTourist ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
            style={{ position: 'relative', paddingBottom: '4px', cursor: 'pointer', color: isTourist ? '#00334E' : '#556980', fontWeight: isTourist ? '600' : '400' }}
          >
            Tourist
            {isTourist && (
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', backgroundColor: '#00334E', borderRadius: '1px' }} />
            )}
          </li>
          <li
            className={`nav-link ${isGuide ? 'active' : ''}`}
            onClick={() => setActiveTab('guides')}
            style={{ cursor: 'pointer', color: isGuide ? '#00334E' : '#556980', fontWeight: isGuide ? '600' : '400' }}
          >
            Guide
          </li>
          <li
            className="nav-lang"
            onClick={() => setLang(l => l === 'EN' ? 'TM' : 'EN')}
            style={{ cursor: 'pointer', color: '#556980', fontSize: '0.9rem' }}
          >
            Language: {lang}/TM
          </li>
        </ul>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {cartCount > 0 && (
            <button
              onClick={openCart}
              style={{
                background: '#EAE5DF',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.48rem 1rem',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: '#00334E',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              🛒 Cart ({cartCount})
            </button>
          )}

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                backgroundColor: '#EDF5F2',
                color: '#2D6A4F',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                👤 {currentUser.name || currentUser.email.split('@')[0]} ({currentUser.role || 'User'})
              </div>
              <button
                onClick={onUserLogout}
                style={{
                  background: 'none',
                  border: '1px solid #CBD5E1',
                  borderRadius: '9999px',
                  padding: '4px 12px',
                  fontSize: '0.8rem',
                  color: '#64748B',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              className="btn-signin" 
              onClick={openAuth}
              style={{
                backgroundColor: '#00334E',
                color: '#ffffff',
                padding: '0.55rem 1.4rem',
                borderRadius: '9999px',
                fontSize: '0.9rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 51, 78, 0.2)',
                transition: 'all 0.2s ease'
              }}
            >
              Sign In
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}
