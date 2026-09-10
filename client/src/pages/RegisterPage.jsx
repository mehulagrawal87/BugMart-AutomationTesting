import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage({ onNavigate }) {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: '#cbd5e1' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: '#ef4444' };
    if (score <= 4) return { score: 2, label: 'Medium', color: '#f59e0b' };
    return { score: 3, label: 'Strong', color: '#10b981' };
  };

  const strength = calculatePasswordStrength(formData.password);

  const validate = () => {
    const errs = {};

    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email format';
    }

    if (formData.phone && formData.phone.length > 0) {
      // Regex validation for phone
      if (!/^[0-9+\s()-]+$/.test(formData.phone)) {
        errs.phone = 'Phone number can only contain digits and phone symbols';
      }
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }

    // Confirmation check
    if (formData.confirmPassword) {
      if (!formData.password.startsWith(formData.confirmPassword)) {
        errs.confirmPassword = 'Passwords do not match';
      }
    } else {
      errs.confirmPassword = 'Please confirm your password';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setSubmitting(true);
    const result = await register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password
    });
    setSubmitting(false);

    if (result.success) {
      onNavigate('products');
    } else {
      setServerError(result.message || 'Registration failed.');
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '520px', paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      <div className="card" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Register to explore products, place test orders, and test store workflows.
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
          }} id="register-server-error">
            <AlertCircle size={18} />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate id="register-form">
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">Full Name *</label>
            <div className="input-with-icon">
              <User className="input-icon" size={18} />
              <input
                id="register-name"
                name="name"
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="e.g. Jane Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            {errors.name && (
              <div className="form-error" id="error-register-name">
                <AlertCircle size={14} />
                <span>{errors.name}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-email">Email Address *</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                id="register-email"
                name="email"
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && (
              <div className="form-error" id="error-register-email">
                <AlertCircle size={14} />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-phone">Phone Number</label>
            <div className="input-with-icon">
              <Phone className="input-icon" size={18} />
              <input
                id="register-phone"
                name="phone"
                type="tel"
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                placeholder="+1 (555) 000-1234"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            {errors.phone && (
              <div className="form-error" id="error-register-phone">
                <AlertCircle size={14} />
                <span>{errors.phone}</span>
              </div>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-password">Password *</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                id="register-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                id="toggle-register-password"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password strength indicator */}
            {formData.password && (
              <div style={{ marginTop: '0.4rem' }}>
                <div style={{ display: 'flex', gap: '4px', height: '4px', marginBottom: '0.3rem' }}>
                  <div style={{ flex: 1, borderRadius: '2px', background: strength.score >= 1 ? strength.color : '#e2e8f0' }} />
                  <div style={{ flex: 1, borderRadius: '2px', background: strength.score >= 2 ? strength.color : '#e2e8f0' }} />
                  <div style={{ flex: 1, borderRadius: '2px', background: strength.score >= 3 ? strength.color : '#e2e8f0' }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: strength.color, fontWeight: 600 }}>
                  Strength: {strength.label}
                </div>
              </div>
            )}

            {errors.password && (
              <div className="form-error" id="error-register-password">
                <AlertCircle size={14} />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-confirm-password">Confirm Password *</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                id="register-confirm-password"
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Re-type your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirm(!showConfirm)}
                id="toggle-register-confirm"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="form-error" id="error-register-confirm">
                <AlertCircle size={14} />
                <span>{errors.confirmPassword}</span>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={submitting}
            id="register-submit-btn"
          >
            <UserPlus size={18} />
            <span>{submitting ? 'Creating Account...' : 'Register'}</span>
          </button>
        </form>

        <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer' }}
            id="link-to-login"
          >
            Sign In here
          </button>
        </div>
      </div>
    </div>
  );
}
