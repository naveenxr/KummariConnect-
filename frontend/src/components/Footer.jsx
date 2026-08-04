import React, { useState } from 'react';

export default function Footer({ setActiveTab, lang }) {
  const [email, setEmail] = useState('');
  const [nlEmail, setNlEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (nlEmail) { setSubscribed(true); setNlEmail(''); }
  };

  return (
    <div>
      {/* Newsletter Card */}
      <div style={{ background: 'var(--cream)', padding: '0 0 2rem' }}>
        <div className="container">
          <div className="newsletter-card">
            <h3 className="newsletter-title">Stay Anchored</h3>
            <p className="newsletter-desc">
              Subscribe to get monthly travel guides, hidden gem alerts, and seasonal festival
              notifications for Kanyakumari.
            </p>
            {subscribed ? (
              <div style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '600' }}>
                ✓ Thank you! You're subscribed.
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  className="newsletter-input"
                  placeholder="Your email address"
                  value={nlEmail}
                  onChange={e => setNlEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn-subscribe">Subscribe Now</button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">

            {/* Brand */}
            <div>
              <div className="footer-logo">Kanyakumari Explore</div>
              <p className="footer-tagline">
                Connecting travelers to the tip of the Indian<br />
                Subcontinent with sustainable tourism<br />
                practices.
              </p>
              <div className="footer-socials">
                <div className="footer-social-icon">⚙</div>
                <div className="footer-social-icon">⇗</div>
                <div className="footer-social-icon">🌐</div>
              </div>
            </div>

            {/* Discover */}
            <div>
              <div className="footer-col-title">Discover</div>
              <ul className="footer-links">
                <li onClick={() => setActiveTab('tourist')}>Spiritual</li>
                <li onClick={() => setActiveTab('tourist')}>Nature</li>
                <li onClick={() => setActiveTab('tourist')}>Heritage</li>
                <li onClick={() => setActiveTab('market')}>Tribal Market</li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <div className="footer-col-title">Support</div>
              <ul className="footer-links">
                <li>Contact Support</li>
                <li>Privacy Policy</li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <div className="footer-col-title">Newsletter</div>
              <div className="footer-nl-input-wrap">
                <input
                  type="email"
                  className="footer-nl-input"
                  placeholder="Email Address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <button className="footer-nl-btn" onClick={() => email && setEmail('')}>→</button>
              </div>
            </div>

          </div>

          <div className="footer-copy">
            © 2024 Kanyakumari Tourism Development. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
