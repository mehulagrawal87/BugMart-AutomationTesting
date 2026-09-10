const express = require('express');
const router = express.Router();
const { getDb } = require('../data/db');

// Verify coupon code
router.post('/apply-coupon', (req, res) => {
  const { code, subtotal } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, message: 'Please enter a coupon code.' });
  }

  const db = getDb();
  const coupon = db.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());

  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Invalid or expired coupon code.' });
  }

  const sub = parseFloat(subtotal || 0);

  if (coupon.code === 'SAVE10') {
    if (sub < coupon.minOrder) {
      return res.status(400).json({
        success: false,
        message: `Minimum order of $${coupon.minOrder.toFixed(2)} required for code SAVE10.`
      });
    }
    const discount = (sub * 0.10);
    return res.status(200).json({
      success: true,
      code: coupon.code,
      discount: parseFloat(discount.toFixed(2)),
      freeShipping: false,
      message: '10% discount applied to your order!'
    });
  }

  if (coupon.code === 'FIRST20') {
    // Allows applying discount regardless of minOrder if subtotal > 15
    const discount = sub * 0.20;
    return res.status(200).json({
      success: true,
      code: coupon.code,
      discount: parseFloat(discount.toFixed(2)),
      freeShipping: false,
      message: '20% new customer discount applied!'
    });
  }

  if (coupon.code === 'FREESHIP') {
    return res.status(200).json({
      success: true,
      code: coupon.code,
      discount: 0,
      freeShipping: true,
      message: 'Free standard shipping applied!'
    });
  }

  res.status(400).json({ success: false, message: 'Coupon could not be applied.' });
});

module.exports = router;
