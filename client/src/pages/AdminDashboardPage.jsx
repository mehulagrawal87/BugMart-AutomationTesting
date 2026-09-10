import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, Users, Plus, Edit, Trash2, Search, Filter, Check, AlertCircle, RefreshCw, X } from 'lucide-react';
import Modal from '../components/Modal';

export default function AdminDashboardPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('products');

  // Products state
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productSearch, setProductSearch] = useState('');
  const [productCategory, setProductCategory] = useState('All');

  // Product Add / Edit Modal state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    originalPrice: '',
    stock: '',
    image: '',
    description: '',
    badge: ''
  });
  const [productActionError, setProductActionError] = useState('');

  // Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Users state
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Fetch functions
  const fetchProducts = () => {
    setLoadingProducts(true);
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.products);
      })
      .catch(err => console.error('Error fetching admin products:', err))
      .finally(() => setLoadingProducts(false));
  };

  const fetchOrders = () => {
    setLoadingOrders(true);
    fetch('/api/orders?role=admin')
      .then(res => res.json())
      .then(data => {
        if (data.success) setOrders(data.orders);
      })
      .catch(err => console.error('Error fetching admin orders:', err))
      .finally(() => setLoadingOrders(false));
  };

  const fetchUsers = () => {
    setLoadingUsers(true);
    fetch('/api/auth/users')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsers(data.users);
          setUserCount(data.count);
        }
      })
      .catch(err => console.error('Error fetching admin users:', err))
      .finally(() => setLoadingUsers(false));
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchUsers();
  }, []);

  // Product form handlers
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Electronics',
      price: '',
      originalPrice: '',
      stock: '15',
      image: '',
      description: '',
      badge: ''
    });
    setProductActionError('');
    setProductModalOpen(true);
  };

  const openEditProductModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      stock: prod.stock,
      image: prod.image,
      description: prod.description,
      badge: prod.badge || ''
    });
    setProductActionError('');
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setProductActionError('');

    if (!productForm.name || !productForm.price) {
      setProductActionError('Product name and price are mandatory fields.');
      return;
    }

    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Operation failed');
      }

      setProductModalOpen(false);
      fetchProducts();
    } catch (err) {
      setProductActionError(err.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product from the catalog?')) return;

    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchProducts();
      } else {
        alert(data.message || 'Failed to remove product.');
      }
    } catch (e) {
      alert('Error connecting to server.');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchOrders();
      }
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  // Filtered products for admin
  const filteredProducts = products.filter(p => {
    const matchesSearch = productSearch ? p.name.includes(productSearch) : true;
    const matchesCategory = productCategory === 'All' ? true : p.category === productCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Store Administration</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Manage catalog inventory, inspect customer orders, and oversee registered users.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: 'var(--bg-alt)', padding: '0.35rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <button
            className={`btn btn-sm ${activeTab === 'products' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('products')}
            id="admin-tab-products"
            style={{ background: activeTab === 'products' ? 'var(--color-primary)' : 'transparent', color: activeTab === 'products' ? 'white' : 'var(--text-dark)' }}
          >
            <Package size={15} />
            <span>Products ({products.length})</span>
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'orders' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('orders')}
            id="admin-tab-orders"
            style={{ background: activeTab === 'orders' ? 'var(--color-primary)' : 'transparent', color: activeTab === 'orders' ? 'white' : 'var(--text-dark)' }}
          >
            <ShoppingBag size={15} />
            <span>Orders ({orders.length})</span>
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('users')}
            id="admin-tab-users"
            style={{ background: activeTab === 'users' ? 'var(--color-primary)' : 'transparent', color: activeTab === 'users' ? 'white' : 'var(--text-dark)' }}
          >
            <Users size={15} />
            <span>Users ({users.length})</span>
          </button>
        </div>
      </div>

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          {/* Action & Filter Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flex: '1 1 300px', flexWrap: 'wrap' }}>
              <div className="input-with-icon" style={{ flex: '1 1 200px' }}>
                <Search className="input-icon" size={16} />
                <input
                  id="admin-product-search"
                  type="text"
                  className="form-control"
                  placeholder="Filter by product name..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  style={{ padding: '0.5rem 0.85rem 0.5rem 2.25rem', fontSize: '0.875rem' }}
                />
              </div>

              <select
                id="admin-category-filter"
                className="form-control"
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                style={{ width: 'auto', fontSize: '0.875rem', padding: '0.5rem 0.85rem' }}
              >
                <option value="All">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Wearables">Wearables</option>
                <option value="Home & Living">Home & Living</option>
                <option value="Apparel & Footwear">Apparel & Footwear</option>
                <option value="Books & Stationery">Books & Stationery</option>
              </select>
            </div>

            <button
              className="btn btn-primary btn-sm"
              onClick={openAddProductModal}
              id="admin-add-product-btn"
            >
              <Plus size={16} />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Products Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }} id="admin-products-table">
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Product</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Category</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Price</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Stock</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Rating</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }} id={`admin-product-row-${p.id}`}>
                    <td style={{ padding: '0.75rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: 40, height: 40, borderRadius: '6px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {p.id}</div>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span className="badge badge-primary">{p.category}</span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>
                      ${p.price.toFixed(2)}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span style={{ color: p.stock > 10 ? 'var(--color-success)' : 'var(--color-warning)', fontWeight: 600 }}>
                        {p.stock} units
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      ★ {p.rating} ({p.reviewCount})
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEditProductModal(p)}
                          id={`edit-product-${p.id}`}
                          title="Edit Product"
                          style={{ padding: '0.3rem 0.5rem' }}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleDeleteProduct(p.id)}
                          id={`delete-product-${p.id}`}
                          title="Delete Product"
                          style={{ padding: '0.3rem 0.5rem', color: 'var(--color-danger)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Customer Orders Management</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }} id="admin-orders-table">
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Order ID</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Customer</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Items</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Total</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Payment</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Current Status</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--border-subtle)' }} id={`admin-order-row-${o.id}`}>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>
                      {o.id}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <div>{o.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.userEmail}</div>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      {(o.items || []).length} items
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>
                      ${(o.total || 0).toFixed(2)}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      {o.paymentMethod}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span className={`badge ${o.status === 'Delivered' ? 'badge-success' : o.status === 'Shipped' ? 'badge-primary' : 'badge-warning'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <select
                        className="form-control"
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        style={{ fontSize: '0.825rem', padding: '0.35rem 0.5rem', width: 'auto' }}
                        id={`status-select-${o.id}`}
                      >
                        <option value="Placed">Placed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Registered Users</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }} id="admin-user-count-display">
              Total Recorded Users: <strong>{userCount}</strong>
            </span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }} id="admin-users-table">
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>User ID</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Name</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Email Address</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Phone</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Role</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Registered Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }} id={`admin-user-row-${u.id}`}>
                    <td style={{ padding: '0.75rem 0.5rem' }}><code>{u.id}</code></td>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{u.phone || '—'}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span className={`badge ${u.role === 'admin' ? 'badge-warning' : 'badge-primary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        title={editingProduct ? 'Edit Catalog Product' : 'Add New Product'}
        maxWidth="600px"
      >
        {productActionError && (
          <div style={{ background: 'var(--color-danger-bg)', border: '1px solid #fecaca', color: 'var(--color-danger)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertCircle size={16} /> <span>{productActionError}</span>
          </div>
        )}

        <form onSubmit={handleSaveProduct} id="admin-product-form">
          <div className="form-group">
            <label className="form-label" htmlFor="admin-form-name">Product Name *</label>
            <input
              id="admin-form-name"
              type="text"
              className="form-control"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-form-category">Category *</label>
              <select
                id="admin-form-category"
                className="form-control"
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
              >
                <option value="Electronics">Electronics</option>
                <option value="Wearables">Wearables</option>
                <option value="Home & Living">Home & Living</option>
                <option value="Apparel & Footwear">Apparel & Footwear</option>
                <option value="Books & Stationery">Books & Stationery</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-form-badge">Badge Label</label>
              <input
                id="admin-form-badge"
                type="text"
                placeholder="e.g. Sale, Top Rated"
                className="form-control"
                value={productForm.badge}
                onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-form-price">Price ($) *</label>
              <input
                id="admin-form-price"
                type="number"
                step="0.01"
                className="form-control"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-form-orig-price">Original Price ($)</label>
              <input
                id="admin-form-orig-price"
                type="number"
                step="0.01"
                className="form-control"
                value={productForm.originalPrice}
                onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-form-stock">Stock Units</label>
              <input
                id="admin-form-stock"
                type="number"
                className="form-control"
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-form-image">Image URL</label>
            <input
              id="admin-form-image"
              type="url"
              className="form-control"
              placeholder="https://images.unsplash.com/..."
              value={productForm.image}
              onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-form-desc">Product Description</label>
            <textarea
              id="admin-form-desc"
              rows="3"
              className="form-control"
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setProductModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              id="save-product-submit-btn"
            >
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
