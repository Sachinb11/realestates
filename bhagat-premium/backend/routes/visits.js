const express  = require('express');
const router   = express.Router();
const Lead     = require('../models/Lead');
const { protect } = require('../middleware/auth');

router.get('/admin/all', protect, async (req, res) => {
  try {
    const filter = { type: 'site-visit' };
    if (req.query.visitStatus) filter.visitStatus = req.query.visitStatus;
    const visits = await Lead.find(filter)
      .populate('property', 'title slug')
      .sort({ visitDate: 1 });
    res.json({ success: true, data: visits });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/admin/:id/status', protect, async (req, res) => {
  try {
    const { visitStatus } = req.body;
    const visit = await Lead.findByIdAndUpdate(req.params.id, { visitStatus }, { new: true });
    if (!visit) return res.status(404).json({ success: false, message: 'Visit not found' });
    res.json({ success: true, data: visit });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
