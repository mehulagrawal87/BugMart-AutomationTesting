import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, Tag, ShoppingBag, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage({ onNavigate }) {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    couponError,
    subtotal,
    discount,
    shipping,
    tax,
    total
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    setCouponSuccess('');
    const res = await applyCoupon(couponInput);
    setCouponLoading(false);

    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    }
  };

  const handleQtyStep = (productId, currentQty, delta) => {
    const next = currentQty + delta;
    updateQuantity(productId, next);
  };

  if (items.length === 0) {
    return (
      <div className="page-container" style={{ maxWidth: '600px', textAlign: 'center', padding: '5rem 1rem' }}>
        <div className="card" style={{ padding: '3.5rem 2rem' }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <ShoppingBag size={34} />
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Looks like you haven't added any items to your shopping cart yet.
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => onNavigate('products')}
            id="empty-cart-shop-btn"
          >
            <span>Start Shopping</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Shopping Cart</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Review your selected products, adjust quantities, and apply discount codes.
          </p>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={clearCart}
          id="clear-entire-cart-btn"
          style={{ color: 'var(--color-danger)' }}
        >
          Clear All Items
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
        {/* Cart Items Table/List */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {items.map((item) => (
              <div
                key={item.id}
                id={`cart-item-${item.id}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr auto auto',
                  gap: '1.25rem',
                  alignItems: 'center',
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                {/* Thumbnail */}
                <div style={{ width: 80, height: 80, borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#f1f5f9' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>

                {/* Info */}
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{item.name}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    Unit Price: ${item.price.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>
                    Category: {item.category}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', background: 'white' }}>
                    <button
                      type="button"
                      onClick={() => handleQtyStep(item.id, item.quantity, -1)}
                      style={{ width: 30, height: 30, border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700 }}
                      id={`cart-item-${item.id}-minus`}
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, e.target.value)}
                      style={{ width: 38, textAlign: 'center', border: 'none', outline: 'none', fontSize: '0.875rem', fontWeight: 600 }}
                      id={`cart-item-${item.id}-qty-input`}
                    />
                    <button
                      type="button"
                      onClick={() => handleQtyStep(item.id, item.quantity, 1)}
                      style={{ width: 30, height: 30, border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700 }}
                      id={`cart-item-${item.id}-plus`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Subtotal & Remove */}
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', fontFamily: 'var(--font-heading)' }} id={`cart-item-${item.id}-subtotal`}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                    id={`cart-item-${item.id}-remove-btn`}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('products')}
              id="cart-continue-shopping-btn"
            >
              <ArrowLeft size={16} />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>

        {/* Order Summary & Coupon Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Coupon Box */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Tag size={16} /> Have a Promo Code?
            </h3>
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. SAVE10"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                id="coupon-code-input"
              />
              <button
                type="submit"
                className="btn btn-secondary"
                disabled={couponLoading}
                id="apply-coupon-btn"
              >
                Apply
              </button>
            </form>

            {appliedCoupon && (
              <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'var(--color-success-bg)', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#166534' }}>
                <span style={{ fontWeight: 600 }}>Code: {appliedCoupon.code} Applied</span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}
                  id="remove-coupon-btn"
                >
                  Remove
                </button>
              </div>
            )}

            {couponSuccess && !appliedCoupon && (
              <div style={{ marginTop: '0.5rem', color: 'var(--color-success)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Check size={14} /> <span>{couponSuccess}</span>
              </div>
            )}

            {couponError && (
              <div style={{ marginTop: '0.5rem', color: 'var(--color-danger)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }} id="coupon-error-msg">
                <AlertCircle size={14} /> <span>{couponError}</span>
              </div>
            )}
          </div>

          {/* Totals Summary */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Order Summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.925rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Items Subtotal:</span>
                <span style={{ fontWeight: 600 }} id="cart-subtotal-val">${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                  <span>Discount ({appliedCoupon?.code}):</span>
                  <span style={{ fontWeight: 600 }} id="cart-discount-val">-${discount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Tax (8%):</span>
                <span style={{ fontWeight: 600 }} id="cart-tax-val">${tax.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shipping:</span>
                <span style={{ fontWeight: 600 }} id="cart-shipping-val">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.5rem 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Total Amount:</span>
                <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }} id="cart-total-val">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-full btn-lg"
              style={{ marginTop: '1.5rem' }}
              onClick={() => onNavigate('checkout')}
              id="proceed-to-checkout-btn"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
