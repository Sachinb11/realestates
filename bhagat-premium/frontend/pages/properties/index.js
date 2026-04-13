import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Navbar from '../../src/components/common/Navbar';
import Footer from '../../src/components/common/Footer';
import PropertyCard from '../../src/components/property/PropertyCard';
import SearchFilter from '../../src/components/property/SearchFilter';
import { propertyAPI } from '../../src/utils/api';
import styles from '../../src/styles/Properties.module.css';

const TYPE_LABEL = {
  flat: 'Flats & Apartments',
  plot: 'Plots & Land',
  commercial: 'Commercial Properties',
  rental: 'Rental Properties',
  'builder-project': 'Builder Projects',
};

export default function PropertiesPage({ properties, pagination, localities, queryParams }) {
  const [sortBy, setSortBy] = useState(queryParams.sortBy || 'isFeatured');

  const typeLabel = TYPE_LABEL[queryParams.propertyType] || 'All Properties';

  return (
    <>
      <Head>
        <title>{typeLabel} in Palghar | Bhagat Estates</title>
        <meta name="description" content={`Browse ${typeLabel} in Palghar, Maharashtra. Find verified listings with price, photos, and contact details at Bhagat Estates.`} />
      </Head>

      <Navbar />

      {/* Page Header */}
      <div className="page-header" style={{ marginTop: 72 }}>
        <div className="container">
          <h1>{typeLabel}</h1>
          <p>{pagination?.totalRecords ?? 0} properties found in Palghar</p>
        </div>
      </div>

      <div className={`container ${styles.layout}`}>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <SearchFilter localities={localities} />
        </aside>

        {/* Main */}
        <main className={styles.main}>
          <div className={styles.mainHeader}>
            <span className={styles.resultCount}>
              <strong>{pagination?.totalRecords ?? 0}</strong> Properties Found
            </span>
            <div className={styles.sortWrap}>
              <label className={styles.sortLabel}>Sort by:</label>
              <select
                className={styles.sortSelect}
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="isFeatured">Featured First</option>
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {properties?.length > 0 ? (
            <>
              <div className="property-grid">
                {properties.map(p => <PropertyCard key={p._id} property={p} />)}
              </div>

              {pagination?.total > 1 && (
                <div className={styles.pagination}>
                  {Array.from({ length: pagination.total }, (_, i) => i + 1).map(page => (
                    <a
                      key={page}
                      href={`/properties?page=${page}`}
                      className={`${styles.pageBtn} ${pagination.current === page ? styles.pageBtnActive : ''}`}
                    >
                      {page}
                    </a>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🏠</div>
              <h3>No Properties Found</h3>
              <p>Try adjusting your filters or search with different keywords.</p>
              <Link href="/properties" className="btn btn-accent" style={{ marginTop: 8 }}>
                View All Properties
              </Link>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}

export async function getServerSideProps({ query }) {
  try {
    const params = { ...query, limit: 12 };
    const [propsRes, localitiesRes] = await Promise.allSettled([
      propertyAPI.getAll(params),
      propertyAPI.getLocalities(),
    ]);

    return {
      props: {
        properties:  propsRes.status       === 'fulfilled' ? propsRes.value.data.data         : [],
        pagination:  propsRes.status       === 'fulfilled' ? propsRes.value.data.pagination   : null,
        localities:  localitiesRes.status  === 'fulfilled' ? localitiesRes.value.data.data    : [],
        queryParams: query,
      },
    };
  } catch {
    return { props: { properties: [], pagination: null, localities: [], queryParams: query } };
  }
}
