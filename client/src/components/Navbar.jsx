import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, User, LogOut, Package, ShieldCheck, ChevronDown, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ onNavigate, currentPage, onOpenTestData }) {
  const { user, logout, isAdmin } = useAuth();
  const { totalItemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    onNavigate('login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div 
          className="brand-logo" 
          onClick={() => onNavigate('home')} 
          style={{ cursor: 'pointer' }}
          id="nav-brand-logo"
        >
          <div className="logo-icon">
            <ShoppingBag size={22} />
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            QA Store <span className="badge-qa">Practice</span>
          </span>
        </div>

        {/* Desktop Links */}
        <ul className="nav-links">
          <li>
            <button 
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => onNavigate('home')}
              id="nav-link-home"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Home
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${currentPage === 'products' ? 'active' : ''}`}
              onClick={() => onNavigate('products')}
              id="nav-link-products"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Catalog
            </button>
          </li>
          {user && (
            <li>
              <button 
                className={`nav-link ${currentPage === 'orders' ? 'active' : ''}`}
                onClick={() => onNavigate('orders')}
                id="nav-link-orders"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Orders
              </button>
            </li>
          )}
          {isAdmin && (
            <li>
              <button 
                className={`nav-link ${currentPage === 'admin' ? 'active' : ''}`}
                onClick={() => onNavigate('admin')}
                id="nav-link-admin"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7c3aed', fontWeight: 700 }}
              >
                <ShieldCheck size={16} /> Admin Portal
              </button>
            </li>
          )}
        </ul>

        {/* Actions */}
        <div className="nav-actions">
          {/* Quick Demo Accounts Drawer trigger */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenTestData}
            id="nav-test-data-btn"
            title="Open QA Test Accounts & Data Helper"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
          >
            <Sparkles size={14} color="#f59e0b" />
            <span>Test Data</span>
          </button>

          {/* Cart Icon */}
          <button 
            className="cart-btn" 
            onClick={() => onNavigate('cart')} 
            id="nav-cart-btn"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag size={20} />
            {totalItemCount > 0 && (
              <span className="cart-badge" id="nav-cart-count">
                {totalItemCount}
              </span>
            )}
          </button>

          {/* User Profile / Login */}
          {user ? (
            <div className="user-menu" ref={dropdownRef}>
              <button 
                className="user-menu-btn" 
                onClick={() => setMenuOpen(!menuOpen)}
                id="nav-user-menu-btn"
              >
                <User size={16} />
                <span>{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </button>

              {menuOpen && (
                <div className="user-dropdown" id="nav-user-dropdown">
                  <div style={{ padding: '0.6rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                  </div>
                  <div 
                    className="dropdown-item" 
                    onClick={() => { onNavigate('profile'); setMenuOpen(false); }}
                    id="menu-item-profile"
                  >
                    <User size={16} /> My Profile
                  </div>
                  <div 
                    className="dropdown-item" 
                    onClick={() => { onNavigate('orders'); setMenuOpen(false); }}
                    id="menu-item-orders"
                  >
                    <Package size={16} /> My Orders
                  </div>
                  {isAdmin && (
                    <div 
                      className="dropdown-item" 
                      onClick={() => { onNavigate('admin'); setMenuOpen(false); }}
                      id="menu-item-admin"
                      style={{ color: '#7c3aed', fontWeight: 600 }}
                    >
                      <ShieldCheck size={16} /> Admin Console
                    </div>
                  )}
                  <div className="dropdown-divider"></div>
                  <div 
                    className="dropdown-item" 
                    onClick={handleLogout}
                    id="menu-item-logout"
                    style={{ color: 'var(--color-danger)' }}
                  >
                    <LogOut size={16} /> Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => onNavigate('login')}
                id="nav-login-btn"
              >
                Sign In
              </button>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => onNavigate('register')}
                id="nav-register-btn"
              >
                Register
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            style={{ display: 'none' }}
            id="mobile-nav-toggle"
          >
            {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
