import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTheme } from '../../context/ThemeContext';
import styles from './Navbar.module.css';

const PHONE    = process.env.NEXT_PUBLIC_PHONE    || '8975127927';
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || '918975127927';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className={styles.themeToggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={theme === 'light' ? 'Dark mode' : 'Light mode'}
    >
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

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [logoError, setLogoError] = useState(false);
  const router = useRouter();
  const isHome = router.pathname === '/';

  useEffect(() => {
    if (!isHome) { setScrolled(true); return; }
    const check = () => setScrolled(window.scrollY > 60);
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, [isHome]);

  useEffect(() => { setMenuOpen(false); }, [router.pathname]);

  const navLinks = [
    { href: '/',                                        label: 'Home' },
    { href: '/properties',                              label: 'Properties' },
    { href: '/properties?propertyType=flat',            label: 'Flats' },
    { href: '/properties?propertyType=plot',            label: 'Plots' },
    { href: '/properties?propertyType=commercial',      label: 'Commercial' },
    { href: '/properties?propertyType=builder-project', label: 'Projects' },
    { href: '/contact',                                 label: 'Contact' },
  ];

  // Smart active detection
  const isActive = (href) => {
    const path = href.split('?')[0];
    const hrefQuery = href.includes('?') ? href.split('?')[1] : '';

    if (href === '/') return router.pathname === '/';
    if (hrefQuery) {
      // For links with query params (Flats, Plots, etc.), match both path and query
      return router.pathname === path && router.asPath.includes(hrefQuery);
    }
    // For /properties (no query), only active if on /properties with no propertyType filter
    if (href === '/properties') {
      return router.pathname === '/properties' && !router.query.propertyType;
    }
    return router.pathname.startsWith(path);
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : styles.transparent}`}>
      <div className={`container ${styles.inner}`}>

        {/* Logo */}
        <Link href="/" className={styles.logo}>
          {!logoError ? (
            <div className={styles.logoImgWrap}>
              <Image
                src="/logo.png" alt="Bhagat Estates" width={44} height={44}
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                priority onError={() => setLogoError(true)}
              />
            </div>
          ) : (
            <div className={styles.logoFallback}>BE</div>
          )}
          <div className={styles.logoText}>
            <span className={styles.logoMain}>Bhagat Estates</span>
            <span className={styles.logoSub}>Palghar&apos;s Trusted Realty</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className={styles.navLinks}>
          {navLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.navLink} ${isActive(link.href) ? styles.active : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className={styles.actions}>
          <ThemeToggle />
          <a href={`tel:${PHONE}`} className={`${styles.ctaBtn} ${styles.callBtn}`}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
            </svg>
            <span>{PHONE}</span>
          </a>
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className={`${styles.ctaBtn} ${styles.waBtn}`}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Hamburger */}
        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={`${styles.bar} ${menuOpen ? styles.bar1Open : ''}`}></span>
          <span className={`${styles.bar} ${menuOpen ? styles.bar2Open : ''}`}></span>
          <span className={`${styles.bar} ${menuOpen ? styles.bar3Open : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileTop}>
          {navLinks.map(link => (
            <Link
              key={link.href} href={link.href}
              className={`${styles.mobileLink} ${isActive(link.href) ? styles.mobileLinkActive : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className={styles.mobileCta}>
          <a href={`tel:${PHONE}`} className="btn btn-call btn-sm">📞 Call Now</a>
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="btn btn-whatsapp btn-sm">💬 WhatsApp</a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
