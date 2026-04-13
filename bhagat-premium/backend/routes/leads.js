const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const Lead    = require('../models/Lead');
const Property = require('../models/Property');
const { protect } = require('../middleware/auth');

// ─── Public: Submit Inquiry ─────────────────────────────────────────────────
router.post('/inquiry', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit Indian mobile number'),
  body('email').optional().isEmail().normalizeEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const { name, email, phone, message, propertyId, propertyTitle, type = 'inquiry' } = req.body;
    const lead = await Lead.create({
      name, email, phone, message, type,
      property: propertyId || null,
      propertyTitle: propertyTitle || null,
      source: 'website',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    if (propertyId) await Property.findByIdAndUpdate(propertyId, { $inc: { inquiries: 1 } });
    res.status(201).json({ success: true, message: 'Thank you! Our team will contact you shortly.', data: { id: lead._id } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ─── Public: Book Site Visit ────────────────────────────────────────────────
router.post('/visit', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit mobile number'),
  body('visitDate').notEmpty().withMessage('Visit date is required'),
  body('visitTime').notEmpty().withMessage('Visit time is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const { name, email, phone, visitDate, visitTime, propertyId, propertyTitle, message } = req.body;
    const lead = await Lead.create({
      name, email, phone, message,
      type: 'site-visit',
      visitDate: new Date(visitDate),
      visitTime,
      property: propertyId || null,
      propertyTitle: propertyTitle || null,
      source: 'website',
      ipAddress: req.ip
    });
    res.status(201).json({ success: true, message: 'Site visit booked! We will confirm your appointment shortly.', data: { id: lead._id } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ─── Admin: Get All Leads ───────────────────────────────────────────────────
router.get('/admin/all', protect, async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip  = (page - 1) * limit;

    const filter = {};
    if (req.query.status)   filter.status = req.query.status;
    if (req.query.type)     filter.type   = req.query.type;
    if (req.query.priority) filter.priority = req.query.priority;

    // Date range filter
    if (req.query.dateFrom || req.query.dateTo) {
      filter.createdAt = {};
      if (req.query.dateFrom) filter.createdAt.$gte = new Date(req.query.dateFrom);
      if (req.query.dateTo) {
        const to = new Date(req.query.dateTo);
        to.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = to;
      }
    }

    // Search filter (name or phone)
    if (req.query.search) {
      const s = req.query.search.trim();
      filter.$or = [
        { name:  new RegExp(s, 'i') },
        { phone: new RegExp(s, 'i') },
        { email: new RegExp(s, 'i') },
        { propertyTitle: new RegExp(s, 'i') }
      ];
    }

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .populate('property', 'title slug')
        .sort({ createdAt: -1 })
        .skip(skip).limit(limit),
      Lead.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: leads,
      pagination: { current: page, total: Math.ceil(total / limit), totalRecords: total }
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ─── Admin: Update Lead ─────────────────────────────────────────────────────
router.put('/admin/:id', protect, async (req, res) => {
  try {
    const { status, priority, notes, visitStatus, assignedTo } = req.body;
    const update = {};
    if (status)           update.status      = status;
    if (priority)         update.priority    = priority;
    if (notes !== undefined) update.notes    = notes;
    if (visitStatus)      update.visitStatus = visitStatus;
    if (assignedTo)       update.assignedTo  = assignedTo;
    if (status === 'contacted') update.lastContactedAt = new Date();

    const lead = await Lead.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, data: lead, message: 'Lead updated' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ─── Admin: Delete Lead ─────────────────────────────────────────────────────
router.delete('/admin/:id', protect, async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Lead deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
