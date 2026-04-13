import Head from 'next/head';
import Navbar from '../src/components/common/Navbar';
import Footer from '../src/components/common/Footer';
import InquiryForm from '../src/components/property/InquiryForm';
import styles from '../src/styles/Contact.module.css';

const PHONE = '8975127927';
const WHATSAPP = '918975127927';
const EMAIL = 'contact.bhagatestates@gmail.com';
const ADDRESS = 'Bhagat Estates, Near Railway Station, Isckon Temple, Ambedkar Road, Palghar (E), Maharashtra - 401404';

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact Bhagat Estates | Palghar Real Estate</title>
        <meta name="description" content="Contact Bhagat Estates for buying, selling or renting properties in Palghar. Call us at 8975127927 or visit our office." />
      </Head>

      <Navbar />

      <div className="page-header" style={{marginTop:64}}>
        <div className="container">
          <h1>Contact Us</h1>
          <p>We're here to help you find your perfect property</p>
        </div>
      </div>

      <div className={`container section`}>
        <div className={styles.layout}>
          {/* Left: Info */}
          <div className={styles.infoCol}>
            <h2 className={styles.heading}>Get in Touch</h2>
            <p className={styles.subtext}>Our expert team is available Monday to Saturday, 9 AM to 7 PM. We'd love to hear from you!</p>

            <div className={styles.contactItems}>
              <a href={`tel:${PHONE}`} className={styles.contactItem}>
                <div className={styles.contactIcon} style={{background:'rgba(26,60,94,0.1)',color:'var(--primary)'}}>📞</div>
                <div>
                  <div className={styles.contactLabel}>Phone / Call Us</div>
                  <div className={styles.contactValue}>{PHONE}</div>
                </div>
              </a>

              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className={styles.contactItem}>
                <div className={styles.contactIcon} style={{background:'rgba(37,211,102,0.1)',color:'#25d366'}}>💬</div>
                <div>
                  <div className={styles.contactLabel}>WhatsApp</div>
                  <div className={styles.contactValue}>+91 {PHONE}</div>
                </div>
              </a>

              <a href={`mailto:${EMAIL}`} className={styles.contactItem}>
                <div className={styles.contactIcon} style={{background:'rgba(200,150,62,0.1)',color:'var(--accent)'}}>✉️</div>
                <div>
                  <div className={styles.contactLabel}>Email</div>
                  <div className={styles.contactValue}>{EMAIL}</div>
                </div>
              </a>

              <div className={styles.contactItem}>
                <div className={styles.contactIcon} style={{background:'rgba(200,62,62,0.1)',color:'var(--error)'}}>📍</div>
                <div>
                  <div className={styles.contactLabel}>Office Address</div>
                  <div className={styles.contactValue}>{ADDRESS}</div>
                </div>
              </div>

              <div className={styles.contactItem}>
                <div className={styles.contactIcon} style={{background:'rgba(56,161,105,0.1)',color:'var(--success)'}}>🕐</div>
                <div>
                  <div className={styles.contactLabel}>Office Hours</div>
                  <div className={styles.contactValue}>Mon – Sat: 9:00 AM – 7:00 PM</div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className={styles.mapWrap}>
              <iframe
                src="https://maps.google.com/maps?q=Palghar+Railway+Station+Maharashtra&z=14&output=embed"
                width="100%" height="280" frameBorder="0" allowFullScreen loading="lazy"
                title="Bhagat Estates Office Location"
                style={{borderRadius:'var(--radius-lg)'}}
              />
            </div>
          </div>

          {/* Right: Form */}
          <div className={styles.formCol}>
            <div className={styles.formCard}>
              <h3 className={styles.formTitle}>Send Us an Inquiry</h3>
              <p className={styles.formSubtext}>Fill in the form below and we'll get back to you within 2 hours.</p>
              <InquiryForm type="inquiry" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
