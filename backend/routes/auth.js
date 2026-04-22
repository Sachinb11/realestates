const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin || !await admin.comparePassword(password)) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!admin.isActive) {
      return res.status(403).json({ success: false, message: 'Account deactivated. Contact superadmin.' });
    }

    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    const token = signToken(admin._id);

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    admin: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role
    }
  });
});

// PUT /api/auth/change-password
router.put('/change-password', protect, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 })
], async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('+password');
    const { currentPassword, newPassword } = req.body;

    if (!await admin.comparePassword(currentPassword)) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// TEMP: Create Admin (DELETE later)
router.get('/create-admin', async (req, res) => {
  try {
    await Admin.deleteMany({ email: "admin@bhagatestates.com" });

    const admin = await Admin.create({
      name: "Sachin",
      email: "admin@bhagatestates.com",
      password: "Admin@123456"
    });

    res.json({ success: true, admin });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

module.exports = router;
