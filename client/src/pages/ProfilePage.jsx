import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Lock, Save, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage({ onNavigate }) {
  const { user, updateProfile, changePassword, logout } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pinCode: user?.pinCode || ''
  });

  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pinCode: user.pinCode || ''
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="page-container" style={{ maxWidth: '500px', textAlign: 'center', padding: '5rem 1rem' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <h2>Sign In Required</h2>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0 1.5rem' }}>
            Please sign in to view and edit your profile information.
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('login')}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    setIsSaving(true);

    const res = await updateProfile(profileForm);
    setIsSaving(false);

    if (res.success) {
      setProfileSuccess('Profile details saved successfully.');
      setTimeout(() => setProfileSuccess(''), 3000);
    } else {
      setProfileError(res.message || 'Failed to update profile.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassSuccess('');
    setPassError('');

    if (!passForm.currentPassword) {
      setPassError('Please enter your current password.');
      return;
    }
    if (!passForm.newPassword) {
      setPassError('Please enter a new password.');
      return;
    }
    if (passForm.newPassword.length < 6) {
      setPassError('New password must be at least 6 characters.');
      return;
    }
    if (passForm.newPassword !== passForm.confirmNewPassword) {
      setPassError('New passwords do not match.');
      return;
    }

    const res = await changePassword(passForm.currentPassword, passForm.newPassword);
    if (res.success) {
      setPassSuccess('Password has been changed successfully.');
      setPassForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setTimeout(() => setPassSuccess(''), 3000);
    } else {
      setPassError(res.message || 'Failed to update password.');
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '880px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Account Profile</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Manage your personal contact details, saved delivery address, and security credentials.
          </p>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => { logout(); onNavigate('login'); }}
          id="profile-logout-btn"
          style={{ color: 'var(--color-danger)' }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Personal & Shipping Details Form */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} color="var(--color-primary)" /> Personal Information
          </h3>

          {profileSuccess && (
            <div style={{ background: 'var(--color-success-bg)', border: '1px solid #bbf7d0', color: 'var(--color-success)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} /> <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div style={{ background: 'var(--color-danger-bg)', border: '1px solid #fecaca', color: 'var(--color-danger)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertCircle size={16} /> <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} id="profile-details-form">
            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">Full Name</label>
              <input
                id="profile-name"
                type="text"
                className="form-control"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-email">Email Address</label>
              <input
                id="profile-email"
                type="email"
                className="form-control"
                value={user.email}
                disabled
                style={{ background: 'var(--bg-alt)', cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-phone">Phone Number</label>
              <input
                id="profile-phone"
                type="tel"
                className="form-control"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-address">Delivery Address</label>
              <input
                id="profile-address"
                type="text"
                className="form-control"
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="profile-city">City</label>
                <input
                  id="profile-city"
                  type="text"
                  className="form-control"
                  value={profileForm.city}
                  onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-state">State</label>
                <input
                  id="profile-state"
                  type="text"
                  className="form-control"
                  value={profileForm.state}
                  onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-pincode">PIN / Postal Code</label>
              <input
                id="profile-pincode"
                type="text"
                className="form-control"
                value={profileForm.pinCode}
                onChange={(e) => setProfileForm({ ...profileForm, pinCode: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={isSaving}
              id="save-profile-btn"
            >
              <Save size={16} />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile Details'}</span>
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={18} color="var(--color-primary)" /> Security & Password
          </h3>

          {passSuccess && (
            <div style={{ background: 'var(--color-success-bg)', border: '1px solid #bbf7d0', color: 'var(--color-success)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} /> <span>{passSuccess}</span>
            </div>
          )}

          {passError && (
            <div style={{ background: 'var(--color-danger-bg)', border: '1px solid #fecaca', color: 'var(--color-danger)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertCircle size={16} /> <span>{passError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} id="change-password-form">
            <div className="form-group">
              <label className="form-label" htmlFor="pass-current">Current Password</label>
              <input
                id="pass-current"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={passForm.currentPassword}
                onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pass-new">New Password</label>
              <input
                id="pass-new"
                type="password"
                className="form-control"
                placeholder="At least 6 characters"
                value={passForm.newPassword}
                onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pass-confirm">Confirm New Password</label>
              <input
                id="pass-confirm"
                type="password"
                className="form-control"
                placeholder="Re-type new password"
                value={passForm.confirmNewPassword}
                onChange={(e) => setPassForm({ ...passForm, confirmNewPassword: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="btn btn-secondary btn-full"
              id="change-password-btn"
            >
              Update Password
            </button>
          </form>

          {/* Account Overview Box */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div><strong>Role:</strong> <span style={{ textTransform: 'capitalize' }}>{user.role}</span></div>
            <div><strong>User ID:</strong> <code>{user.id}</code></div>
          </div>
        </div>
      </div>
    </div>
  );
}
