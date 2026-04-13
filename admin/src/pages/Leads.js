import React, { useEffect, useState, useCallback } from 'react';
import { leadAPI } from '../utils/api';
import { format } from 'date-fns';
import styles from './Leads.module.css';

const STATUS_OPTS = ['new','contacted','qualified','negotiation','closed','lost'];
const PRIORITY_OPTS = ['low','medium','high'];
const TYPE_OPTS = ['inquiry','site-visit','callback','whatsapp'];

const STATUS_BADGE = { new:'badge-new', contacted:'badge-contacted', qualified:'badge-qualified', negotiation:'badge-info', closed:'badge-success', lost:'badge-danger' };
const PRIORITY_COLORS = { low:'var(--text-muted)', medium:'var(--warning)', high:'var(--error)' };

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({ status: '', type: '' });
  const [selected, setSelected] = useState(null);
  const [updateData, setUpdateData] = useState({ status: '', priority: '', notes: '' });
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20, ...filter };
      if (!params.status) delete params.status;
      if (!params.type) delete params.type;
      const res = await leadAPI.getAll(params);
      setLeads(res.data.data);
      setPagination(res.data.pagination);
    } catch { showToast('Failed to load leads', 'error'); }
    finally { setLoading(false); }
  }, [page, filter]);

  useEffect(() => { load(); }, [load]);

  const openLead = (lead) => {
    setSelected(lead);
    setUpdateData({ status: lead.status, priority: lead.priority, notes: lead.notes || '' });
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await leadAPI.update(selected._id, updateData);
      showToast('Lead updated successfully');
      setSelected(null);
      load();
    } catch { showToast('Update failed', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await leadAPI.delete(id);
      showToast('Lead deleted');
      load();
    } catch { showToast('Delete failed', 'error'); }
  };

  const statsCount = (status) => leads.filter(l => l.status === status).length;

  return (
    <div>
      {toast && <div className={`alert alert-${toast.type}`} style={{position:'fixed',top:20,right:20,zIndex:9999,minWidth:280}}>{toast.msg}</div>}

      {/* Lead Detail Modal */}
      {selected && (
        <div className={styles.modal}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3>Lead Details</h3>
              <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.leadProfile}>
                <div className={styles.leadAvatar}>{selected.name.charAt(0).toUpperCase()}</div>
                <div>
                  <div className={styles.leadName}>{selected.name}</div>
                  <div className={styles.leadContact}>
                    <a href={`tel:${selected.phone}`}>📞 {selected.phone}</a>
                    {selected.email && <a href={`mailto:${selected.email}`}>✉️ {selected.email}</a>}
                    <a href={`https://wa.me/91${selected.phone}`} target="_blank" rel="noreferrer">💬 WhatsApp</a>
                  </div>
                </div>
              </div>

              {selected.propertyTitle && (
                <div className={styles.propRef}>
                  🏠 <strong>Property:</strong> {selected.propertyTitle}
                </div>
              )}

              {selected.type === 'site-visit' && (
                <div className={styles.visitInfo}>
                  📅 <strong>Visit:</strong> {selected.visitDate ? format(new Date(selected.visitDate), 'dd MMM yyyy') : '—'} at {selected.visitTime || '—'}
                </div>
              )}

              {selected.message && (
                <div className={styles.message}>
                  <strong>Message:</strong><br />
                  <p>{selected.message}</p>
                </div>
              )}

              <div className={styles.updateForm}>
                <div className={styles.updateRow}>
                  <div className="form-group" style={{flex:1}}>
                    <label className="form-label">Status</label>
                    <select className="form-input" value={updateData.status} onChange={e => setUpdateData(d => ({...d, status: e.target.value}))}>
                      {STATUS_OPTS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{flex:1}}>
                    <label className="form-label">Priority</label>
                    <select className="form-input" value={updateData.priority} onChange={e => setUpdateData(d => ({...d, priority: e.target.value}))}>
                      {PRIORITY_OPTS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes / Follow-up</label>
                  <textarea className="form-input" rows={3} value={updateData.notes} onChange={e => setUpdateData(d => ({...d, notes: e.target.value}))} placeholder="Add notes about this lead..." style={{resize:'vertical'}} />
                </div>
              </div>

              <div className={styles.modalMeta}>
                <span>Received: {format(new Date(selected.createdAt), 'dd MMM yyyy, h:mm a')}</span>
                <span>Source: {selected.source}</span>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleUpdate} disabled={saving}>
                {saving ? <><span className="spinner"></span> Saving...</> : '✓ Update Lead'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="page-header">
        <div>
          <div className="page-title">Leads</div>
          <div className="page-subtitle">{pagination?.totalRecords || 0} total leads</div>
        </div>
      </div>

      {/* Status Pills */}
      <div className={styles.statusBar}>
        {STATUS_OPTS.map(s => (
          <button key={s} className={`${styles.statusPill} ${filter.status === s ? styles.statusPillActive : ''}`}
            onClick={() => setFilter(f => ({...f, status: f.status === s ? '' : s}))}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
            <span className={styles.statusCount}>{leads.filter(l => l.status === s).length}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <select className="form-input" style={{width:'auto'}} value={filter.type}
          onChange={e => setFilter(f => ({...f, type: e.target.value}))}>
          <option value="">All Types</option>
          {TYPE_OPTS.map(t => <option key={t} value={t}>{t.replace('-',' ')}</option>)}
        </select>
        <button className="btn btn-outline btn-sm" onClick={() => { setFilter({status:'',type:''}); setPage(1); }}>Clear</button>
      </div>

      {loading ? (
        <div style={{display:'flex',justifyContent:'center',padding:60}}><div className="spinner-lg"></div></div>
      ) : leads.length === 0 ? (
        <div className="empty-state"><h3>No Leads Found</h3><p>Leads from the website will appear here.</p></div>
      ) : (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Name</th><th>Phone</th><th>Type</th><th>Property</th><th>Status</th><th>Priority</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead._id} style={{cursor:'pointer'}} onClick={() => openLead(lead)}>
                    <td><strong>{lead.name}</strong></td>
                    <td>
                      <a href={`tel:${lead.phone}`} onClick={e => e.stopPropagation()} style={{color:'var(--primary)',fontWeight:600}}>{lead.phone}</a>
                    </td>
                    <td><span className="badge badge-info">{lead.type}</span></td>
                    <td style={{maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:13}}>
                      {lead.propertyTitle || '—'}
                    </td>
                    <td><span className={`badge ${STATUS_BADGE[lead.status] || 'badge-gray'}`}>{lead.status}</span></td>
                    <td><span style={{fontSize:12,fontWeight:700,color:PRIORITY_COLORS[lead.priority]}}>▲ {lead.priority}</span></td>
                    <td style={{fontSize:13,color:'var(--text-muted)'}}>{format(new Date(lead.createdAt), 'dd MMM, yyyy')}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <div style={{display:'flex',gap:4}}>
                        <a href={`tel:${lead.phone}`} className="btn btn-sm btn-icon" style={{background:'rgba(56,161,105,0.1)',color:'var(--success)',border:'none'}} title="Call">📞</a>
                        <a href={`https://wa.me/91${lead.phone}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-icon" style={{background:'rgba(37,211,102,0.1)',color:'#25d366',border:'none'}} title="WhatsApp">💬</a>
                        <button className="btn btn-sm btn-icon" style={{background:'rgba(229,62,62,0.1)',color:'var(--error)',border:'none'}} onClick={() => handleDelete(lead._id)} title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination?.total > 1 && (
            <div className="pagination">
              {Array.from({length:pagination.total},(_,i)=>i+1).map(pg => (
                <button key={pg} className={`page-btn ${pg===page?'active':''}`} onClick={() => setPage(pg)}>{pg}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
