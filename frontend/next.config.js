/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'images.unsplash.com', 'bhagatestates.com'],
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost', port: '5000', pathname: '/uploads/**' },
      { protocol: 'https', hostname: '**.unsplash.com' }
    ]
  },
  env: {
    NEXT_PUBLIC_API_URL:     process.env.NEXT_PUBLIC_API_URL     || 'http://localhost:5000/api',
    NEXT_PUBLIC_SITE_URL:    process.env.NEXT_PUBLIC_SITE_URL    || 'http://localhost:3000',
    NEXT_PUBLIC_PHONE:       '8975127927',
    NEXT_PUBLIC_WHATSAPP:    '918975127927',
    NEXT_PUBLIC_EMAIL:       'contact.bhagatestates@gmail.com',
    NEXT_PUBLIC_GOOGLE_MAPS_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
  }
};
module.exports = nextConfig;
