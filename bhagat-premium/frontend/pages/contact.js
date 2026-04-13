import Head from 'next/head';
import Navbar from '../src/components/common/Navbar';
import Footer from '../src/components/common/Footer';
import InquiryForm from '../src/components/property/InquiryForm';
import styles from '../src/styles/Contact.module.css';

const PHONE    = process.env.NEXT_PUBLIC_PHONE    || '8975127927';
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || '918975127927';
const EMAIL    = process.env.NEXT_PUBLIC_EMAIL    || 'contact.bhagatestates@gmail.com';
const ADDRESS  = 'Bhagat Estates, Near Railway Station, Isckon Temple, Ambedkar Road, Palghar (E), Maharashtra – 401404';

const CONTACT_ITEMS = [
  { href: `tel:${PHONE}`,                    icon: '📞', label: 'Phone / Call Us',  value: PHONE,  bg: 'rgba(15,23,42,0.08)',   color: 'var(--text-primary)' },
  { href: `https://wa.me/${WHATSAPP}`,       icon: '💬', label: 'WhatsApp',         value: '+91 ' + PHONE, bg: 'rgba(37,211,102,0.08)', color: '#16a34a', target: '_blank' },
  { href: `mailto:${EMAIL}`,                 icon: '✉️', label: 'Email',            value: EMAIL,  bg: 'rgba(212,175,55,0.08)', color: 'var(--accent)' },
  { href: null,                              icon: '📍', label: 'Office Address',   value: ADDRESS,bg: 'rgba(220,38,38,0.06)',  color: 'var(--error)' },
  { href: null,                              icon: '🕐', label: 'Working Hours',    value: 'Mon – Sat: 9:00 AM – 7:00 PM', bg: 'rgba(22,163,74,0.08)', color: 'var(--success)' },
];

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact Bhagat Estates | Palghar Real Estate</title>
        <meta name="description" content="Contact Bhagat Estates for buying, selling or renting properties in Palghar. Call us at 8975127927 or visit our office near Railway Station." />
      </Head>

      <Navbar />

      <div className="page-header" style={{marginTop:64}}>
        <div className="container">
          <h1>Contact Us</h1>
          <p>We&apos;re here to help you find your perfect property</p>
        </div>
      </div>

      <div className="container section">
        <div className={styles.layout}>

          {/* Left: Info */}
          <div className={styles.infoCol}>
            <h2 className={styles.heading}>Get in Touch</h2>
            <p className={styles.subtext}>
              Our expert team is available Monday to Saturday, 9 AM to 7 PM.
              Reach out via call, WhatsApp, or email — we respond within 2 hours.
            </p>

            <div className={styles.contactItems}>
              {CONTACT_ITEMS.map((item, i) => {
                const Inner = (
                  <>
                    <div className={styles.contactIcon} style={{background: item.bg, color: item.color}}>
                      {item.icon}
                    </div>
                    <div>
                      <div className={styles.contactLabel}>{item.label}</div>
                      <div className={styles.contactValue}>{item.value}</div>
                    </div>
                  </>
                );
                return item.href ? (
                  <a key={i} href={item.href} target={item.target} rel={item.target ? 'noreferrer' : undefined} className={styles.contactItem}>
                    {Inner}
                  </a>
                ) : (
                  <div key={i} className={styles.contactItem}>{Inner}</div>
                );
              })}
            </div>

            {/* Map */}
            <div className={styles.mapWrap}>
              <iframe
                src="https://maps.google.com/maps?q=Palghar+Railway+Station+Maharashtra&z=14&output=embed"
                width="100%" height="260" frameBorder="0" allowFullScreen loading="lazy"
                title="Bhagat Estates Office Location"
              />
            </div>
          </div>

          {/* Right: Form */}
          <div className={styles.formCol}>
            <div className={styles.formBox}>
              <h3 className={styles.formTitle}>Send Us an Inquiry</h3>
              <p className={styles.formSub}>
                Fill in the form below and we&apos;ll get back to you within 2 hours.
              </p>
              <InquiryForm type="inquiry" />

              <div className={styles.altContact}>
                <p>Prefer to reach us directly?</p>
                <div className={styles.altBtns}>
                  <a href={`tel:${PHONE}`} className="btn btn-primary btn-sm">📞 Call Now</a>
                  <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hi, I have a property inquiry.')}`}
                     target="_blank" rel="noreferrer" className="btn btn-whatsapp btn-sm">💬 WhatsApp</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
