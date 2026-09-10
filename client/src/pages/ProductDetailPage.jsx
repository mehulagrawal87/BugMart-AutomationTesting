import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, ShoppingCart, Zap, Check, ShieldCheck, Truck, RotateCcw, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage({ productId, onNavigate }) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.product) {
          setProduct(data.product);
        } else {
          setErrorMsg(data.message || 'Product could not be loaded.');
        }
      })
      .catch(err => {
        setErrorMsg('Network error fetching product details.');
      })
      .finally(() => setLoading(false));
  }, [productId]);

  const handleQuantityChange = (val) => {
    // Allows direct input value
    setQuantity(val);
  };

  const incrementQty = () => {
    setQuantity(prev => {
      const num = parseInt(prev, 10);
      return isNaN(num) ? 1 : num + 1;
    });
  };

  const decrementQty = () => {
    setQuantity(prev => {
      const num = parseInt(prev, 10);
      if (isNaN(num)) return 1;
      return num > 0 ? num - 1 : 0;
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    const qty = parseInt(quantity, 10);
    addToCart(product, isNaN(qty) ? 1 : qty);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const handleBuyNow = () => {
    if (!product) return;
    const qty = parseInt(quantity, 10);
    addToCart(product, isNaN(qty) ? 1 : qty);
    onNavigate('checkout');
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading product details...</p>
      </div>
    );
  }

  if (errorMsg || !product) {
    return (
      <div className="page-container" style={{ maxWidth: '600px', textAlign: 'center', padding: '4rem 1rem' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <AlertCircle size={44} color="var(--color-danger)" style={{ margin: '0 auto 1rem' }} />
          <h2>Product Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {errorMsg || 'The requested product could not be located.'}
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('products')}>
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Breadcrumb / Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onNavigate('products')}
          id="back-to-products-btn"
        >
          <ArrowLeft size={16} />
          <span>Back to Catalog</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}>
        {/* Product Image Gallery */}
        <div className="card" style={{ padding: '1rem', background: '#f8fafc' }}>
          <div style={{ position: 'relative', width: '100%', paddingTop: '80%', overflow: 'hidden', borderRadius: 'var(--radius-md)' }}>
            <img
              src={product.image}
              alt={product.name}
              id="product-detail-image"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&auto=format&fit=crop&q=80';
              }}
            />
          </div>
        </div>

        {/* Product Details & Actions */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-primary">{product.category}</span>
            {product.badge && <span className="badge badge-warning">{product.badge}</span>}
          </div>

          <h1 style={{ fontSize: '2rem', lineHeight: 1.25, marginBottom: '0.75rem' }} id="product-detail-title">
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: '#fffbeb', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid #fef3c7' }}>
              <Star size={16} fill="#f59e0b" stroke="#f59e0b" />
              <span style={{ fontWeight: 700, color: '#92400e', fontSize: '0.9rem' }}>{product.rating}</span>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              ({product.reviewCount} customer reviews)
            </span>
            <span style={{ color: 'var(--text-light)' }}>•</span>
            <span style={{ fontSize: '0.875rem', color: product.inStock ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }} id="product-stock-status">
              {product.inStock ? `In Stock (${product.stockCount})` : 'Out of Stock'}
            </span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.85rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-dark)' }} id="product-detail-price">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span style={{ fontSize: '1.15rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                  ${product.originalPrice.toFixed(2)}
                </span>
                <span className="badge badge-danger">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '1rem', marginBottom: '1.75rem' }} id="product-detail-desc">
            {product.description}
          </p>

          {/* Features bullet list */}
          {product.features && product.features.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.65rem' }}>Highlights & Features:</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {product.features.map((feat, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                    <Check size={16} color="var(--color-success)" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity selector & Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-alt)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label htmlFor="product-qty-input" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Quantity:</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <button
                  type="button"
                  onClick={decrementQty}
                  style={{ width: 36, height: 36, border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600 }}
                  id="qty-decrement-btn"
                >
                  -
                </button>
                <input
                  id="product-qty-input"
                  type="text"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  style={{ width: 44, textAlign: 'center', border: 'none', fontWeight: 700, outline: 'none' }}
                />
                <button
                  type="button"
                  onClick={incrementQty}
                  style={{ width: 36, height: 36, border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600 }}
                  id="qty-increment-btn"
                >
                  +
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary btn-lg"
                style={{ flex: 1 }}
                onClick={handleAddToCart}
                id="detail-add-to-cart-btn"
              >
                <ShoppingCart size={18} />
                <span>{addedSuccess ? 'Added to Cart!' : 'Add to Cart'}</span>
              </button>

              <button
                className="btn btn-secondary btn-lg"
                style={{ flex: 1, background: '#1e293b', color: 'white', borderColor: '#1e293b' }}
                onClick={handleBuyNow}
                id="detail-buy-now-btn"
              >
                <Zap size={18} color="#fbbf24" />
                <span>Buy Now</span>
              </button>
            </div>

            {addedSuccess && (
              <div style={{ fontSize: '0.875rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                <Check size={16} />
                <span>Item successfully added to your shopping cart!</span>
              </div>
            )}
          </div>

          {/* Guarantees */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', textAlign: 'center' }}>
            <div>
              <Truck size={20} color="var(--color-primary)" style={{ margin: '0 auto 0.35rem' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Quick Dispatch</div>
            </div>
            <div>
              <ShieldCheck size={20} color="var(--color-primary)" style={{ margin: '0 auto 0.35rem' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>1-Year Warranty</div>
            </div>
            <div>
              <RotateCcw size={20} color="var(--color-primary)" style={{ margin: '0 auto 0.35rem' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>30-Day Returns</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
