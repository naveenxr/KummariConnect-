import React, { useState } from 'react';
import { ShoppingBag, Heart, ShieldCheck, Star, Sparkles, Filter, CheckCircle2, ArrowRight } from 'lucide-react';

export default function MarketplacePage({ addToCart, openCart }) {
  const [activeCategory, setActiveCategory] = useState('All Crafts');

  const products = [
    {
      id: 'p1',
      title: 'Ancestral Sandalwood Totem Sculpture',
      category: 'Wood Carvings',
      price: 12500,
      rating: 4.9,
      artisan: 'Kanikkaran Tribal Guild',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
      description: 'Hand-carved from sustainably sourced sandalwood depicting traditional Kanikkaran tribal motifs and coastal deity emblems.',
      badge: 'Heritage Masterpiece'
    },
    {
      id: 'p2',
      title: 'Palm Leaf Utility Basket Set (3 Pcs)',
      category: 'Palm Leaf Crafts',
      price: 850,
      rating: 4.8,
      artisan: 'Marthandam Palm Co-op',
      image: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=600&q=80',
      description: 'Woven using age-old Palmyra palm leaves with natural organic dyes. Durable, eco-friendly storage baskets.',
      badge: 'Eco Friendly'
    },
    {
      id: 'p3',
      title: 'Red Earth Terracotta Decorative Vase',
      category: 'Terracotta',
      price: 1580,
      rating: 4.9,
      artisan: 'Agasteeswaram Pottery Artisans',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
      description: 'Crafted from Kanyakumari red clay soil, wood-fired in traditional clay kilns, and hand-embellished with coastal patterns.',
      badge: '100% Organic Clay'
    },
    {
      id: 'p4',
      title: 'Sea Shell Wind Chime & Wall Hanging',
      category: 'Sea Shell Art',
      price: 450,
      rating: 4.7,
      artisan: 'Coastal Mahila Self-Help Group',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
      description: 'Handcrafted using polished natural sea shells collected from the Triveni Sangam beach waters.',
      badge: 'Bestseller'
    },
    {
      id: 'p5',
      title: 'Carved Teak Wooden Temple Elephant',
      category: 'Wood Carvings',
      price: 3200,
      rating: 4.9,
      artisan: 'Thuckalay Sculptors',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      description: 'Solid teak wood hand-carving inspired by Padmanabhapuram palace royal elephant procession statues.',
      badge: 'Solid Teak'
    },
    {
      id: 'p6',
      title: 'Handwoven Banana Fiber Tote Bag',
      category: 'Palm Leaf Crafts',
      price: 620,
      rating: 4.8,
      artisan: 'Kanyakumari Eco Crafts',
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80',
      description: 'Lightweight, washable handbag woven from extracted natural banana plant stems by local women artisans.',
      badge: 'Zero Plastic'
    }
  ];

  const filteredProducts = activeCategory === 'All Crafts' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0B2545 0%, #133A68 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px 48px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
        marginBottom: '40px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ maxWidth: '640px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '12px', display: 'inline-flex' }}>
            <ShieldCheck size={14} /> Direct Artisan Connection
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, marginBottom: '12px' }}>
            Tribal & Artisan Marketplace
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1rem', lineHeight: '1.6' }}>
            Connecting registered local artisans of Kanyakumari district directly with travelers. 100% of proceeds support indigenous families & craft preservation.
          </p>
        </div>

        <button 
          onClick={openCart} 
          className="btn-primary"
          style={{ padding: '14px 28px', fontSize: '1rem' }}
        >
          <ShoppingBag size={20} /> View Cart & Checkout
        </button>
      </div>

      {/* Category Pills Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
          Authentic Handicraft Collection
        </h2>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', backgroundColor: '#E2E8F0', padding: '4px', borderRadius: 'var(--radius-full)' }}>
          {['All Crafts', 'Wood Carvings', 'Sea Shell Art', 'Terracotta', 'Palm Leaf Crafts'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 700,
                backgroundColor: activeCategory === cat ? 'var(--primary)' : 'transparent',
                color: activeCategory === cat ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '28px'
      }}>
        {filteredProducts.map(product => (
          <div 
            key={product.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'var(--transition)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ position: 'relative', height: '230px' }}>
              <img 
                src={product.image} 
                alt={product.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span className="badge badge-coral" style={{ position: 'absolute', top: '12px', left: '12px' }}>
                {product.badge}
              </span>
              <span className="badge badge-gold" style={{ position: 'absolute', top: '12px', right: '12px' }}>
                ★ {product.rating}
              </span>
            </div>

            <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>
                  {product.title}
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 700, marginBottom: '10px' }}>
                  Artisan Guild: {product.artisan}
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: '1.5' }}>
                  {product.description}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Price (Tax incl.)</span>
                  <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.25rem' }}>
                    ₹{product.price.toLocaleString()}
                  </div>
                </div>
                <button 
                  onClick={() => addToCart(product)}
                  className="btn-primary" 
                  style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                >
                  <ShoppingBag size={16} /> Add to Cart
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
