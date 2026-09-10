import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TestDataDrawer from './components/TestDataDrawer';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function MainApp() {
  const { user, isAdmin } = useAuth();

  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [catalogCategory, setCatalogCategory] = useState('All');
  const [completedOrder, setCompletedOrder] = useState(null);

  // Test data drawer state
  const [testDataOpen, setTestDataOpen] = useState(false);
  const [autoFillCreds, setAutoFillCreds] = useState({ email: '', password: '' });

  // Scroll to top on page transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedProductId]);

  const handleNavigate = (page, params = {}) => {
    if (params.category) {
      setCatalogCategory(params.category);
    }
    if (page === 'products' && !params.category) {
      setCatalogCategory('All');
    }
    setCurrentPage(page);
  };

  const handleSelectProduct = (id) => {
    setSelectedProductId(id);
    setCurrentPage('product-detail');
  };

  const handleOrderPlaced = (order) => {
    setCompletedOrder(order);
    setCurrentPage('order-success');
  };

  const handleFillLogin = (email, password) => {
    setAutoFillCreds({ email, password });
    setTestDataOpen(false);
    setCurrentPage('login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenTestData={() => setTestDataOpen(true)}
      />

      <main className="main-content">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onOpenTestData={() => setTestDataOpen(true)}
          />
        )}

        {currentPage === 'products' && (
          <ProductsPage
            initialCategory={catalogCategory}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'product-detail' && (
          <ProductDetailPage
            productId={selectedProductId}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            onNavigate={handleNavigate}
            onOrderPlaced={handleOrderPlaced}
          />
        )}

        {currentPage === 'order-success' && (
          <OrderSuccessPage
            order={completedOrder}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'orders' && (
          <OrdersPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'profile' && (
          <ProfilePage onNavigate={handleNavigate} />
        )}

        {currentPage === 'login' && (
          <LoginPage
            onNavigate={handleNavigate}
            initialEmail={autoFillCreds.email}
            initialPassword={autoFillCreds.password}
          />
        )}

        {currentPage === 'register' && (
          <RegisterPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'admin' && (
          <AdminDashboardPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Floating QA Reference Data Button & Slide-over Drawer */}
      <button
        className="test-data-trigger"
        onClick={() => setTestDataOpen(true)}
        id="floating-qa-test-data-btn"
        title="Open QA Test Credentials & Reference Data"
      >
        <span>Test Accounts & Data</span>
      </button>

      <TestDataDrawer
        isOpen={testDataOpen}
        onClose={() => setTestDataOpen(false)}
        onFillLogin={handleFillLogin}
      />

      <Footer
        onNavigate={handleNavigate}
        onOpenTestData={() => setTestDataOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
