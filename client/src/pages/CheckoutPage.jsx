import React, { useState } from 'react';
import { CreditCard, Truck, ShieldCheck, MapPin, Phone, User, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function CheckoutPage({ onNavigate, onOrderPlaced }) {
  const { user } = useAuth();
  const { items, subtotal, discount, shipping, tax, total, appliedCoupon, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Morgan',
    email: user?.email || 'tester@example.com',
    phone: user?.phone || '9876543210',
    address: user?.address || '742 Evergreen Terrace',
    city: user?.city || 'Springfield',
    state: user?.state || 'Oregon',
    pinCode: user?.pinCode || '97477',
    paymentMethod: 'card',
    cardNumber: '4111 2222 3333 4444',
    cardExpiry: '12/28',
    cardCvv: '789',
    upiId: 'tester@upi'
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};

    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) errs.email = 'Email address is required';
    if (!formData.address.trim()) errs.address = 'Street address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.state.trim()) errs.state = 'State is required';

    // PIN code validation: checks length
    if (!formData.pinCode.trim()) {
      errs.pinCode = 'PIN code is required';
    } else if (formData.pinCode.trim().length < 5) {
      errs.pinCode = 'PIN code must be at least 5 digits';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    }

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) errs.cardNumber = 'Card number is required';
      if (!formData.cardExpiry.trim()) errs.cardExpiry = 'Expiry date is required';
      if (!formData.cardCvv.trim()) errs.cardCvv = 'CVV is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (items.length === 0) {
      setServerError('Your cart is empty. Please add items before checking out.');
      return;
    }

    if (!validate()) return;

    setSubmitting(true);
    try {
      const orderPayload = {
        userId: user?.id || 'guest',
        customerName: formData.name,
        userEmail: formData.email,
        items,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod === 'card' ? 'Credit Card' : formData.paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery',
        couponCode: appliedCoupon?.code || '',
        subtotal,
        discount,
        tax,
        shipping,
        total
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to place order.');
      }

      clearCart();
      // Notice: data contains order_id (from backend route)
      const orderResult = data.order || { id: data.order_id, ...orderPayload };
      onOrderPlaced(orderResult);
    } catch (err) {
      setServerError(err.message || 'Something went wrong while processing your order.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="page-container" style={{ maxWidth: '500px', textAlign: 'center', padding: '5rem 1rem' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <h2>No Items to Checkout</h2>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0 1.5rem' }}>
            Please select products from the catalog before proceeding to checkout.
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('products')}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Checkout & Payment</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '2rem' }}>
        Provide your shipping details and select a payment method to complete your purchase.
      </p>

      {serverError && (
        <div style={{
          background: 'var(--color-danger-bg)',
          border: '1px solid #fecaca',
          color: 'var(--color-danger)',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }} id="checkout-server-error">
          <AlertCircle size={18} />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate id="checkout-form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
          {/* Shipping & Payment Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Contact & Shipping Address Card */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} color="var(--color-primary)" /> Shipping Address
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-name">Recipient Name *</label>
                  <input
                    id="checkout-name"
                    name="name"
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <div className="form-error"><AlertCircle size={14} /><span>{errors.name}</span></div>}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-email">Email Address *</label>
                  <input
                    id="checkout-email"
                    name="email"
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="form-error"><AlertCircle size={14} /><span>{errors.email}</span></div>}
                </div>
              </div>

              {/* Street Address */}
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-address">Street Address *</label>
                <input
                  id="checkout-address"
                  name="address"
                  type="text"
                  className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  value={formData.address}
                  onChange={handleChange}
                />
                {errors.address && <div className="form-error"><AlertCircle size={14} /><span>{errors.address}</span></div>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                {/* City */}
                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-city">City *</label>
                  <input
                    id="checkout-city"
                    name="city"
                    type="text"
                    className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                    value={formData.city}
                    onChange={handleChange}
                  />
                  {errors.city && <div className="form-error"><AlertCircle size={14} /><span>{errors.city}</span></div>}
                </div>

                {/* State */}
                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-state">State / Province *</label>
                  <input
                    id="checkout-state"
                    name="state"
                    type="text"
                    className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                    value={formData.state}
                    onChange={handleChange}
                  />
                  {errors.state && <div className="form-error"><AlertCircle size={14} /><span>{errors.state}</span></div>}
                </div>

                {/* PIN Code */}
                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-pincode">PIN / Postal Code *</label>
                  <input
                    id="checkout-pincode"
                    name="pinCode"
                    type="text"
                    className={`form-control ${errors.pinCode ? 'is-invalid' : ''}`}
                    value={formData.pinCode}
                    onChange={handleChange}
                  />
                  {errors.pinCode && <div className="form-error"><AlertCircle size={14} /><span>{errors.pinCode}</span></div>}
                </div>
              </div>

              {/* Phone */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="checkout-phone">Contact Phone Number *</label>
                <input
                  id="checkout-phone"
                  name="phone"
                  type="tel"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <div className="form-error"><AlertCircle size={14} /><span>{errors.phone}</span></div>}
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={18} color="var(--color-primary)" /> Payment Method
              </h3>

              {/* Payment Radios */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    background: formData.paymentMethod === 'card' ? 'var(--color-primary-light)' : 'white',
                    cursor: 'pointer'
                  }}
                  id="payment-method-card-label"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                    id="radio-payment-card"
                  />
                  <CreditCard size={18} />
                  <span style={{ fontWeight: 600, fontSize: '0.925rem' }}>Credit or Debit Card</span>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    background: formData.paymentMethod === 'upi' ? 'var(--color-primary-light)' : 'white',
                    cursor: 'pointer'
                  }}
                  id="payment-method-upi-label"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={handleChange}
                    id="radio-payment-upi"
                  />
                  <span style={{ fontWeight: 600, fontSize: '0.925rem' }}>UPI / Instant Banking</span>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    background: formData.paymentMethod === 'cod' ? 'var(--color-primary-light)' : 'white',
                    cursor: 'pointer'
                  }}
                  id="payment-method-cod-label"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                    id="radio-payment-cod"
                  />
                  <span style={{ fontWeight: 600, fontSize: '0.925rem' }}>Cash on Delivery (COD)</span>
                </label>
              </div>

              {/* Card input fields */}
              {formData.paymentMethod === 'card' && (
                <div style={{ padding: '1.25rem', background: 'var(--bg-alt)', borderRadius: 'var(--radius-md)' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-card-num">Card Number</label>
                    <input
                      id="checkout-card-num"
                      name="cardNumber"
                      type="text"
                      className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                      placeholder="4111 2222 3333 4444"
                      value={formData.cardNumber}
                      onChange={handleChange}
                    />
                    {errors.cardNumber && <div className="form-error"><AlertCircle size={14} /><span>{errors.cardNumber}</span></div>}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" htmlFor="checkout-card-expiry">Expiry Date</label>
                      <input
                        id="checkout-card-expiry"
                        name="cardExpiry"
                        type="text"
                        placeholder="MM/YY"
                        className={`form-control ${errors.cardExpiry ? 'is-invalid' : ''}`}
                        value={formData.cardExpiry}
                        onChange={handleChange}
                      />
                      {errors.cardExpiry && <div className="form-error"><AlertCircle size={14} /><span>{errors.cardExpiry}</span></div>}
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" htmlFor="checkout-card-cvv">Security Code (CVV)</label>
                      <input
                        id="checkout-card-cvv"
                        name="cardCvv"
                        type="password"
                        maxLength="4"
                        placeholder="123"
                        className={`form-control ${errors.cardCvv ? 'is-invalid' : ''}`}
                        value={formData.cardCvv}
                        onChange={handleChange}
                      />
                      {errors.cardCvv && <div className="form-error"><AlertCircle size={14} /><span>{errors.cardCvv}</span></div>}
                    </div>
                  </div>
                </div>
              )}

              {/* UPI fields */}
              {formData.paymentMethod === 'upi' && (
                <div style={{ padding: '1.25rem', background: 'var(--bg-alt)', borderRadius: 'var(--radius-md)' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="checkout-upi-id">Virtual Payment Address (UPI ID)</label>
                    <input
                      id="checkout-upi-id"
                      name="upiId"
                      type="text"
                      placeholder="username@bank"
                      className="form-control"
                      value={formData.upiId}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Review & Place Order Sidebar */}
          <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Order Review ({items.length} items)</h3>

            {/* Item summary scroll */}
            <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem', paddingRight: '0.25rem' }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                    {item.quantity}x {item.name}
                  </span>
                  <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                <span style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                  <span>Discount:</span>
                  <span style={{ fontWeight: 600 }}>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shipping:</span>
                <span style={{ fontWeight: 600 }}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Tax:</span>
                <span style={{ fontWeight: 600 }}>${tax.toFixed(2)}</span>
              </div>
              <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.35rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>Total:</span>
                <span style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }} id="checkout-total-val">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              style={{ marginTop: '1.5rem' }}
              disabled={submitting}
              id="place-order-submit-btn"
            >
              <CheckCircle2 size={18} />
              <span>{submitting ? 'Placing Order...' : 'Place Order'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
