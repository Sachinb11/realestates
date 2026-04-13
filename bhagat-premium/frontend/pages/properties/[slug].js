import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../src/components/common/Navbar';
import Footer from '../../src/components/common/Footer';
import PropertyCard from '../../src/components/property/PropertyCard';
import InquiryForm from '../../src/components/property/InquiryForm';
import { propertyAPI, formatPrice } from '../../src/utils/api';
import styles from '../../src/styles/PropertyDetail.module.css';

const PHONE = '8975127927';
const WHATSAPP = '918975127927';

export default function PropertyDetailPage({ property, similar }) {
  const [activeTab, setActiveTab] = useState('inquiry');
  const [activeImage, setActiveImage] = useState(0);

  if (!property) return (
    <><Navbar /><div style={{minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div className="no-results"><h3>Property Not Found</h3><Link href="/properties" className="btn btn-primary" style={{marginTop:20}}>Browse Properties</Link></div>
    </div><Footer /></>
  );

  const {
    title, description, propertyType, listingType, status, price, priceUnit,
    bhk, area, floor, facing, furnishing, bathrooms, balconies, parking,
    age, location, amenities, images, isFeatured, builderProject,
    contactPhone, contactWhatsapp, slug, metaTitle, metaDescription
  } = property;

  const allImages = images?.length > 0 ? images : [];
  const primaryImg = allImages.find(i => i.isPrimary) || allImages[0];
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';

  const imgUrl = (img) => img?.url?.startsWith('http') ? img.url : `${apiBase}${img?.url}`;

  const specItems = [
    { label: 'Type', value: propertyType?.replace('-', ' ')?.toUpperCase() },
    bhk !== 'N/A' && { label: 'BHK', value: bhk },
    area?.total && { label: 'Total Area', value: `${area.total} ${area.unit || 'sqft'}` },
    area?.carpet && { label: 'Carpet Area', value: `${area.carpet} ${area.unit || 'sqft'}` },
    floor?.current && { label: 'Floor', value: `${floor.current} / ${floor.total}` },
    facing !== 'N/A' && { label: 'Facing', value: facing },
    furnishing !== 'N/A' && { label: 'Furnishing', value: furnishing },
    bathrooms && { label: 'Bathrooms', value: bathrooms },
    balconies && { label: 'Balconies', value: balconies },
    parking !== 'N/A' && { label: 'Parking', value: parking },
    age !== 'N/A' && { label: 'Age', value: age },
    status && { label: 'Status', value: status.replace('-', ' ').toUpperCase() },
  ].filter(Boolean);

  return (
    <>
      <Head>
        <title>{metaTitle || `${title} | Bhagat Estates`}</title>
        <meta name="description" content={metaDescription || description?.substring(0, 160)} />
        <link rel="canonical" href={`https://www.bhagatestates.com/properties/${slug}`} />
      </Head>

      <Navbar />

      <div style={{ height: 80 }}></div>

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className="container">
          <Link href="/">Home</Link> &rsaquo;
          <Link href="/properties"> Properties</Link> &rsaquo;
          <Link href={`/properties?propertyType=${propertyType}`}> {propertyType}</Link> &rsaquo;
          <span> {title}</span>
        </div>
      </div>

      <div className={`container ${styles.layout}`}>
        {/* Left: Images + Details */}
        <div className={styles.leftCol}>
          {/* Image Gallery */}
          <div className={styles.gallery}>
            <div className={styles.mainImage}>
              {allImages.length > 0 ? (
                <img src={imgUrl(allImages[activeImage])} alt={title} className={styles.mainImg} />
              ) : (
                <div className={styles.noImage}>📷 No photos available</div>
              )}
              {isFeatured && <span className={styles.featuredTag}>★ Featured</span>}
              <span className={styles.imageCount}>{allImages.length} Photos</span>
            </div>
            {allImages.length > 1 && (
              <div className={styles.thumbnails}>
                {allImages.map((img, i) => (
                  <button key={i} className={`${styles.thumb} ${activeImage === i ? styles.thumbActive : ''}`}
                    onClick={() => setActiveImage(i)}>
                    <img src={imgUrl(img)} alt={`${title} ${i+1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title + Price Bar */}
          <div className={styles.titleBar}>
            <div>
              <div className={styles.typePill}>{propertyType?.replace('-', ' ')}</div>
              <h1 className={styles.propTitle}>{title}</h1>
              <p className={styles.propLocation}>
                📍 {location?.address}, {location?.locality}, {location?.city} – {location?.pincode}
              </p>
            </div>
            <div className={styles.priceBlock}>
              <div className={styles.priceMain}>{formatPrice(price, priceUnit)}</div>
              {area?.total && priceUnit === 'total' && (
                <div className={styles.priceSub}>₹{Math.round(price / area.total).toLocaleString()} / sqft</div>
              )}
              <div className={styles.listingBadge}>{listingType?.toUpperCase()}</div>
            </div>
          </div>

          {/* Specs */}
          <div className={styles.specsSection}>
            <h2 className={styles.sectionHeading}>Property Details</h2>
            <div className={styles.specsGrid}>
              {specItems.map(s => (
                <div key={s.label} className={styles.specItem}>
                  <span className={styles.specLabel}>{s.label}</span>
                  <span className={styles.specValue}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className={styles.descSection}>
            <h2 className={styles.sectionHeading}>About this Property</h2>
            <p className={styles.description}>{description}</p>
          </div>

          {/* Amenities */}
          {amenities?.length > 0 && (
            <div className={styles.amenitiesSection}>
              <h2 className={styles.sectionHeading}>Amenities</h2>
              <div className={styles.amenitiesGrid}>
                {amenities.map(a => (
                  <div key={a} className={styles.amenityItem}>
                    <span className={styles.amenityCheck}>✓</span> {a}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Builder Project Details */}
          {propertyType === 'builder-project' && builderProject?.name && (
            <div className={styles.builderSection}>
              <h2 className={styles.sectionHeading}>Builder Project Details</h2>
              <div className={styles.specsGrid}>
                {builderProject.name && <div className={styles.specItem}><span className={styles.specLabel}>Project Name</span><span className={styles.specValue}>{builderProject.name}</span></div>}
                {builderProject.builder && <div className={styles.specItem}><span className={styles.specLabel}>Builder</span><span className={styles.specValue}>{builderProject.builder}</span></div>}
                {builderProject.reraNumber && <div className={styles.specItem}><span className={styles.specLabel}>RERA No.</span><span className={styles.specValue}>{builderProject.reraNumber}</span></div>}
                {builderProject.totalUnits && <div className={styles.specItem}><span className={styles.specLabel}>Total Units</span><span className={styles.specValue}>{builderProject.totalUnits}</span></div>}
                {builderProject.availableUnits && <div className={styles.specItem}><span className={styles.specLabel}>Available</span><span className={styles.specValue}>{builderProject.availableUnits}</span></div>}
              </div>
            </div>
          )}

          {/* Map */}
          {location?.coordinates?.lat && (
            <div className={styles.mapSection}>
              <h2 className={styles.sectionHeading}>Location on Map</h2>
              <div className={styles.mapEmbed}>
                <iframe
                  src={`https://maps.google.com/maps?q=${location.coordinates.lat},${location.coordinates.lng}&z=15&output=embed`}
                  width="100%" height="350" frameBorder="0" allowFullScreen loading="lazy"
                  title="Property Location"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Contact Sidebar */}
        <aside className={styles.contactSidebar}>
          {/* Quick CTA */}
          <div className={styles.quickCta}>
            <a href={`tel:${contactPhone || PHONE}`} className={`btn btn-call ${styles.ctaFullBtn}`}>
              📞 Call: {contactPhone || PHONE}
            </a>
            <a href={`https://wa.me/${contactWhatsapp ? `91${contactWhatsapp}` : WHATSAPP}?text=Hi, I'm interested in: ${title}`}
              target="_blank" rel="noreferrer" className={`btn btn-whatsapp ${styles.ctaFullBtn}`}>
              💬 WhatsApp Now
            </a>
          </div>

          {/* Inquiry / Visit Tabs */}
          <div className={styles.formCard}>
            <div className={styles.formTabs}>
              <button className={`${styles.tab} ${activeTab === 'inquiry' ? styles.tabActive : ''}`} onClick={() => setActiveTab('inquiry')}>
                📩 Inquiry
              </button>
              <button className={`${styles.tab} ${activeTab === 'visit' ? styles.tabActive : ''}`} onClick={() => setActiveTab('visit')}>
                📅 Book Visit
              </button>
            </div>
            <div className={styles.formBody}>
              <InquiryForm property={property} type={activeTab === 'visit' ? 'site-visit' : 'inquiry'} />
            </div>
          </div>

          {/* Agent Info */}
          <div className={styles.agentCard}>
            <div className={styles.agentAvatar}>BE</div>
            <div>
              <div className={styles.agentName}>Bhagat Estates</div>
              <div className={styles.agentTitle}>Property Consultant</div>
              <div className={styles.agentLocation}>📍 Palghar, Maharashtra</div>
            </div>
          </div>
        </aside>
      </div>

      {/* Similar Properties */}
      {similar?.length > 0 && (
        <section className="section" style={{background:'var(--bg)'}}>
          <div className="container">
            <h2 className="section-title" style={{marginBottom:32}}>Similar Properties</h2>
            <div className="property-grid">
              {similar.map(p => <PropertyCard key={p._id} property={p} />)}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const res = await propertyAPI.getBySlug(params.slug);
    return { props: { property: res.data.data, similar: res.data.similar || [] } };
  } catch {
    return { props: { property: null, similar: [] } };
  }
}
