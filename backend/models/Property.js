const mongoose = require('mongoose');
const slugify = require('slugify');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['flat', 'plot', 'commercial', 'rental', 'builder-project'],
  },
  listingType: {
    type: String,
    required: true,
    enum: ['sale', 'rent', 'lease'],
    default: 'sale'
  },
  status: {
    type: String,
    enum: ['ready-to-move', 'under-construction'],
    default: 'ready-to-move'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },

  // ─── Pricing ──────────────────────────────────────────────────────────────
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  priceUnit: {
    type: String,
    enum: ['total', 'per-sqft', 'per-month'],
    default: 'total'
  },
  priceNegotiable: {
    type: Boolean,
    default: false
  },

  // ─── Size ─────────────────────────────────────────────────────────────────
  area: {
    total: { type: Number },
    carpet: { type: Number },
    built: { type: Number },
    unit: { type: String, enum: ['sqft', 'sqmt', 'guntha', 'acre'], default: 'sqft' }
  },

  // ─── Configuration ────────────────────────────────────────────────────────
  bhk: {
    type: String,
    enum: ['1RK', '1BHK', '2BHK', '3BHK', '4BHK', '5BHK', 'Studio', 'N/A'],
    default: 'N/A'
  },
  floor: {
    current: { type: Number },
    total: { type: Number }
  },
  facing: {
    type: String,
    enum: ['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West', 'N/A'],
    default: 'N/A'
  },
  furnishing: {
    type: String,
    enum: ['Furnished', 'Semi-Furnished', 'Unfurnished', 'N/A'],
    default: 'N/A'
  },
  age: {
    type: String,
    enum: ['New Construction', 'Under 1 Year', '1-5 Years', '5-10 Years', '10+ Years', 'N/A'],
    default: 'N/A'
  },
  parking: {
    type: String,
    enum: ['Covered', 'Open', 'Both', 'None', 'N/A'],
    default: 'N/A'
  },
  bathrooms: { type: Number, default: 0 },
  balconies: { type: Number, default: 0 },

  // ─── Location ─────────────────────────────────────────────────────────────
  location: {
    address: { type: String, required: true },
    locality: { type: String, required: true },
    city: { type: String, default: 'Palghar' },
    state: { type: String, default: 'Maharashtra' },
    pincode: { type: String },
    landmark: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },

  // ─── Amenities ────────────────────────────────────────────────────────────
  amenities: [{
    type: String,
    enum: [
      'Swimming Pool', 'Gym', 'Club House', 'Security', 'Power Backup',
      'Lift', 'Garden', 'Children Play Area', 'Parking', 'Visitor Parking',
      'CCTV', 'Intercom', 'Rain Water Harvesting', 'Solar Energy',
      'Sewage Treatment', 'Fire Safety', 'Jogging Track', 'Badminton Court',
      'Tennis Court', 'Indoor Games', 'Multipurpose Hall', 'Temple',
      'School', 'Hospital Nearby', 'Market Nearby', 'Railway Station Nearby',
      'Bus Stop Nearby', 'Highway Access', 'Water Supply 24/7'
    ]
  }],

  // ─── Images ───────────────────────────────────────────────────────────────
  images: [{
    url: { type: String, required: true },
    filename: { type: String },
    isPrimary: { type: Boolean, default: false },
    caption: { type: String }
  }],

  // ─── Builder Project specific ─────────────────────────────────────────────
  builderProject: {
    name: { type: String },
    builder: { type: String },
    reraNumber: { type: String },
    launchDate: { type: Date },
    completionDate: { type: Date },
    totalUnits: { type: Number },
    availableUnits: { type: Number }
  },

  // ─── Contact ──────────────────────────────────────────────────────────────
  contactName: { type: String, default: 'Bhagat Estates' },
  contactPhone: { type: String, default: '8975127927' },
  contactWhatsapp: { type: String, default: '8975127927' },

  // ─── SEO ──────────────────────────────────────────────────────────────────
  metaTitle: { type: String },
  metaDescription: { type: String },

  // ─── Stats ────────────────────────────────────────────────────────────────
  views: { type: Number, default: 0 },
  inquiries: { type: Number, default: 0 },

}, { timestamps: true });

// ─── Pre-save: Generate Slug ──────────────────────────────────────────────────
propertySchema.pre('save', async function(next) {
  if (!this.isModified('title') && this.slug) return next();

  let baseSlug = slugify(this.title, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (await mongoose.model('Property').findOne({ slug, _id: { $ne: this._id } })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;

  // Auto-generate meta if not set
  if (!this.metaTitle) {
    this.metaTitle = `${this.title} | Bhagat Estates Palghar`;
  }
  if (!this.metaDescription) {
    this.metaDescription = this.description.substring(0, 160);
  }

  next();
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
propertySchema.index({ slug: 1 });
propertySchema.index({ propertyType: 1, isActive: 1 });
propertySchema.index({ 'location.locality': 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ isFeatured: -1, createdAt: -1 });
propertySchema.index({ title: 'text', description: 'text', 'location.locality': 'text' });

module.exports = mongoose.model('Property', propertySchema);
