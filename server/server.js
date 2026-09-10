const express = require('express');
const cors = require('cors');
const path = require('path');
const { resetDb } = require('./data/db');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

// Database reset endpoint (for QA testing reset)
app.post('/api/system/reset', (req, res) => {
  try {
    const data = resetDb();
    res.status(200).json({
      success: true,
      message: 'Store database has been successfully reset to initial test data state.',
      productCount: data.products.length,
      orderCount: data.orders.length,
      userCount: data.users.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to reset database.' });
  }
});

// Serve frontend build in production if available
const fs = require('fs');
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`BugMart API Server running on port ${PORT}`);
});
