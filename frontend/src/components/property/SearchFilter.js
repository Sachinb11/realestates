import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './SearchFilter.module.css';

const PROPERTY_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'flat', label: 'Flat/Apartment' },
  { value: 'plot', label: 'Plot/Land' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'rental', label: 'Rental' },
  { value: 'builder-project', label: 'Builder Project' },
];

const BHK_OPTIONS = ['1RK','1BHK','2BHK','3BHK','4BHK'];

const PRICE_RANGES = [
  { label: 'Any Price', min: '', max: '' },
  { label: 'Under ₹20L', min: '', max: '2000000' },
  { label: '₹20L–50L', min: '2000000', max: '5000000' },
  { label: '₹50L–1Cr', min: '5000000', max: '10000000' },
  { label: '₹1Cr–2Cr', min: '10000000', max: '20000000' },
  { label: 'Above ₹2Cr', min: '20000000', max: '' },
];

export default function SearchFilter({ localities = [], compact = false }) {
  const router = useRouter();
  const q = router.query;

  const [filters, setFilters] = useState({
    search: q.search || '',
    propertyType: q.propertyType || '',
    locality: q.locality || '',
    bhk: q.bhk || '',
    status: q.status || '',
    minPrice: q.minPrice || '',
    maxPrice: q.maxPrice || '',
    listingType: q.listingType || '',
  });

  const set = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

  const apply = (e) => {
    e?.preventDefault();
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    router.push({ pathname: '/properties', query: params });
  };

  const reset = () => {
    const empty = { search:'', propertyType:'', locality:'', bhk:'', status:'', minPrice:'', maxPrice:'', listingType:'' };
    setFilters(empty);
    router.push('/properties');
  };

  if (compact) {
    return (
      <form onSubmit={apply} className={styles.compactForm}>
        <div className={styles.compactSearch}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" className={styles.searchIcon}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className={styles.compactInput}
            placeholder="Search by location, project, type..."
            value={filters.search}
            onChange={e => set('search', e.target.value)}
          />
        </div>
        <select className={styles.compactSelect} value={filters.propertyType} onChange={e => set('propertyType', e.target.value)}>
          {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select className={styles.compactSelect} value={filters.listingType} onChange={e => set('listingType', e.target.value)}>
          <option value="">Buy / Rent</option>
          <option value="sale">Buy</option>
          <option value="rent">Rent</option>
        </select>
        <button type="submit" className={`btn btn-accent ${styles.compactBtn}`}>
          🔍 Search
        </button>
      </form>
    );
  }

  return (
    <div className={styles.filterPanel}>
      <div className={styles.filterHeader}>
        <h3>🔍 Filter Properties</h3>
        <button onClick={reset} className={styles.resetBtn}>Reset All</button>
      </div>

      <div className={styles.filterBody}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Search</label>
          <input
            className="form-input"
            placeholder="Location, project name..."
            value={filters.search}
            onChange={e => set('search', e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Property Type</label>
          <div className={styles.pillGroup}>
            {PROPERTY_TYPES.slice(1).map(t => (
              <button
                key={t.value}
                type="button"
                className={`${styles.pill} ${filters.propertyType === t.value ? styles.pillActive : ''}`}
                onClick={() => set('propertyType', filters.propertyType === t.value ? '' : t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Buy / Rent</label>
          <div className={styles.pillGroup}>
            {[{v:'sale',l:'Buy'},{v:'rent',l:'Rent'},{v:'lease',l:'Lease'}].map(o => (
              <button
                key={o.v}
                type="button"
                className={`${styles.pill} ${filters.listingType === o.v ? styles.pillActive : ''}`}
                onClick={() => set('listingType', filters.listingType === o.v ? '' : o.v)}
              >
                {o.l}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>BHK</label>
          <div className={styles.pillGroup}>
            {BHK_OPTIONS.map(b => (
              <button
                key={b}
                type="button"
                className={`${styles.pill} ${filters.bhk === b ? styles.pillActive : ''}`}
                onClick={() => set('bhk', filters.bhk === b ? '' : b)}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Status</label>
          <div className={styles.pillGroup}>
            {[{v:'ready-to-move',l:'Ready to Move'},{v:'under-construction',l:'Under Construction'}].map(o => (
              <button
                key={o.v}
                type="button"
                className={`${styles.pill} ${filters.status === o.v ? styles.pillActive : ''}`}
                onClick={() => set('status', filters.status === o.v ? '' : o.v)}
              >
                {o.l}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Price Range</label>
          <div className={styles.pillGroup}>
            {PRICE_RANGES.map(r => {
              const isActive = filters.minPrice === r.min && filters.maxPrice === r.max && r.label !== 'Any Price';
              return (
                <button
                  key={r.label}
                  type="button"
                  className={`${styles.pill} ${isActive ? styles.pillActive : ''}`}
                  onClick={() => { set('minPrice', r.min); set('maxPrice', r.max); }}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {localities.length > 0 && (
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Locality</label>
            <select className="form-input" value={filters.locality} onChange={e => set('locality', e.target.value)}>
              <option value="">All Localities</option>
              {localities.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        )}

        <button onClick={apply} className={`btn btn-primary`} style={{width:'100%', justifyContent:'center', marginTop:8}}>
          Apply Filters
        </button>
      </div>
    </div>
  );
}
