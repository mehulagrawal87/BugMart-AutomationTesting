const express = require('express');
const router = express.Router();
const { getDb, saveDb } = require('../data/db');

// List orders
router.get('/', (req, res) => {
  const { userId, role } = req.query;
  const db = getDb();
  let list = [...db.orders];

  if (role !== 'admin' && userId) {
    list = list.filter(o => o.userId === userId || o.userEmail === userId);
  }

  // Sort latest first
  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.status(200).json({
    success: true,
    orders: list
  });
});

// Single order details
router.get('/:id', (req, res) => {
  const db = getDb();
  const order = db.orders.find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  res.status(200).json({
    success: true,
    order
  });
});

// Create order
router.post('/', (req, res) => {
  const {
    userId,
    customerName,
    userEmail,
    items,
    shippingAddress,
    paymentMethod,
    couponCode,
    subtotal,
    discount,
    tax,
    shipping,
    total
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart items cannot be empty.' });
  }

  const db = getDb();
  const orderNum = Math.floor(10000 + Math.random() * 90000);
  const newOrder = {
    id: `ORD-${orderNum}`,
    userId: userId || 'guest',
    userEmail: userEmail || 'guest@example.com',
    customerName: customerName || 'Guest Shopper',
    items,
    subtotal: parseFloat(subtotal || 0),
    discount: parseFloat(discount || 0),
    couponCode: couponCode || '',
    tax: parseFloat(tax || 0),
    shipping: parseFloat(shipping || 0),
    total: parseFloat(total || 0),
    shippingAddress: shippingAddress || {},
    paymentMethod: paymentMethod || 'Credit Card',
    status: 'Processing',
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);
  saveDb(db);

  res.status(201).json({
    success: true,
    message: 'Order created successfully.',
    order_id: newOrder.id,
    order: newOrder
  });
});

// Update order status (Admin)
router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid order status value.' });
  }

  const db = getDb();
  const order = db.orders.find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  order.status = status;
  saveDb(db);

  res.status(200).json({
    success: true,
    message: `Order status updated to ${status}`,
    order
  });
});

module.exports = router;
