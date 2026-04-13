require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Property = require('../models/Property');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bhagat_estates';

const sampleProperties = [
  {
    title: '2 BHK Premium Flat in Palghar East',
    description: 'Beautiful 2BHK flat with modern amenities near railway station. Well-ventilated rooms, modular kitchen, and 24/7 security. Perfect for families looking for a comfortable home in Palghar.',
    propertyType: 'flat',
    listingType: 'sale',
    status: 'ready-to-move',
    price: 4500000,
    bhk: '2BHK',
    area: { total: 850, carpet: 720, unit: 'sqft' },
    floor: { current: 3, total: 7 },
    facing: 'East',
    furnishing: 'Semi-Furnished',
    bathrooms: 2,
    balconies: 1,
    parking: 'Covered',
    location: {
      address: 'Near Isckon Temple, Ambedkar Road',
      locality: 'Palghar East',
      city: 'Palghar',
      state: 'Maharashtra',
      pincode: '401404',
      landmark: 'Near Railway Station',
      coordinates: { lat: 19.6967, lng: 72.7697 }
    },
    amenities: ['Security', 'Power Backup', 'Lift', 'Parking', 'CCTV', 'Water Supply 24/7'],
    isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800', isPrimary: true }]
  },
  {
    title: 'Residential Plot Near Highway, Palghar',
    description: 'Prime residential plot with clear title near Mumbai-Ahmedabad Highway. Excellent connectivity and investment opportunity. Gated community with all basic amenities.',
    propertyType: 'plot',
    listingType: 'sale',
    status: 'ready-to-move',
    price: 2800000,
    area: { total: 1500, unit: 'sqft' },
    location: {
      address: 'Highway Road, Palghar',
      locality: 'Palghar West',
      city: 'Palghar',
      state: 'Maharashtra',
      pincode: '401404',
      coordinates: { lat: 19.6950, lng: 72.7650 }
    },
    amenities: ['Security', 'Rain Water Harvesting', 'Highway Access'],
    isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', isPrimary: true }]
  },
  {
    title: '3 BHK Luxury Flat with Sea View',
    description: 'Spacious 3BHK luxury apartment with stunning sea view. Premium specifications with Italian marble flooring, modular kitchen, and smart home features.',
    propertyType: 'flat',
    listingType: 'sale',
    status: 'under-construction',
    price: 8500000,
    bhk: '3BHK',
    area: { total: 1350, carpet: 1100, unit: 'sqft' },
    floor: { current: 8, total: 12 },
    facing: 'West',
    furnishing: 'Unfurnished',
    bathrooms: 3,
    balconies: 2,
    parking: 'Covered',
    location: {
      address: 'Bordi Road, Palghar',
      locality: 'Bordi',
      city: 'Palghar',
      state: 'Maharashtra',
      pincode: '401401',
      coordinates: { lat: 19.7500, lng: 72.7100 }
    },
    amenities: ['Swimming Pool', 'Gym', 'Club House', 'Security', 'Power Backup', 'Lift', 'Garden', 'CCTV'],
    isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', isPrimary: true }]
  },
  {
    title: 'Commercial Shop in Palghar Market',
    description: 'Prime commercial space in busy Palghar market area. High footfall location ideal for retail, showroom, or office. Ground floor with ample parking space.',
    propertyType: 'commercial',
    listingType: 'sale',
    price: 6500000,
    area: { total: 450, unit: 'sqft' },
    facing: 'North',
    location: {
      address: 'Main Market Road, Palghar',
      locality: 'Palghar Market',
      city: 'Palghar',
      state: 'Maharashtra',
      pincode: '401404',
      landmark: 'Near Bus Stand'
    },
    amenities: ['Power Backup', 'Parking', 'CCTV', 'Market Nearby'],
    isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', isPrimary: true }]
  },
  {
    title: '1 BHK Flat for Rent in Palghar',
    description: 'Well-maintained 1BHK flat available for rent. Ideal for working professionals or small family. Near railway station and all amenities.',
    propertyType: 'rental',
    listingType: 'rent',
    status: 'ready-to-move',
    price: 9500,
    priceUnit: 'per-month',
    bhk: '1BHK',
    area: { total: 550, unit: 'sqft' },
    furnishing: 'Semi-Furnished',
    bathrooms: 1,
    location: {
      address: 'Station Road, Palghar',
      locality: 'Station Area',
      city: 'Palghar',
      state: 'Maharashtra',
      pincode: '401404',
      landmark: 'Near Railway Station'
    },
    amenities: ['Security', 'Water Supply 24/7', 'Railway Station Nearby'],
    isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', isPrimary: true }]
  },
  {
    title: 'Green Valley Builder Project - 2 & 3 BHK',
    description: 'Premium builder project with 2 and 3 BHK apartments. RERA registered project with top-class amenities. Surrounded by nature with modern urban conveniences.',
    propertyType: 'builder-project',
    listingType: 'sale',
    status: 'under-construction',
    price: 5200000,
    bhk: '2BHK',
    area: { total: 980, carpet: 820, unit: 'sqft' },
    location: {
      address: 'Sativali Road, Palghar',
      locality: 'Sativali',
      city: 'Palghar',
      state: 'Maharashtra',
      pincode: '401404'
    },
    builderProject: {
      name: 'Green Valley',
      builder: 'Shree Developers',
      reraNumber: 'P51700033456',
      launchDate: new Date('2024-01-01'),
      completionDate: new Date('2026-12-31'),
      totalUnits: 120,
      availableUnits: 45
    },
    amenities: ['Swimming Pool', 'Gym', 'Club House', 'Security', 'Power Backup', 'Garden', 'Children Play Area', 'Jogging Track'],
    isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800', isPrimary: true }]
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create admin
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL || 'admin@bhagatestates.com' });
    if (!existingAdmin) {
      await Admin.create({
        name: 'Bhagat Admin',
        email: process.env.ADMIN_EMAIL || 'admin@bhagatestates.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'superadmin'
      });
      console.log('✅ Admin created');
      console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@bhagatestates.com'}`);
      console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    } else {
      console.log('ℹ️  Admin already exists');
    }

    // Create sample properties
    const count = await Property.countDocuments();
    if (count === 0) {
      await Property.insertMany(sampleProperties);
      console.log(`✅ ${sampleProperties.length} sample properties created`);
    } else {
      console.log(`ℹ️  ${count} properties already exist, skipping seed`);
    }

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
