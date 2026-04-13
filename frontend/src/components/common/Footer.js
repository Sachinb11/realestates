import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  const PHONE    = process.env.NEXT_PUBLIC_PHONE    || '8975127927';
  const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || '918975127927';
  const EMAIL    = process.env.NEXT_PUBLIC_EMAIL    || 'contact.bhagatestates@gmail.com';

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className="container">
          <div className={styles.grid}>

            {/* ── Brand Column ── */}
            <div className={styles.brand}>
              <div className={styles.logoRow}>
                {/* Real logo image */}
                <div className={styles.logoImgWrap}>
                  <Image
                    src="/logo.png"
                    alt="Bhagat Estates Logo"
                    width={60}
                    height={60}
                    style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                  />
                </div>
                <div>
                  <div className={styles.logoName}>Bhagat Estates</div>
                  <div className={styles.logoTagline}>Palghar&apos;s Trusted Realty</div>
                </div>
              </div>
              <p className={styles.brandDesc}>
                Your trusted real estate partner in Palghar for 15+ years. We help families find their perfect home with complete transparency and trust.
              </p>
              <div className={styles.socialRow}>
                <a href={`https://wa.me/${WHATSAPP}`} className={styles.socialBtn} style={{ background: '#25d366' }} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                  <svg viewBox="0 0 24 24" fill="white" width="17" height="17"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
                <a href={`mailto:${EMAIL}`} className={styles.socialBtn} style={{ background: '#D4AF37' }} aria-label="Email">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="17" height="17"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </a>
                <a href={`tel:${PHONE}`} className={styles.socialBtn} style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.15)' }} aria-label="Call">
                  <svg viewBox="0 0 24 24" fill="white" width="17" height="17"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
                </a>
              </div>
            </div>

            {/* ── Property Types ── */}
            <div>
              <h4 className={styles.colTitle}>Property Types</h4>
              <ul className={styles.linkList}>
                {[
                  { href: '/properties?propertyType=flat',            label: 'Flats & Apartments' },
                  { href: '/properties?propertyType=plot',            label: 'Plots & Land' },
                  { href: '/properties?propertyType=commercial',      label: 'Commercial Spaces' },
                  { href: '/properties?propertyType=rental',          label: 'Rental Properties' },
                  { href: '/properties?propertyType=builder-project', label: 'Builder Projects' },
                ].map(l => (
                  <li key={l.href}><Link href={l.href} className={styles.link}>{l.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* ── Quick Links ── */}
            <div>
              <h4 className={styles.colTitle}>Quick Links</h4>
              <ul className={styles.linkList}>
                {[
                  { href: '/',                                     label: 'Home' },
                  { href: '/properties',                           label: 'All Properties' },
                  { href: '/properties?status=ready-to-move',     label: 'Ready to Move' },
                  { href: '/properties?status=under-construction', label: 'Under Construction' },
                  { href: '/contact',                              label: 'Contact Us' },
                ].map(l => (
                  <li key={l.href}><Link href={l.href} className={styles.link}>{l.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* ── Contact ── */}
            <div>
              <h4 className={styles.colTitle}>Contact Us</h4>
              <ul className={styles.contactList}>
                <li>
                  <span className={styles.contactIcon}>📍</span>
                  <span>Near Railway Station, Isckon Temple, Ambedkar Road, Palghar (E), Maharashtra – 401404</span>
                </li>
                <li>
                  <span className={styles.contactIcon}>📞</span>
                  <a href={`tel:${PHONE}`} className={styles.contactLink}>{PHONE}</a>
                </li>
                <li>
                  <span className={styles.contactIcon}>✉️</span>
                  <a href={`mailto:${EMAIL}`} className={styles.contactLink}>{EMAIL}</a>
                </li>
                <li>
                  <span className={styles.contactIcon}>🕐</span>
                  <span>Mon – Sat: 9:00 AM – 7:00 PM</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p>© {new Date().getFullYear()} Bhagat Estates. All rights reserved.</p>
            <p>Designed with ❤️ for Palghar&apos;s Real Estate Market</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
