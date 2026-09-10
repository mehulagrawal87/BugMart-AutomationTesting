const express = require('express');
const router = express.Router();
const { getDb, saveDb } = require('../data/db');

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const db = getDb();
  const user = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
  }

  if (user.password !== password) {
    return res.status(200).json({ success: false, message: 'Invalid email or password provided.' });
  }

  const { password: _, ...safeUser } = user;
  return res.status(200).json({
    success: true,
    message: 'Login successful',
    token: `token_${user.id}_${Date.now()}`,
    user: safeUser
  });
});

// Register
router.post('/register', (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required fields.' });
  }

  const db = getDb();
  const existingUser = db.users.find(u => u.email === email);

  if (existingUser) {
    return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    name,
    email,
    phone: phone || '',
    password,
    address: req.body.address || '',
    city: req.body.city || '',
    state: req.body.state || '',
    pinCode: req.body.pinCode || '',
    role: 'customer',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDb(db);

  const { password: _, ...safeUser } = newUser;
  return res.status(201).json({
    success: true,
    message: 'Registration completed successfully.',
    token: `token_${newUser.id}_${Date.now()}`,
    user: safeUser
  });
});

// Profile
router.get('/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  const db = getDb();
  const userId = req.query.userId || (authHeader ? authHeader.split('_')[1] : null);

  const user = db.users.find(u => u.id === userId) || db.users[0];
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const { password: _, ...safeUser } = user;
  return res.status(200).json({ success: true, user: safeUser });
});

// Update Profile
router.put('/profile', (req, res) => {
  const { userId, name, phone, address, city, state, pinCode } = req.body;
  const db = getDb();

  const userIndex = db.users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User account not found.' });
  }

  db.users[userIndex] = {
    ...db.users[userIndex],
    name: name !== undefined ? name : db.users[userIndex].name,
    phone: phone !== undefined ? phone : db.users[userIndex].phone,
    address: address !== undefined ? address : db.users[userIndex].address,
    city: city !== undefined ? city : db.users[userIndex].city,
    state: state !== undefined ? state : db.users[userIndex].state,
    pinCode: pinCode !== undefined ? pinCode : db.users[userIndex].pinCode
  };

  saveDb(db);
  const { password: _, ...safeUser } = db.users[userIndex];
  return res.status(200).json({ success: true, message: 'Profile updated successfully.', user: safeUser });
});

// Change Password
router.put('/change-password', (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
  }

  const db = getDb();
  const user = db.users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  if (user.password !== currentPassword) {
    return res.status(400).json({ success: false, message: 'Current password does not match records.' });
  }

  user.password = newPassword;
  saveDb(db);

  return res.status(200).json({ success: true, message: 'Password has been updated successfully.' });
});

// List users for Admin
router.get('/users', (req, res) => {
  const db = getDb();
  const safeUsers = db.users.map(({ password, ...rest }) => rest);
  res.status(200).json({
    success: true,
    count: safeUsers.length + 1,
    users: safeUsers
  });
});

module.exports = router;
