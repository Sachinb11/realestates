import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import styles from './AdminLayout.module.css';

const NAV_ITEMS = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/properties', icon: '🏠', label: 'Properties' },
  { to: '/leads',      icon: '📋', label: 'Leads', badge: true },
  { to: '/visits',     icon: '📅', label: 'Site Visits' },
];

function ThemeToggleBtn() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className={styles.themeBtn} onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
      {theme === 'light' ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      )}
    </button>
  );
}

function NotifBell() {
  const [open, setOpen] = useState(false);
  const items = [
    { icon: '📋', text: 'New lead received', time: 'Just now', dot: true },
    { icon: '📅', text: 'Site visit scheduled', time: '5m ago', dot: true },
    { icon: '🏠', text: 'Property view spike', time: '1h ago', dot: false },
  ];
  return (
    <div style={{ position: 'relative' }}>
      <button className={styles.notifBtn} onClick={() => setOpen(o => !o)} aria-label="Notifications">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <span className={styles.notifDot}></span>
      </button>
      {open && (
        <>
          <div className={styles.overlay} onClick={() => setOpen(false)} />
          <div className={styles.notifBox}>
            <div className={styles.notifHead}>
              <span>Notifications</span>
              <button onClick={() => setOpen(false)} className={styles.notifClose}>✕</button>
            </div>
            {items.map((n, i) => (
              <div key={i} className={styles.notifItem}>
                <span className={styles.notifIcon}>{n.icon}</span>
                <div style={{ flex: 1 }}>
                  <div className={styles.notifText}>{n.text}</div>
                  <div className={styles.notifTime}>{n.time}</div>
                </div>
                {n.dot && <span className={styles.unreadDot}></span>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className={`${styles.layout} ${collapsed ? styles.collapsed : ''}`}>

      {/* ══ SIDEBAR ══════════════════════════════════════ */}
      <aside className={styles.sidebar}>

        {/* Header */}
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>BE</div>
            {!collapsed && (
              <div>
                <div className={styles.logoName}>Bhagat Estates</div>
                <div className={styles.logoSub}>Admin Panel</div>
              </div>
            )}
          </div>
          <button className={styles.collapseBtn} onClick={() => setCollapsed(!collapsed)} title="Toggle sidebar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12">
              {collapsed ? <polyline points="9 18 15 12 9 6"/> : <polyline points="15 18 9 12 15 6"/>}
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className={styles.nav}>
          {NAV_ITEMS.map(item => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}
              title={collapsed ? item.label : undefined}>
              <span className={styles.navIcon}>{item.icon}</span>
              {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
              {!collapsed && item.badge && <span className={styles.navBadge}>New</span>}
            </NavLink>
          ))}
        </nav>

        {/* Add Property */}
        {!collapsed && (
          <div className={styles.sidebarCta}>
            <button className={styles.addBtn} onClick={() => navigate('/properties/new')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Property
            </button>
          </div>
        )}

        {/* User Footer */}
        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>{admin?.name?.charAt(0)?.toUpperCase() || 'A'}</div>
            {!collapsed && (
              <div style={{ overflow: 'hidden' }}>
                <div className={styles.userName}>{admin?.name || 'Admin'}</div>
                <div className={styles.userRole}>{admin?.role || 'superadmin'}</div>
              </div>
            )}
          </div>
          <button onClick={() => { logout(); navigate('/login'); }} className={styles.logoutBtn} title="Logout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* ══ MAIN ══════════════════════════════════════════ */}
      <div className={styles.main}>

        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topLeft}>
            <div className={styles.topbarTitle}>Bhagat Estates</div>
            <span className={styles.topbarSep}>/</span>
            <div className={styles.topbarSub}>Admin</div>
          </div>
          <div className={styles.topRight}>
            <a href={process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000'}
               target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              View Site
            </a>
            <ThemeToggleBtn />
            <NotifBell />
            <div className={styles.adminChip}>
              <div className={styles.adminAvatar}>{admin?.name?.charAt(0)?.toUpperCase() || 'A'}</div>
              <div className={styles.adminMeta}>
                <span className={styles.adminName}>{admin?.name || 'Admin'}</span>
                <span className={styles.adminRole}>{admin?.role}</span>
              </div>
              <span className={styles.onlineDot}></span>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className={styles.content}><Outlet /></main>
      </div>
    </div>
  );
}
