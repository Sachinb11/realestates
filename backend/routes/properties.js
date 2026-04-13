const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const Property = require('../models/Property');
const Lead = require('../models/Lead');
const { protect } = require('../middleware/auth');

// ─── Helper: Build Filter Query ───────────────────────────────────────────────
const buildFilterQuery = (queryParams) => {
  const filter = { isActive: true };
  const {
    propertyType, listingType, status, bhk, minPrice, maxPrice,
    minArea, maxArea, locality, city, furnishing, facing, search,
    isFeatured
  } = queryParams;

  if (propertyType) filter.propertyType = propertyType;
  if (listingType) filter.listingType = listingType;
  if (status) filter.status = status;
  if (bhk) filter.bhk = { $in: bhk.split(',') };
  if (furnishing) filter.furnishing = furnishing;
  if (facing) filter.facing = facing;
  if (isFeatured === 'true') filter.isFeatured = true;

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (minArea || maxArea) {
    filter['area.total'] = {};
    if (minArea) filter['area.total'].$gte = Number(minArea);
    if (maxArea) filter['area.total'].$lte = Number(maxArea);
  }

  if (locality) filter['location.locality'] = new RegExp(locality, 'i');
  if (city) filter['location.city'] = new RegExp(city, 'i');

  if (search) {
    filter.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { 'location.locality': new RegExp(search, 'i') },
      { 'location.address': new RegExp(search, 'i') }
    ];
  }

  return filter;
};

// ─── GET /api/properties ──────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 12);
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'isFeatured';

    const sortOptions = {
      'newest': { createdAt: -1 },
      'oldest': { createdAt: 1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      'isFeatured': { isFeatured: -1, createdAt: -1 }
    };

    const filter = buildFilterQuery(req.query);
    const sort = sortOptions[sortBy] || sortOptions['isFeatured'];

    const [properties, total] = await Promise.all([
      Property.find(filter).sort(sort).skip(skip).limit(limit).select('-__v'),
      Property.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: properties,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: properties.length,
        totalRecords: total
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/properties/featured ─────────────────────────────────────────────
router.get('/featured', async (req, res) => {
  try {
    const properties = await Property.find({ isActive: true, isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .select('-__v');

    res.json({ success: true, data: properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/properties/localities ───────────────────────────────────────────
router.get('/localities', async (req, res) => {
  try {
    const localities = await Property.distinct('location.locality', { isActive: true });
    res.json({ success: true, data: localities.sort() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/properties/:slug (public) ───────────────────────────────────────
router.get('/:slug', async (req, res) => {
  try {
    const property = await Property.findOneAndUpdate(
      { slug: req.params.slug, isActive: true },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Get similar properties
    const similar = await Property.find({
      isActive: true,
      _id: { $ne: property._id },
      $or: [
        { propertyType: property.propertyType },
        { 'location.locality': property.location.locality }
      ]
    }).limit(4).select('title slug price area bhk images location propertyType');

    res.json({ success: true, data: property, similar });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Admin Routes (Protected) ──────────────────────────────────────────────────

// GET /api/properties/admin/all
router.get('/admin/all', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.propertyType) filter.propertyType = req.query.propertyType;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    const [properties, total] = await Promise.all([
      Property.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Property.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: properties,
      pagination: { current: page, total: Math.ceil(total / limit), totalRecords: total }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/properties/admin/create
router.post('/admin/create', protect, async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json({ success: true, data: property, message: 'Property created successfully' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Duplicate slug. Please change the title.' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/properties/admin/:id
router.put('/admin/:id', protect, async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, data: property, message: 'Property updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/properties/admin/:id
router.delete('/admin/:id', protect, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/properties/admin/:id/toggle
router.patch('/admin/:id/toggle', protect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    property.isActive = !property.isActive;
    await property.save();
    res.json({ success: true, data: property, message: `Property ${property.isActive ? 'activated' : 'deactivated'}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
