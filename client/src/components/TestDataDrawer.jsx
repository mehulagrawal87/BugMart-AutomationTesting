import React, { useState } from 'react';
import { X, Copy, Check, RefreshCw, Key, CreditCard, MapPin, Tag } from 'lucide-react';

export default function TestDataDrawer({ isOpen, onClose, onFillLogin }) {
  const [copiedKey, setCopiedKey] = useState('');
  const [resetting, setResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState('');

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const handleResetData = async () => {
    setResetting(true);
    setResetMsg('');
    try {
      const res = await fetch('/api/system/reset', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setResetMsg('Database successfully reset to default state.');
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setResetMsg('Reset failed: ' + (data.message || 'Server error'));
      }
    } catch (e) {
      setResetMsg('Could not connect to API server.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="modal-backdrop" 
          style={{ zIndex: 105 }}
          onClick={onClose}
        />
      )}
      <aside className={`test-data-drawer ${isOpen ? 'open' : ''}`} id="test-data-drawer">
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={18} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>QA Testing Reference Data</h3>
          </div>
          <button 
            className="modal-close" 
            onClick={onClose}
            id="close-test-data-drawer"
            aria-label="Close Drawer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="drawer-content">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Use these standard test accounts, addresses, and test credentials to execute your test cases across all pages.
          </p>

          {/* Test Accounts */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-dark)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Key size={15} /> Demo User Accounts
            </h4>

            {/* Standard Tester */}
            <div className="demo-account-box" id="demo-tester-box">
              <div className="acc-header">
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Customer Account</span>
                <span className="badge badge-primary">Customer</span>
              </div>
              <div className="credential-row">
                <span className="label">Email:</span>
                <code style={{ fontSize: '0.8rem', background: '#e2e8f0', padding: '1px 5px', borderRadius: '4px' }}>
                  tester@example.com
                </code>
              </div>
              <div className="credential-row">
                <span className="label">Password:</span>
                <code style={{ fontSize: '0.8rem', background: '#e2e8f0', padding: '1px 5px', borderRadius: '4px' }}>
                  Test@123
                </code>
              </div>
              {onFillLogin && (
                <button 
                  className="btn btn-secondary btn-sm btn-full"
                  style={{ marginTop: '0.6rem' }}
                  onClick={() => onFillLogin('tester@example.com', 'Test@123')}
                  id="autofill-tester-btn"
                >
                  Fill in Login Form
                </button>
              )}
            </div>

            {/* Admin User */}
            <div className="demo-account-box" id="demo-admin-box">
              <div className="acc-header">
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Store Administrator</span>
                <span className="badge badge-warning">Admin</span>
              </div>
              <div className="credential-row">
                <span className="label">Email:</span>
                <code style={{ fontSize: '0.8rem', background: '#e2e8f0', padding: '1px 5px', borderRadius: '4px' }}>
                  admin@example.com
                </code>
              </div>
              <div className="credential-row">
                <span className="label">Password:</span>
                <code style={{ fontSize: '0.8rem', background: '#e2e8f0', padding: '1px 5px', borderRadius: '4px' }}>
                  Admin@123
                </code>
              </div>
              {onFillLogin && (
                <button 
                  className="btn btn-secondary btn-sm btn-full"
                  style={{ marginTop: '0.6rem' }}
                  onClick={() => onFillLogin('admin@example.com', 'Admin@123')}
                  id="autofill-admin-btn"
                >
                  Fill in Login Form
                </button>
              )}
            </div>
          </div>

          {/* Sample Shipping Data */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-dark)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={15} /> Sample Delivery Address
            </h4>
            <div className="demo-account-box" style={{ fontSize: '0.85rem' }}>
              <div><strong>Recipient:</strong> Alex Morgan</div>
              <div><strong>Street:</strong> 742 Evergreen Terrace</div>
              <div><strong>City:</strong> Springfield, OR</div>
              <div><strong>PIN / Postal Code:</strong> 97477</div>
              <div><strong>Phone:</strong> 9876543210</div>
            </div>
          </div>

          {/* Test Payment Info */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-dark)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CreditCard size={15} /> Test Payment Cards
            </h4>
            <div className="demo-account-box" style={{ fontSize: '0.85rem' }}>
              <div className="credential-row">
                <span className="label">Test Card:</span>
                <code>4111 2222 3333 4444</code>
              </div>
              <div className="credential-row">
                <span className="label">Expiry:</span>
                <code>12/28</code>
              </div>
              <div className="credential-row">
                <span className="label">CVV:</span>
                <code>789</code>
              </div>
            </div>
          </div>

          {/* Promo Coupons */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-dark)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Tag size={15} /> Test Promo Codes
            </h4>
            <div className="demo-account-box" style={{ fontSize: '0.85rem' }}>
              <div style={{ marginBottom: '0.3rem' }}><code>SAVE10</code> - 10% discount ($40 min)</div>
              <div style={{ marginBottom: '0.3rem' }}><code>FIRST20</code> - 20% discount</div>
              <div><code>FREESHIP</code> - Free standard shipping</div>
            </div>
          </div>

          {/* Reset Store Database */}
          <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button 
              className="btn btn-outline btn-full btn-sm"
              onClick={handleResetData}
              disabled={resetting}
              id="reset-store-data-btn"
              style={{ color: '#64748b', borderColor: '#cbd5e1' }}
            >
              <RefreshCw size={14} className={resetting ? 'spin' : ''} />
              <span>{resetting ? 'Resetting Data...' : 'Reset Store Data to Default'}</span>
            </button>
            {resetMsg && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', textAlign: 'center', color: 'var(--color-primary)' }}>
                {resetMsg}
              </p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
