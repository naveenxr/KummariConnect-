import React, { useState } from 'react';
import { ShoppingBag, Star, Heart, Check, Sparkles, Filter } from 'lucide-react';
import { MOCK_MARKETPLACE_PRODUCTS } from '../data/mockData';

export default function MarketplaceSection({ lang, addToCart, openCart }) {
  const [addedItemIds, setAddedItemIds] = useState([]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItemIds(prev => [...prev, product.id]);
    setTimeout(() => {
      setAddedItemIds(prev => prev.filter(id => id !== product.id));
    }, 1500);
  };

  return (
    <div className="container section-padding">
      <div className="section-header">
        <div>
          <div className="badge badge-coral" style={{ marginBottom: '0.5rem' }}>
            <Sparkles size={14} /> {lang === 'EN' ? 'KANIKKAR TRIBAL & ARTISAN SHOP' : 'பழங்குடி கைவினைப் பொருட்கள்'}
          </div>
          <h2 className="section-title">
            {lang === 'EN' ? 'Indigenous Craft Marketplace' : 'பாரம்பரிய கைவினைப் பொருட்கள்'}
          </h2>
          <p className="section-desc">
            {lang === 'EN'
              ? 'Direct sales supporting local artisans and tribal self-help groups in Kanyakumari.'
              : 'உள்ளூர் கைவினைஞர்கள் மற்றும் பழங்குடி பெண்களின் படைப்புகள்.'}
          </p>
        </div>

        <button className="btn-secondary" onClick={openCart}>
          <ShoppingBag size={18} />
          {lang === 'EN' ? 'View Cart' : 'கூடையைப் பார்'}
        </button>
      </div>

      <div className="cards-grid">
        {MOCK_MARKETPLACE_PRODUCTS.map(product => (
          <div key={product.id} className="card">
            <div className="card-img-wrap">
              <img src={product.image} alt={product.name} className="card-img" />
              <span className="badge badge-gold card-badge">
                {product.badge}
              </span>
            </div>

            <div className="card-body">
              <div className="artisan-badge">
                🌿 {product.artisan}
              </div>

              <h3 className="card-title">
                {lang === 'EN' ? product.name : product.nameTa}
              </h3>

              <p className="card-desc">{product.description}</p>

              <div className="card-footer">
                <div>
                  <span className="card-price">₹{product.price}</span>
                  <span style={{ textDecoration: 'line-through', color: '#94A3B8', fontSize: '0.85rem', marginLeft: '6px' }}>
                    ₹{product.originalPrice}
                  </span>
                  <div style={{ fontSize: '0.8rem', color: '#F59E0B', fontWeight: '700', marginTop: '2px' }}>
                    ★ {product.rating} / 5.0
                  </div>
                </div>

                <button 
                  className={`btn-${addedItemIds.includes(product.id) ? 'secondary' : 'primary'}`}
                  style={{ padding: '0.6rem 1.2rem' }}
                  onClick={() => handleAddToCart(product)}
                >
                  {addedItemIds.includes(product.id) ? (
                    <> <Check size={16} /> Added! </>
                  ) : (
                    <> <ShoppingBag size={16} /> Add to Cart </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
