import Head from 'next/head';
import { useState } from 'react';
import Navbar from '../../src/components/common/Navbar';
import Footer from '../../src/components/common/Footer';
import PropertyCard from '../../src/components/property/PropertyCard';
import SearchFilter from '../../src/components/property/SearchFilter';
import { propertyAPI } from '../../src/utils/api';
import styles from '../../src/styles/Properties.module.css';

export default function PropertiesPage({ properties, pagination, localities, queryParams }) {
  const [sortBy, setSortBy] = useState('isFeatured');

  const typeLabel = {
    flat: 'Flats & Apartments', plot: 'Plots & Land',
    commercial: 'Commercial Properties', rental: 'Rental Properties',
    'builder-project': 'Builder Projects'
  }[queryParams.propertyType] || 'All Properties';

  return (
    <>
      <Head>
        <title>{typeLabel} in Palghar | Bhagat Estates</title>
        <meta name="description" content={`Browse ${typeLabel} in Palghar, Maharashtra. Find verified listings with price, photos, and contact details at Bhagat Estates.`} />
      </Head>

      <Navbar />

      {/* Page Header */}
      <div className="page-header" style={{marginTop:64}}>
        <div className="container">
          <h1>{typeLabel}</h1>
          <p>{pagination?.totalRecords || 0} properties found in Palghar</p>
        </div>
      </div>

      <div className={`container ${styles.layout}`}>
        {/* Sidebar Filter */}
        <aside className={styles.sidebar}>
          <SearchFilter localities={localities} />
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          <div className={styles.mainHeader}>
            <span className={styles.resultCount}>
              {pagination?.totalRecords || 0} Properties Found
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

              {/* Pagination */}
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
            <div className="no-results">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              <h3 style={{marginBottom:8,color:'var(--primary)'}}>No Properties Found</h3>
              <p>Try adjusting your filters or search criteria.</p>
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
      propertyAPI.getLocalities()
    ]);

    return {
      props: {
        properties: propsRes.status === 'fulfilled' ? propsRes.value.data.data : [],
        pagination: propsRes.status === 'fulfilled' ? propsRes.value.data.pagination : null,
        localities: localitiesRes.status === 'fulfilled' ? localitiesRes.value.data.data : [],
        queryParams: query
      }
    };
  } catch {
    return { props: { properties: [], pagination: null, localities: [], queryParams: query } };
  }
}
