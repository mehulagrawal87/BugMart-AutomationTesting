import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

export default function LoginPage({ onNavigate, initialEmail = '', initialPassword = '' }) {
  const { login, user } = useAuth();

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
    if (initialPassword) setPassword(initialPassword);
  }, [initialEmail, initialPassword]);

  useEffect(() => {
    const remembered = localStorage.getItem('qa_remembered_email');
    if (remembered && !email) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  const validate = () => {
    const errs = {};
    const emailTrimmed = email.trim();

    if (!emailTrimmed) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setSubmitting(true);
    const result = await login(email, password, rememberMe);
    setSubmitting(false);

    if (result.success) {
      if (result.user.role === 'admin') {
        onNavigate('admin');
      } else {
        onNavigate('products');
      }
    } else {
      setServerError(result.message || 'Authentication failed. Please verify your credentials.');
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      return;
    }
    setForgotSubmitted(true);
  };

  return (
    <div className="page-container" style={{ maxWidth: '480px', paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div className="card" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Sign in to access your cart, order history, and account settings.
          </p>
        </div>

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
            gap: '0.5rem',
            fontSize: '0.9rem'
          }} id="login-server-error">
            <AlertCircle size={18} />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate id="login-form">
          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                id="login-email"
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
              />
            </div>
            {errors.email && (
              <div className="form-error" id="error-login-email">
                <AlertCircle size={14} />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label className="form-label" htmlFor="login-password" style={{ marginBottom: 0 }}>Password</label>
              <button
                type="button"
                onClick={() => { setForgotModalOpen(true); setForgotSubmitted(false); }}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.825rem', cursor: 'pointer', fontWeight: 600 }}
                id="link-forgot-password"
              >
                Forgot password?
              </button>
            </div>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                id="toggle-password-visibility"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <div className="form-error" id="error-login-password">
                <AlertCircle size={14} />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          {/* Remember Me */}
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label className="checkbox-label" htmlFor="remember-me-checkbox">
              <input
                id="remember-me-checkbox"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me for 30 days</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={submitting}
            id="login-submit-btn"
          >
            <LogIn size={18} />
            <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account yet?{' '}
          <button
            type="button"
            onClick={() => onNavigate('register')}
            style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer' }}
            id="link-to-register"
          >
            Create an account
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Your Password"
      >
        {forgotSubmitted ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'var(--color-success-bg)',
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <CheckCircle size={28} />
            </div>
            <h4 style={{ marginBottom: '0.5rem' }}>Instructions Sent</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              If an account matches <strong>{forgotEmail}</strong>, you will receive password reset instructions shortly.
            </p>
            <button 
              className="btn btn-primary btn-full"
              onClick={() => setForgotModalOpen(false)}
              id="close-forgot-modal"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Enter the email address registered with your account and we will send you a link to reset your credentials.
            </p>
            <div className="form-group">
              <label className="form-label" htmlFor="forgot-email">Account Email</label>
              <input
                id="forgot-email"
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setForgotModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                id="submit-forgot-btn"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
