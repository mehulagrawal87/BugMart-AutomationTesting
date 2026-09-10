import React from 'react';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onSelectProduct }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div 
      className="card card-hover product-card" 
      onClick={() => onSelectProduct(product.id)}
      id={`product-card-${product.id}`}
      style={{ cursor: 'pointer' }}
    >
      <div className="product-thumb-container">
        {product.badge && (
          <div className="product-badge-overlay">
            <span className={`badge ${product.badge === 'Sale' ? 'badge-danger' : product.badge === 'Top Rated' ? 'badge-warning' : 'badge-primary'}`}>
              {product.badge}
            </span>
          </div>
        )}
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-thumb"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&auto=format&fit=crop&q=80';
          }}
        />
      </div>

      <div className="product-body">
        <span className="product-category">{product.category}</span>
        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>

        <div className="product-rating">
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <Star size={14} fill="#f59e0b" stroke="#f59e0b" />
            <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{product.rating}</span>
          </div>
          <span className="review-count">({product.reviewCount} reviews)</span>
        </div>

        <div className="product-footer">
          <div className="price-container">
            <span className="current-price">${product.price.toFixed(2)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="original-price">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <button 
            className="btn btn-primary btn-sm"
            onClick={handleAddToCart}
            id={`add-to-cart-${product.id}`}
            title="Add to Shopping Cart"
          >
            <ShoppingCart size={15} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
