import React from 'react';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';

export default function OrderSuccessPage({ order, onNavigate }) {
  if (!order) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <h2>Order Completed</h2>
        <button className="btn btn-primary" onClick={() => onNavigate('products')} style={{ marginTop: '1rem' }}>
          Back to Store
        </button>
      </div>
    );
  }

  const orderId = order.id || order.order_id || 'ORD-TEST';

  return (
    <div className="page-container" style={{ maxWidth: '680px', paddingTop: '3rem', paddingBottom: '4rem' }}>
      <div className="card" style={{ padding: '3rem 2.5rem', textAlign: 'center' }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'var(--color-success-bg)',
          color: 'var(--color-success)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          border: '2px solid #bbf7d0'
        }}>
          <CheckCircle size={40} />
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Order Confirmed!</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1.75rem' }}>
          Thank you for your purchase. We have received your order and are preparing it for shipment.
        </p>

        {/* Order Details Badge */}
        <div style={{ background: 'var(--bg-alt)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Order Reference ID:</span>
            <code style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.95rem' }} id="confirmed-order-id">
              {orderId}
            </code>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Customer:</span>
            <span style={{ fontWeight: 600 }}>{order.customerName || order.shippingAddress?.address}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Delivery Address:</span>
            <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '300px' }}>
              {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pinCode}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Payment:</span>
            <span style={{ fontWeight: 600 }}>{order.paymentMethod}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '1.05rem' }}>
            <span style={{ fontWeight: 700 }}>Total Paid:</span>
            <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>${(order.total || 0).toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary btn-lg"
            onClick={() => onNavigate('orders')}
            id="success-view-orders-btn"
          >
            <Package size={18} />
            <span>View My Orders</span>
          </button>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => onNavigate('products')}
            id="success-continue-shopping-btn"
          >
            <span>Continue Shopping</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
