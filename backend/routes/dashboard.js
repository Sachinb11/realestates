const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const Lead = require('../models/Lead');
const { protect } = require('../middleware/auth');

// GET /api/dashboard/stats
router.get('/stats', protect, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalProperties,
      activeProperties,
      featuredProperties,
      totalLeads,
      newLeads,
      siteVisits,
      leadsThisMonth,
      leadsLastMonth,
      leadsByStatus,
      leadsByType,
      recentLeads,
      topProperties,
      propertiesByType
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ isActive: true }),
      Property.countDocuments({ isFeatured: true }),
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'new' }),
      Lead.countDocuments({ type: 'site-visit' }),
      Lead.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Lead.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]),
      Lead.find().sort({ createdAt: -1 }).limit(5).populate('property', 'title slug'),
      Property.find({ isActive: true }).sort({ inquiries: -1 }).limit(5).select('title slug inquiries views propertyType'),
      Property.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$propertyType', count: { $sum: 1 } } }
      ])
    ]);

    const leadGrowth = leadsLastMonth > 0
      ? Math.round(((leadsThisMonth - leadsLastMonth) / leadsLastMonth) * 100)
      : 100;

    res.json({
      success: true,
      data: {
        properties: {
          total: totalProperties,
          active: activeProperties,
          inactive: totalProperties - activeProperties,
          featured: featuredProperties,
          byType: propertiesByType
        },
        leads: {
          total: totalLeads,
          new: newLeads,
          siteVisits,
          thisMonth: leadsThisMonth,
          lastMonth: leadsLastMonth,
          growth: leadGrowth,
          byStatus: leadsByStatus,
          byType: leadsByType
        },
        recent: { leads: recentLeads },
        top: { properties: topProperties }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
