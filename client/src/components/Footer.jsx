import React from 'react';
import { ShoppingBag, ShieldCheck, RefreshCw, Terminal, Heart } from 'lucide-react';

export default function Footer({ onNavigate, onOpenTestData }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <ShoppingBag size={18} />
            </div>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem' }}>QA Practice Store</span>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '320px', color: '#94a3b8' }}>
            A comprehensive, modern e-commerce training web application created specifically for practicing manual QA testing, defect identification, test case design, and bug reporting.
          </p>
        </div>

        <div>
          <h4>Store Navigation</h4>
          <ul className="footer-links">
            <li><a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Home Showcase</a></li>
            <li><a href="#products" onClick={(e) => { e.preventDefault(); onNavigate('products'); }}>Full Product Catalog</a></li>
            <li><a href="#cart" onClick={(e) => { e.preventDefault(); onNavigate('cart'); }}>Shopping Cart</a></li>
            <li><a href="#orders" onClick={(e) => { e.preventDefault(); onNavigate('orders'); }}>Order History</a></li>
            <li><a href="#profile" onClick={(e) => { e.preventDefault(); onNavigate('profile'); }}>User Profile</a></li>
          </ul>
        </div>

        <div>
          <h4>QA Workspace</h4>
          <ul className="footer-links">
            <li>
              <a href="#testdata" onClick={(e) => { e.preventDefault(); onOpenTestData(); }}>
                Test Accounts & Data
              </a>
            </li>
            <li>
              <a href="#admin" onClick={(e) => { e.preventDefault(); onNavigate('admin'); }}>
                Admin Portal
              </a>
            </li>
            <li><a href="#login" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>Sign In</a></li>
            <li><a href="#register" onClick={(e) => { e.preventDefault(); onNavigate('register'); }}>New Registration</a></li>
          </ul>
        </div>

        <div>
          <h4>Testing Guidelines</h4>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '0.8rem' }}>
            Explore various modules, test negative edge cases, examine API payloads in DevTools, and document defects in your test reporting sheet.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#1e293b', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', color: '#38bdf8' }}>
            <Terminal size={14} />
            <span>Local API: localhost:5000</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          &copy; {new Date().getFullYear()} QA Practice Store. Designed for Manual QA Testers.
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <span>Deterministic Test Environment</span>
          <span>REST API Enabled</span>
        </div>
      </div>
    </footer>
  );
}
