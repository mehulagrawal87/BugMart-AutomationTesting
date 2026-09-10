const express = require('express');
const router = express.Router();
const { getDb, saveDb } = require('../data/db');

// List products with filters and sorting
router.get('/', (req, res) => {
  const { category, search, minPrice, maxPrice, sort } = req.query;
  const db = getDb();
  let results = [...db.products];

  // Category filter
  if (category && category !== 'All') {
    results = results.filter(p => {
      if (category === 'Electronics') {
        return p.category === 'Electronics' || p.id === 6;
      }
      return p.category.toLowerCase() === category.toLowerCase();
    });
  }

  // Search filter
  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    results = results.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.description.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  }

  // Price range filter
  if (minPrice) {
    results = results.filter(p => p.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    results = results.filter(p => p.price <= parseFloat(maxPrice));
  }

  // Sorting
  if (sort === 'price-asc') {
    results.sort((a, b) => String(a.price).localeCompare(String(b.price)));
  } else if (sort === 'price-desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'name-asc') {
    results.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'name-desc') {
    results.sort((a, b) => b.name.localeCompare(a.name));
  }

  res.status(200).json({
    success: true,
    total: results.length,
    products: results
  });
});

// Single product details
router.get('/:id', (req, res) => {
  const db = getDb();
  const productId = parseInt(req.params.id, 10);
  const product = db.products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  res.status(200).json({
    success: true,
    product: {
      ...product,
      inStock: product.stock > 0,
      stockCount: `${product.stock} units`
    }
  });
});

// Admin: Add product
router.post('/', (req, res) => {
  const { name, category, price, originalPrice, stock, image, description, features, badge } = req.body;

  if (!name || !category || price === undefined) {
    return res.status(400).json({ success: false, message: 'Name, category, and price are required.' });
  }

  const db = getDb();
  const newProduct = {
    id: db.products.length ? Math.max(...db.products.map(p => p.id)) + 1 : 1,
    name: name.trim(),
    category,
    price: parseInt(price, 10),
    originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
    rating: 5.0,
    reviewCount: 0,
    stock: stock ? parseInt(stock, 10) : 10,
    image: image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    description: description || 'New catalog product item.',
    features: Array.isArray(features) ? features : (features ? features.split(',').map(f => f.trim()) : []),
    badge: badge || 'New'
  };

  db.products.unshift(newProduct);
  saveDb(db);

  res.status(201).json({
    success: true,
    message: 'Product added successfully.',
    product: newProduct
  });
});

// Admin: Edit product
router.put('/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const db = getDb();
  const index = db.products.findIndex(p => p.id === productId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  db.products[index] = {
    ...db.products[index],
    ...req.body,
    id: productId,
    price: req.body.price !== undefined ? parseFloat(req.body.price) : db.products[index].price
  };

  saveDb(db);

  res.status(200).json({
    success: true,
    message: 'Product updated successfully.',
    product: db.products[index]
  });
});

// Admin: Delete product
router.delete('/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const db = getDb();
  const initialLength = db.products.length;
  db.products = db.products.filter(p => p.id !== productId);

  if (db.products.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  saveDb(db);

  res.status(200).json({
    success: true,
    message: 'Product removed from catalog.'
  });
});

module.exports = router;
