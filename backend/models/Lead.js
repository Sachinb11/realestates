const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  // ─── Contact Info ──────────────────────────────────────────────────────────
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian mobile number']
  },
  message: {
    type: String,
    maxlength: 1000
  },

  // ─── Lead Type ────────────────────────────────────────────────────────────
  type: {
    type: String,
    enum: ['inquiry', 'site-visit', 'callback', 'whatsapp'],
    default: 'inquiry'
  },

  // ─── Property Reference ────────────────────────────────────────────────────
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    default: null
  },
  propertyTitle: { type: String },

  // ─── Site Visit Details ────────────────────────────────────────────────────
  visitDate: { type: Date },
  visitTime: { type: String },
  visitStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },

  // ─── Lead Status ──────────────────────────────────────────────────────────
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'negotiation', 'closed', 'lost'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  notes: {
    type: String,
    maxlength: 2000
  },

  // ─── Source ───────────────────────────────────────────────────────────────
  source: {
    type: String,
    enum: ['website', 'whatsapp', 'phone', 'walk-in', 'referral', 'other'],
    default: 'website'
  },

  // ─── Tracking ─────────────────────────────────────────────────────────────
  ipAddress: { type: String },
  userAgent: { type: String },
  assignedTo: { type: String, default: 'Bhagat Estates Team' },
  lastContactedAt: { type: Date },

}, { timestamps: true });

leadSchema.index({ status: 1, createdAt: -1 });
leadSchema.index({ phone: 1 });
leadSchema.index({ type: 1 });

module.exports = mongoose.model('Lead', leadSchema);
