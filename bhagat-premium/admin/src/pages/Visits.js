import React, { useEffect, useState } from 'react';
import { visitAPI } from '../utils/api';
import { format, isAfter, parseISO, isToday } from 'date-fns';
import styles from './Visits.module.css';

const VISIT_STATUS  = ['pending','confirmed','completed','cancelled'];
const BADGE_MAP     = { pending:'badge-warning', confirmed:'badge-info', completed:'badge-success', cancelled:'badge-danger' };
const STATUS_ICONS  = { pending:'⏳', confirmed:'✅', completed:'🏁', cancelled:'❌' };

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{position:'fixed',top:20,right:20,zIndex:9999,padding:'12px 20px',borderRadius:10,
      background: toast.type==='success'?'#16A34A':'#DC2626',color:'white',fontWeight:600,fontSize:14,
      boxShadow:'0 8px 32px rgba(0,0,0,0.2)',animation:'slideIn 0.3s ease'}}>
      {toast.type==='success'?'✓':'✕'} {toast.msg}
    </div>
  );
}

export default function Visits() {
  const [visits, setVisits]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState(null);
  const [filter, setFilter]   = useState('all');

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const load = async () => {
    setLoading(true);
    try {
      const res = await visitAPI.getAll();
      setVisits(res.data.data);
    } catch { showToast('Failed to load visits','error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, visitStatus) => {
    try {
      await visitAPI.updateStatus(id, visitStatus);
      showToast('Visit status updated ✓');
      load();
    } catch { showToast('Update failed','error'); }
  };

  const filtered  = filter === 'all' ? visits : visits.filter(v => v.visitStatus === filter);
  const upcoming  = visits.filter(v => v.visitDate && isAfter(parseISO(v.visitDate), new Date()) && v.visitStatus !== 'cancelled');
  const todayVisits = visits.filter(v => v.visitDate && isToday(parseISO(v.visitDate)));

  return (
    <div>
      <Toast toast={toast} />

      <div className="page-header">
        <div>
          <div className="page-title">Site Visits</div>
          <div className="page-subtitle">{visits.length} total · {upcoming.length} upcoming</div>
        </div>
        <button className="btn btn-outline btn-sm" onClick={load}>↻ Refresh</button>
      </div>

      {/* Highlight bars */}
      {todayVisits.length > 0 && (
        <div className={styles.todayBanner}>
          <span>🗓️</span>
          <strong>{todayVisits.length} visit{todayVisits.length>1?'s':''} TODAY</strong>
          <span style={{color:'var(--text-muted)',fontSize:13}}>
            — {todayVisits.map(v => v.name).join(', ')}
          </span>
        </div>
      )}
      {upcoming.length > 0 && todayVisits.length === 0 && (
        <div className={styles.upcomingBanner}>
          <span>📅</span>
          <strong>{upcoming.length} upcoming visit{upcoming.length>1?'s':''}</strong>
          <span style={{color:'var(--text-muted)',fontSize:13}}>— Next: {format(parseISO(upcoming[0].visitDate),'dd MMM')}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className={styles.filterTabs}>
        {['all',...VISIT_STATUS].map(s => (
          <button key={s} className={`${styles.filterTab} ${filter===s?styles.filterTabActive:''}`}
            onClick={() => setFilter(s)}>
            {s!=='all' && STATUS_ICONS[s]} {s.charAt(0).toUpperCase()+s.slice(1)}
            <span className={styles.tabCount}>{s==='all'?visits.length:visits.filter(v=>v.visitStatus===s).length}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{display:'flex',justifyContent:'center',padding:72}}><div className="spinner-lg"></div></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div style={{fontSize:48,marginBottom:16}}>📅</div>
          <h3>No Visits Found</h3>
          <p>Site visit bookings will appear here.</p>
        </div>
      ) : (
        <div className={styles.visitGrid}>
          {filtered.map(v => {
            const isPast = v.visitDate && !isAfter(parseISO(v.visitDate), new Date());
            const isVisitToday = v.visitDate && isToday(parseISO(v.visitDate));
            return (
              <div key={v._id} className={`${styles.visitCard} ${isPast&&v.visitStatus==='pending'?styles.visitOverdue:''} ${isVisitToday?styles.visitToday:''}`}>
                {isVisitToday && <div className={styles.todayTag}>TODAY</div>}

                <div className={styles.visitHeader}>
                  <div className={styles.visitDateBox}>
                    <div className={styles.visitDay}>{v.visitDate ? format(parseISO(v.visitDate),'dd') : '—'}</div>
                    <div className={styles.visitMonth}>{v.visitDate ? format(parseISO(v.visitDate),'MMM yyyy') : ''}</div>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
                    <span className={`badge ${BADGE_MAP[v.visitStatus]||'badge-gray'}`}>
                      {STATUS_ICONS[v.visitStatus]} {v.visitStatus}
                    </span>
                    {v.visitTime && <div className={styles.visitTime}>🕐 {v.visitTime}</div>}
                  </div>
                </div>

                <div className={styles.visitPerson}>
                  <div className={styles.visitAvatar}>{v.name?.charAt(0)?.toUpperCase()}</div>
                  <div>
                    <strong>{v.name}</strong>
                    <div className={styles.visitContacts}>
                      <a href={`tel:${v.phone}`}>📞 {v.phone}</a>
                      <a href={`https://wa.me/91${v.phone}?text=${encodeURIComponent('Hi '+v.name+', your site visit is confirmed for '+(v.visitDate?format(parseISO(v.visitDate),'dd MMM yyyy'):'')+(v.visitTime?' at '+v.visitTime:'')+'. - Bhagat Estates')}`}
                         target="_blank" rel="noreferrer">💬 WhatsApp</a>
                    </div>
                  </div>
                </div>

                {(v.propertyTitle || v.property?.title) && (
                  <div className={styles.visitProp}>🏠 {v.propertyTitle || v.property?.title}</div>
                )}
                {v.message && <p className={styles.visitMsg}>"{v.message}"</p>}

                <div className={styles.visitActions}>
                  <select className="form-input" style={{flex:1,fontSize:13}}
                    value={v.visitStatus} onChange={e => updateStatus(v._id, e.target.value)}>
                    {VISIT_STATUS.map(s => <option key={s} value={s}>{STATUS_ICONS[s]} {s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                  </select>
                  <a href={`tel:${v.phone}`} className="btn btn-sm" style={{background:'rgba(22,163,74,0.1)',color:'#16A34A',border:'1px solid rgba(22,163,74,0.2)'}}>📞</a>
                  <a href={`https://wa.me/91${v.phone}`} target="_blank" rel="noreferrer"
                     className="btn btn-sm" style={{background:'rgba(37,211,102,0.1)',color:'#16a34a',border:'1px solid rgba(37,211,102,0.2)'}}>💬</a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
