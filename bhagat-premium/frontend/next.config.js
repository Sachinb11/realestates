/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost', port: '5000', pathname: '/uploads/**' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL:    process.env.NEXT_PUBLIC_API_URL    || 'http://localhost:5000/api',
    NEXT_PUBLIC_PHONE:      process.env.NEXT_PUBLIC_PHONE      || '8975127927',
    NEXT_PUBLIC_WHATSAPP:   process.env.NEXT_PUBLIC_WHATSAPP   || '918975127927',
    NEXT_PUBLIC_EMAIL:      process.env.NEXT_PUBLIC_EMAIL      || 'contact.bhagatestates@gmail.com',
  },
};
module.exports = nextConfig;
