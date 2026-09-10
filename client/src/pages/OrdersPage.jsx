import React, { useState, useEffect } from 'react';
import { Package, Clock, Eye, Calendar, MapPin, CreditCard, ChevronRight, AlertCircle, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

export default function OrdersPage({ onNavigate }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = () => {
    setLoading(true);
    const query = user?.role === 'admin' ? '?role=admin' : (user ? `?userId=${user.id}` : '');
    fetch(`/api/orders${query}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      })
      .catch(err => console.error('Failed to load orders:', err))
      .finally(() => setLoading(false));
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <span className="badge badge-success">Delivered</span>;
      case 'shipped':
        return <span className="badge badge-primary">Shipped</span>;
      case 'processing':
        return <span className="badge badge-warning">Processing</span>;
      case 'cancelled':
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge badge-primary">{status || 'Placed'}</span>;
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Recent';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Order History</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Track previous orders, view shipment status, and review item receipts.
          </p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={fetchOrders} id="refresh-orders-btn">
          Refresh Orders
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          Retrieving order history...
        </div>
      ) : orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Package size={48} color="var(--text-light)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No orders found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.925rem' }}>
            You haven't placed any orders yet. Once you complete a purchase, it will appear here.
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('products')}>
            Shop Catalog
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} id="orders-list-container">
          {orders.map((order) => (
            <div key={order.id} className="card" style={{ padding: '1.5rem' }} id={`order-card-${order.id}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Package size={18} color="var(--color-primary)" />
                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>{order.id}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Calendar size={14} />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {getStatusBadge(order.status)}
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedOrder(order)}
                    id={`view-order-details-${order.id}`}
                  >
                    <Eye size={15} />
                    <span>View Details</span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                {/* Thumbnails preview */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', overflowX: 'auto', padding: '2px 0' }}>
                  {(order.items || []).slice(0, 4).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-alt)', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-sm)' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: 34, height: 34, objectFit: 'cover', borderRadius: '4px' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        {item.name?.length > 20 ? item.name.substring(0, 20) + '...' : item.name}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        x{item.quantity}
                      </span>
                    </div>
                  ))}
                  {(order.items || []).length > 4 && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      +{order.items.length - 4} more
                    </span>
                  )}
                </div>

                {/* Amount */}
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount: </span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
                    ${(order.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Order Details - ${selectedOrder.id}` : ''}
        maxWidth="640px"
      >
        {selectedOrder && (
          <div>
            {/* Header info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-alt)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Date Placed:</span>
                <div style={{ fontWeight: 600 }}>{formatDate(selectedOrder.createdAt)}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Delivery Status:</span>
                <div>{getStatusBadge(selectedOrder.status)}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
                <div style={{ fontWeight: 600 }}>{selectedOrder.paymentMethod || 'Credit Card'}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Recipient:</span>
                <div style={{ fontWeight: 600 }}>{selectedOrder.customerName}</div>
              </div>
            </div>

            {/* Delivery address */}
            <div style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>Shipping Address:</div>
              <div style={{ color: 'var(--text-muted)' }}>
                {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.pinCode}
              </div>
              {selectedOrder.shippingAddress?.phone && (
                <div style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Contact: {selectedOrder.shippingAddress?.phone}
                </div>
              )}
            </div>

            {/* Itemized List */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.95rem' }}>Purchased Products:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700 }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div style={{ background: 'var(--bg-alt)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                <span style={{ fontWeight: 600 }}>${(selectedOrder.subtotal || 0).toFixed(2)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                  <span>Discount ({selectedOrder.couponCode || 'Promo'}):</span>
                  <span style={{ fontWeight: 600 }}>-${(selectedOrder.discount || 0).toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tax:</span>
                <span style={{ fontWeight: 600 }}>${(selectedOrder.tax || 0).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shipping:</span>
                <span style={{ fontWeight: 600 }}>${(selectedOrder.shipping || 0).toFixed(2)}</span>
              </div>
              <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.35rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem' }}>
                <span style={{ fontWeight: 700 }}>Total:</span>
                <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>${(selectedOrder.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
