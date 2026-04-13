import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './AdminLayout.module.css';

const NAV_ITEMS = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/properties', icon: '🏠', label: 'Properties' },
  { to: '/leads',      icon: '📋', label: 'Leads' },
  { to: '/visits',     icon: '📅', label: 'Site Visits' },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className={`${styles.layout} ${collapsed ? styles.collapsed : ''}`}>

      {/* ══════════ SIDEBAR ══════════ */}
      <aside className={styles.sidebar}>

        {/* Logo */}
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            {/* Real logo image in white circle */}
            <div className={styles.logoImgWrap}>
              <img
                src="/logo.png"
                alt="Bhagat Estates"
                className={styles.logoImg}
              />
            </div>
            {!collapsed && (
              <div className={styles.logoText}>
                <span className={styles.logoName}>Bhagat Estates</span>
                <span className={styles.logoSub}>Admin Panel</span>
              </div>
            )}
          </div>
          <button
            className={styles.collapseBtn}
            onClick={() => setCollapsed(!collapsed)}
            title="Toggle sidebar"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Nav */}
        <nav className={styles.nav}>
          {!collapsed && <div className={styles.navSectionLbl}>Main Menu</div>}
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
            </NavLink>
          ))}
          {!collapsed && <div className={styles.navSectionLbl} style={{ marginTop: 8 }}>Other</div>}
          <NavLink
            to="/settings"
            title="Settings"
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}
          >
            <span className={styles.navIcon}>⚙️</span>
            {!collapsed && <span className={styles.navLabel}>Settings</span>}
          </NavLink>
        </nav>

        {/* Add Property CTA */}
        {!collapsed && (
          <div className={styles.sidebarCta}>
            <button className={styles.addBtn} onClick={() => navigate('/properties/new')}>
              + Add Property
            </button>
          </div>
        )}

        {/* User Footer */}
        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAv}>{admin?.name?.charAt(0) || 'A'}</div>
            {!collapsed && (
              <div className={styles.userDetails}>
                <div className={styles.userNm}>{admin?.name}</div>
                <div className={styles.userRl}>{admin?.role}</div>
              </div>
            )}
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn} title="Logout">🚪</button>
        </div>
      </aside>

      {/* ══════════ MAIN ══════════ */}
      <div className={styles.main}>

        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            {/* Mini logo in topbar */}
            <div className={styles.topbarLogo}>
              <img src="/logo.png" alt="Bhagat Estates" className={styles.topbarLogoImg} />
            </div>
            <span className={styles.topbarTitle}>Bhagat Estates Admin</span>
          </div>
          <div className={styles.topbarRight}>
            <button className={styles.notifBtn} title="Notifications">
              🔔
              <div className={styles.notifDot}></div>
            </button>
            <a href="http://localhost:3000" target="_blank" rel="noreferrer" className={styles.viewSiteBtn}>
              🌐 View Website
            </a>
            <button className={styles.addPropBtn} onClick={() => navigate('/properties/new')}>
              + Add Property
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
