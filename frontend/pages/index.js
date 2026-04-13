import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../src/components/common/Navbar';
import Footer from '../src/components/common/Footer';
import PropertyCard from '../src/components/property/PropertyCard';
import SearchFilter from '../src/components/property/SearchFilter';
import { propertyAPI } from '../src/utils/api';
import styles from '../src/styles/Home.module.css';

const PHONE = process.env.NEXT_PUBLIC_PHONE || '8975127927';
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || '918975127927';

const CATEGORIES = [
  { type: 'flat',            label: 'Flats & Apartments', icon: '🏢', desc: 'Modern homes for every lifestyle',       color: '#1a3c5e' },
  { type: 'plot',            label: 'Plots & Land',        icon: '🌿', desc: 'Build your dream from ground up',       color: '#2d6a4f' },
  { type: 'commercial',      label: 'Commercial',          icon: '🏬', desc: 'Prime business spaces in Palghar',     color: '#7b2d8b' },
  { type: 'rental',          label: 'Rental',              icon: '🔑', desc: 'Flexible rentals for all needs',       color: '#c8963e' },
  { type: 'builder-project', label: 'Builder Projects',    icon: '🏗️', desc: 'Upcoming and ongoing projects',       color: '#c62828' },
];

const STATS = [
  { value: '500+',  label: 'Properties Listed' },
  { value: '1200+', label: 'Happy Families' },
  { value: '15+',   label: 'Years Experience' },
  { value: '50+',   label: 'Builder Tie-ups' },
];

const WHY_US = [
  { icon: '🏆', title: 'Trusted Brand',        desc: 'Over 15 years of real estate expertise in Palghar and nearby areas.' },
  { icon: '📍', title: 'Local Expertise',      desc: 'Deep knowledge of Palghar, Boisar, Dahanu, and surrounding localities.' },
  { icon: '💰', title: 'Best Deals',           desc: 'Exclusive listings and negotiated prices for maximum value.' },
  { icon: '📋', title: 'Legal Clarity',        desc: 'Clear title verification and documentation support for every property.' },
  { icon: '🤝', title: 'End-to-End Support',  desc: "From search to registration, we're with you at every step." },
  { icon: '⚡', title: 'Fast Closures',        desc: 'Streamlined process ensuring quick and smooth transactions.' },
];

const TESTIMONIALS = [
  { name: 'Rajesh Patil',   role: 'Homebuyer, Palghar',       rating: 5, initials: 'RP', color: '#1a3c5e', text: 'Bhagat Estates made our home buying journey absolutely smooth. Their team was knowledgeable, transparent, and always available. We got our dream flat in Palghar at a great price!' },
  { name: 'Sunita Sharma',  role: 'Plot Investor, Boisar',    rating: 5, initials: 'SS', color: '#2d6a4f', text: 'I invested in a plot through Bhagat Estates and the experience was outstanding. All documents were crystal clear. I would highly recommend them to anyone looking for property in this region.' },
  { name: 'Amit Desai',     role: 'Commercial Tenant',        rating: 5, initials: 'AD', color: '#7b2d8b', text: 'Found the perfect commercial space for my business within a week. The team understood exactly what I needed. Truly professional service — will use them again!' },
  { name: 'Priya Nair',     role: 'Rental Client, Dahanu',   rating: 5, initials: 'PN', color: '#c8963e', text: 'Moving from Mumbai to Palghar was made stress-free by Bhagat Estates. They helped us find a beautiful rental home that fits our budget perfectly.' },
  { name: 'Suresh Jadhav',  role: 'Builder Project Buyer',   rating: 5, initials: 'SJ', color: '#c62828', text: 'The team guided me through an under-construction flat purchase step by step. Their legal team ensured everything was in order. Highly trustworthy and professional.' },
];

function StarRating({ count }) {
  return (
    <div className={styles.stars}>
      {Array.from({ length: count }).map((_, i) => <span key={i}>★</span>)}
    </div>
  );
}

