import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Truck, ShieldCheck, RefreshCcw, Tag, Smartphone, Watch, Coffee, Shirt, BookOpen } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function HomePage({ onNavigate, onSelectProduct, onOpenTestData }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) {
          setFeaturedProducts(data.products.slice(0, 4));
        }
      })
      .catch(err => console.error('Error loading products:', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { name: 'Electronics', icon: <Smartphone size={24} />, count: '5 Items', color: '#4f46e5' },
    { name: 'Wearables', icon: <Watch size={24} />, count: '3 Items', color: '#06b6d4' },
    { name: 'Home & Living', icon: <Coffee size={24} />, count: '5 Items', color: '#f59e0b' },
    { name: 'Apparel & Footwear', icon: <Shirt size={24} />, count: '3 Items', color: '#10b981' },
    { name: 'Books & Stationery', icon: <BookOpen size={24} />, count: '2 Items', color: '#ec4899' }
  ];

  return (
    <div className="page-container">
      {/* Hero Banner */}
      <section className="hero-banner" id="hero-banner">
        <div className="hero-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem', backdropFilter: 'blur(6px)' }}>
            <Sparkles size={16} color="#fbbf24" />
            <span>Interactive Manual QA Testing Platform</span>
          </div>
          <h1>Discover Next-Gen Products with Realistic Testing Scenarios</h1>
          <p>
            Experience a full-fledged e-commerce store built to simulate modern web applications. Practice test case design, identify subtle anomalies, and log defects.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('products')}
              id="hero-shop-btn"
              style={{ background: 'white', color: 'var(--color-primary)' }}
            >
              <span>Explore Catalog</span>
              <ArrowRight size={18} />
            </button>
            <button 
              className="btn btn-outline btn-lg"
              onClick={onOpenTestData}
              id="hero-testdata-btn"
              style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}
            >
              <Sparkles size={18} />
              <span>Test Credentials</span>
            </button>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: '10px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>Free Standard Shipping</h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>On orders over $50 with coupon FREESHIP</p>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: '10px', background: '#dcfce7', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>Safe & Isolated Testing</h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Local sandbox with full REST API backend</p>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RefreshCcw size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>1-Click State Reset</h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Restore database whenever needed</p>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: '10px', background: '#fce7f3', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tag size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>10% Promo Code</h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Use code SAVE10 during checkout</p>
          </div>
        </div>
      </div>

      {/* Category Explorer */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Shop by Department</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Browse curated collections across premium product categories</p>
          </div>
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => onNavigate('products')}
            id="view-all-categories-btn"
          >
            <span>All Categories</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
          {categories.map((cat, idx) => (
            <div 
              key={idx}
              className="card card-hover"
              onClick={() => onNavigate('products', { category: cat.name })}
              style={{ padding: '1.5rem 1rem', textAlign: 'center', cursor: 'pointer' }}
              id={`cat-card-${idx}`}
            >
              <div style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: `${cat.color}15`,
                color: cat.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.85rem'
              }}>
                {cat.icon}
              </div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>{cat.name}</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cat.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Trending Highlights</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Top picks rated by customers this week</p>
          </div>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => onNavigate('products')}
            id="browse-more-products-btn"
          >
            <span>View All (18+)</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            Loading store products...
          </div>
        ) : (
          <div className="product-grid">
            {featuredProducts.map(prod => (
              <ProductCard 
                key={prod.id} 
                product={prod} 
                onSelectProduct={onSelectProduct} 
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
