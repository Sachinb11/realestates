// routes/visits.js
const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { protect } = require('../middleware/auth');

router.get('/admin/all', protect, async (req, res) => {
  try {
    const visits = await Lead.find({ type: 'site-visit' })
      .populate('property', 'title slug')
      .sort({ visitDate: 1 });
    res.json({ success: true, data: visits });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