function TestimonialsSlider() {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const timer = useRef(null);

  const goTo = (idx) => {
    if (fading) return;
    setFading(true);
    setTimeout(() => { setActive(idx); setFading(false); }, 300);
  };

  const next = () => goTo((active + 1) % TESTIMONIALS.length);
  const prev = () => goTo((active - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  useEffect(() => {
    timer.current = setInterval(next, 5500);
    return () => clearInterval(timer.current);
  }, [active]);

  const t = TESTIMONIALS[active];

  return (
    <div className={styles.sliderWrap}>
      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="Previous">‹</button>

      <div className={`${styles.testimonialCard} ${fading ? styles.fade : ''}`}>
        <div className={styles.quoteIcon}>"</div>
        <p className={styles.testimonialText}>{t.text}</p>
        <StarRating count={t.rating} />
        <div className={styles.testimonialAuthor}>
          <div className={styles.avatar} style={{ background: t.color }}>{t.initials}</div>
          <div>
            <div className={styles.authorName}>{t.name}</div>
            <div className={styles.authorRole}>{t.role}</div>
          </div>
        </div>
      </div>

      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="Next">›</button>

      <div className={styles.dots}>
        {TESTIMONIALS.map((_, i) => (
          <button key={i} className={`${styles.dot} ${i === active ? styles.dotActive : ''}`} onClick={() => goTo(i)} />
        ))}
      </div>
    </div>
  );
}

export default function Home({ featured, localities }) {
  return (
    <>
      <Head>
        <title>Bhagat Estates – Palghar's #1 Real Estate Agency</title>
        <meta name="description" content="Find flats, plots, commercial properties and rental homes in Palghar, Maharashtra. Bhagat Estates — trusted real estate since 2009." />
        <meta name="keywords" content="real estate palghar, flats in palghar, plots in palghar, property palghar, bhagat estates" />
        <link rel="canonical" href="https://www.bhagatestates.com" />
      </Head>

      <Navbar />

      {/* ══ HERO ══════════════════════════════════════════════════════════════════ */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>🏆 Palghar's Most Trusted Real Estate</div>
          <h1 className={styles.heroTitle}>
            Find Your Perfect<br />
            <span className={styles.heroAccent}>Property in Palghar</span>
          </h1>
          <p className={styles.heroSub}>
            Explore 500+ verified properties — flats, plots, commercial spaces &amp; builder projects in Palghar, Maharashtra.
          </p>
          <div className={styles.heroSearch}>
            <SearchFilter localities={localities} compact />
          </div>
          <div className={styles.heroStats}>
            {STATS.map(s => (
              <div key={s.label} className={styles.statItem}>
                <span className={styles.statVal}>{s.value}</span>
                <span className={styles.statLbl}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.scrollHint}>
          <span>Scroll to explore</span>
          <div className={styles.scrollDot} />
        </div>
      </section>

      {/* ══ CATEGORIES ════════════════════════════════════════════════════════════ */}
      <section className={`section ${styles.categoriesSection}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className="section-tag">Browse</span>
            <h2 className="section-title">Property Categories</h2>
            <p className="section-subtitle">Find exactly the type of property you're looking for</p>
          </div>
          <div className={styles.catGrid}>
            {CATEGORIES.map(cat => (
              <Link key={cat.type} href={`/properties?propertyType=${cat.type}`} className={styles.catCard}>
                <div className={styles.catIcon} style={{ background: `${cat.color}18`, color: cat.color }}>
                  {cat.icon}
                </div>
                <h3 className={styles.catLabel}>{cat.label}</h3>
                <p className={styles.catDesc}>{cat.desc}</p>
                <span className={styles.catArrow} style={{ color: cat.color }}>Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURED PROPERTIES ═══════════════════════════════════════════════════ */}
      {featured?.length > 0 && (
        <section className={`section ${styles.featuredSection}`}>
          <div className="container">
            <div className={styles.sectionHeadRow}>
              <div>
                <span className="section-tag">★ Featured</span>
                <h2 className="section-title">Premium Properties</h2>
                <p className="section-subtitle">Handpicked properties with the best value and location</p>
              </div>
              <Link href="/properties?isFeatured=true" className="btn btn-outline">View All →</Link>
            </div>
            <div className="property-grid">
              {featured.map(p => <PropertyCard key={p._id} property={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ══ WHY US ════════════════════════════════════════════════════════════════ */}
      <section className={`section ${styles.whySection}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className="section-tag">Our Promise</span>
            <h2 className="section-title">Why Choose Bhagat Estates?</h2>
            <p className="section-subtitle">We bring 15+ years of local expertise to every transaction</p>
          </div>
          <div className={styles.whyGrid}>
            {WHY_US.map(w => (
              <div key={w.title} className={styles.whyCard}>
                <span className={styles.whyIcon}>{w.icon}</span>
                <h3 className={styles.whyTitle}>{w.title}</h3>
                <p className={styles.whyDesc}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══════════════════════════════════════════════════════════ */}
      <section className={`section ${styles.testimonialsSection}`}>
        <div className="container">
          <div className={styles.sectionHead} style={{ textAlign: 'center', alignItems: 'center' }}>
            <span className="section-tag">💬 Client Stories</span>
            <h2 className="section-title">What Our Clients Say</h2>
            <p className="section-subtitle">Real experiences from families who found their dream properties with us</p>
          </div>
          <TestimonialsSlider />
        </div>
      </section>

      {/* ══ CTA BANNER ════════════════════════════════════════════════════════════ */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBg} />
        <div className="container">
          <div className={styles.ctaInner}>
            <div className={styles.ctaLeft}>
              <h2 className={styles.ctaTitle}>Ready to Find Your Dream Property?</h2>
              <p className={styles.ctaSub}>Talk to our expert team today. We'll help you find the perfect match.</p>
              <p className={styles.ctaAddr}>📍 Near Railway Station, Isckon Temple, Ambedkar Road, Palghar (E) – 401404</p>
            </div>
            <div className={styles.ctaBtns}>
              <a href={`tel:${PHONE}`} className={`${styles.ctaBtn} ${styles.ctaBtnCall}`}>
                📞 Call: {PHONE}
              </a>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className={`${styles.ctaBtn} ${styles.ctaBtnWa}`}>
                💬 WhatsApp Us
              </a>
              <Link href="/contact" className={`${styles.ctaBtn} ${styles.ctaBtnOutline}`}>
                ✉️ Send Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  try {
    const [featuredRes, localitiesRes] = await Promise.allSettled([
      propertyAPI.getFeatured(),
      propertyAPI.getLocalities(),
    ]);
    return {
      props: {
        featured:   featuredRes.status   === 'fulfilled' ? featuredRes.value.data.data   : [],
        localities: localitiesRes.status === 'fulfilled' ? localitiesRes.value.data.data : [],
      },
    };
  } catch {
    return { props: { featured: [], localities: [] } };
  }
}
