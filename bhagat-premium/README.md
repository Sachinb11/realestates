# 🏠 Bhagat Estates — Premium Real Estate Platform v4.0

## ✨ What's New in v4.0

### Dark / Light Mode
- Full dark mode across frontend AND admin panel
- Smooth transitions between themes
- Preference saved in localStorage
- Toggle button in navbar (sun/moon icon)

### Premium UI Upgrades
- Hero section with real estate background image + parallax zoom
- Premium property cards with image overlay on hover
- Gold accent bar on category/why-us cards on hover
- Testimonials slider with gold gradient header line
- Footer fully dark navy, always visible

### Admin Panel
- Dark mode toggle in topbar
- Gold gradient "Add Property" button
- Notification bell with dropdown
- Online status indicator
- Stat cards with glow effect

### Performance
- Removed heavy CustomCursor (caused cursor issues)
- Lazy loading on all property images
- Lightweight CSS-only animations
- Skeleton loading patterns

---

## 🚀 Setup

### 1. Backend
```bash
cd backend
npm install
# .env already configured with MongoDB Atlas
npm start
# ✅ Runs on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
# Copy .env.local.example → .env.local
cp .env.local.example .env.local
npm run dev
# ✅ Runs on http://localhost:3000
```

### 3. Admin
```bash
cd admin
npm install
# Copy .env.example → .env
cp .env.example .env
npm start
# ✅ Runs on http://localhost:3001
```

### 4. Add Logo
Place your logo at: `frontend/public/logo.png`

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary (Navy) | `#0F172A` |
| Accent (Gold) | `#D4AF37` |
| Background (Light) | `#F8FAFC` |
| Background (Dark) | `#0A0F1E` |
| Card (Light) | `#ffffff` |
| Card (Dark) | `#111827` |

---

## 📁 Key Files Changed

| File | Change |
|---|---|
| `frontend/src/styles/globals.css` | Full dark/light CSS variable system |
| `frontend/src/context/ThemeContext.js` | New — theme toggle provider |
| `frontend/pages/_app.js` | Wrapped in ThemeProvider, removed cursor |
| `frontend/src/components/common/Navbar.js` | Dark/light toggle button |
| `frontend/src/components/common/Navbar.module.css` | Full dark mode styling |
| `frontend/src/styles/Home.module.css` | Premium hero, cards, animations |
| `frontend/src/components/property/PropertyCard.module.css` | Premium hover effects |
| `frontend/src/components/common/Footer.js/.css` | Dark navy, gold accents |
| `admin/src/context/ThemeContext.js` | New — admin theme provider |
| `admin/src/App.js` | Wrapped in ThemeProvider |
| `admin/src/styles/globals.css` | Full dark/light admin system |
| `admin/src/components/AdminLayout.js` | Theme toggle, notif bell |
| `admin/src/components/AdminLayout.module.css` | Premium dark sidebar |
| `admin/src/pages/Dashboard.module.css` | Glow stat cards |
