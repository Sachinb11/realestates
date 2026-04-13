# Bhagat Estates — Full Project v3.0

## ✅ Fixes in This Version
- Navbar text now visible (white on dark hero, dark on scroll)
- Footer is fully dark navy (#080E1A) with gold accents — no transparency issue
- Logo image (/public/logo.png) loads properly with text fallback
- All CSS variables unified — no more broken styles
- CTA section has solid dark background
- Testimonials slider added
- Admin panel: notification bell, gold sidebar, improved stat cards, rich badges

## Setup Instructions

### 1. Backend (unchanged)
```bash
cd backend
npm install
# Set your .env (MONGO_URI, JWT_SECRET, PORT=5000)
npm start
```

### 2. Frontend
```bash
cd frontend
npm install
# Copy .env.local.example to .env.local and set:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
# NEXT_PUBLIC_PHONE=8975127927
# NEXT_PUBLIC_WHATSAPP=918975127927
# NEXT_PUBLIC_EMAIL=contact.bhagatestates@gmail.com
npm run dev     # runs on http://localhost:3000
```

### 3. Admin Panel
```bash
cd admin
npm install
# Copy .env.example to .env and set:
# REACT_APP_API_URL=http://localhost:5000/api
npm start       # runs on http://localhost:3001
```

### 4. Add Your Logo
Place your Bhagat Estates logo at:
```
frontend/public/logo.png
```
The logo will show in the Navbar and Footer automatically.

## Key Files Changed
| File | Change |
|------|--------|
| `frontend/src/styles/globals.css` | Unified CSS vars — fixes ALL broken styles |
| `frontend/src/components/common/Navbar.js/.css` | Logo image, visible on hero + scroll |
| `frontend/src/components/common/Footer.js/.css` | Dark navy, gold, no transparency |
| `frontend/pages/index.js` | Testimonials section added |
| `frontend/src/styles/Home.module.css` | Complete rewrite with correct vars |
| `admin/src/styles/globals.css` | Enhanced badges, tables, page headers |
| `admin/src/components/AdminLayout.js/.css` | Notification bell, gold sidebar |
| `admin/src/pages/Dashboard.module.css` | Glow stat cards, chart titles |
