import Link from 'next/link';
import { formatPrice } from '../../utils/api';
import styles from './PropertyCard.module.css';

const TYPE_LABELS = {
  flat: 'Flat', plot: 'Plot', commercial: 'Commercial',
  rental: 'Rental', 'builder-project': 'Project'
};

const TYPE_COLORS = {
  flat: '#1a3c5e', plot: '#2d6a4f', commercial: '#7b2d8b',
  rental: '#c8963e', 'builder-project': '#c62828'
};

export default function PropertyCard({ property }) {
  const {
    title, slug, price, priceUnit, propertyType, bhk, area,
    status, furnishing, images, location, isFeatured, listingType
  } = property;

  const primaryImage = images?.find(img => img.isPrimary)?.url || images?.[0]?.url || null;

  return (
    <Link href={`/properties/${slug}`} className={`card ${styles.card}`}>
      {/* Image */}
      <div className={styles.imageWrap}>
        {primaryImage ? (
          <img
            src={primaryImage.startsWith('http') ? primaryImage : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${primaryImage}`}
            alt={title}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21,15 16,10 5,21"/>
            </svg>
            <span>No Photo</span>
          </div>
        )}
        <div className={styles.badges}>
          <span className={styles.typeBadge} style={{ background: TYPE_COLORS[propertyType] || '#1a3c5e' }}>
            {TYPE_LABELS[propertyType] || propertyType}
          </span>
          {isFeatured && <span className={styles.featuredBadge}>★ Featured</span>}
          {status === 'under-construction' && <span className={styles.statusBadge}>Under Construction</span>}
        </div>
        {listingType === 'rent' && <div className={styles.rentTag}>FOR RENT</div>}
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.location}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          {location?.locality}, {location?.city}
        </p>

        <div className={styles.specs}>
          {bhk && bhk !== 'N/A' && (
            <span className={styles.spec}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
              {bhk}
            </span>
          )}
          {area?.total && (
            <span className={styles.spec}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><rect x="3" y="3" width="18" height="18" rx="1"/></svg>
              {area.total.toLocaleString()} {area.unit || 'sqft'}
            </span>
          )}
          {furnishing && furnishing !== 'N/A' && (
            <span className={styles.spec}>{furnishing}</span>
          )}
        </div>

        <div className={styles.footer}>
          <div>
            <div className={styles.price}>{formatPrice(price, priceUnit)}</div>
            {area?.total && priceUnit === 'total' && (
              <div className={styles.pricePerSqft}>
                ₹{Math.round(price / area.total).toLocaleString()}/sqft
              </div>
            )}
          </div>
          <span className={styles.viewBtn}>View Details →</span>
        </div>
      </div>
    </Link>
  );
}
