import React, { useEffect, useState } from 'react';
import { visitAPI, leadAPI } from '../utils/api';
import { format, isAfter } from 'date-fns';
import styles from './Visits.module.css';

const VISIT_STATUS = ['pending','confirmed','completed','cancelled'];
const BADGE_MAP = { pending:'badge-warning', confirmed:'badge-info', completed:'badge-success', cancelled:'badge-danger' };

export default function Visits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('all');

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    setLoading(true);
    try {
      const res = await visitAPI.getAll();
      setVisits(res.data.data);
    } catch { showToast('Failed to load visits', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, visitStatus) => {
    try {
      await leadAPI.update(id, { visitStatus });
      showToast('Visit status updated');
      load();
    } catch { showToast('Update failed', 'error'); }
  };

  const filtered = filter === 'all' ? visits : visits.filter(v => v.visitStatus === filter);
  const upcoming = visits.filter(v => v.visitDate && isAfter(new Date(v.visitDate), new Date()) && v.visitStatus !== 'cancelled');

  return (
    <div>
      {toast && <div className={`alert alert-${toast.type}`} style={{position:'fixed',top:20,right:20,zIndex:9999,minWidth:280}}>{toast.msg}</div>}

      <div className="page-header">
        <div>
          <div className="page-title">Site Visits</div>
          <div className="page-subtitle">{visits.length} total • {upcoming.length} upcoming</div>
        </div>
      </div>

      {/* Upcoming highlight */}
      {upcoming.length > 0 && (
        <div className={styles.upcomingBanner}>
          <span className={styles.upcomingIcon}>📅</span>
          <strong>{upcoming.length} upcoming visit{upcoming.length > 1 ? 's' : ''}</strong> scheduled
          <span style={{color:'var(--text-muted)',fontSize:13}}>— Confirm or reschedule as needed</span>
        </div>
      )}

      {/* Filter tabs */}
      <div className={styles.filterTabs}>
        {['all', ...VISIT_STATUS].map(s => (
          <button key={s} className={`${styles.filterTab} ${filter === s ? styles.filterTabActive : ''}`}
            onClick={() => setFilter(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
            {' '}
            <span className={styles.tabCount}>({s === 'all' ? visits.length : visits.filter(v => v.visitStatus === s).length})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{display:'flex',justifyContent:'center',padding:60}}><div className="spinner-lg"></div></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><h3>No Visits Found</h3><p>Site visit bookings from the website will appear here.</p></div>
      ) : (
        <div className={styles.visitGrid}>
          {filtered.map(v => {
            const isPast = v.visitDate && !isAfter(new Date(v.visitDate), new Date());
            return (
              <div key={v._id} className={`${styles.visitCard} ${isPast ? styles.visitPast : ''}`}>
                <div className={styles.visitHeader}>
                  <div className={styles.visitDate}>
                    <div className={styles.visitDay}>{v.visitDate ? format(new Date(v.visitDate), 'dd') : '—'}</div>
                    <div className={styles.visitMonth}>{v.visitDate ? format(new Date(v.visitDate), 'MMM yyyy') : ''}</div>
                  </div>
                  <div>
                    <span className={`badge ${BADGE_MAP[v.visitStatus] || 'badge-gray'}`}>{v.visitStatus}</span>
                    {v.visitTime && <div className={styles.visitTime}>🕐 {v.visitTime}</div>}
                  </div>
                </div>

                <div className={styles.visitPerson}>
                  <strong>{v.name}</strong>
                  <div className={styles.visitContacts}>
                    <a href={`tel:${v.phone}`}>📞 {v.phone}</a>
                    <a href={`https://wa.me/91${v.phone}`} target="_blank" rel="noreferrer">💬 WA</a>
                  </div>
                </div>

                {(v.propertyTitle || v.property?.title) && (
                  <div className={styles.visitProp}>🏠 {v.propertyTitle || v.property?.title}</div>
                )}

                {v.message && <p className={styles.visitMsg}>{v.message}</p>}

                <div className={styles.visitActions}>
                  <select className="form-input" style={{flex:1,fontSize:13}}
                    value={v.visitStatus}
                    onChange={e => updateStatus(v._id, e.target.value)}>
                    {VISIT_STATUS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                  </select>
                  <a href={`tel:${v.phone}`} className="btn btn-success btn-sm">📞</a>
                  <a href={`https://wa.me/91${v.phone}`} target="_blank" rel="noreferrer" className="btn btn-sm" style={{background:'#25d366',color:'white'}}>💬</a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
