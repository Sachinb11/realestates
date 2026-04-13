import React, { useEffect, useState, useCallback } from 'react';
import { leadAPI } from '../utils/api';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import styles from './Leads.module.css';

const STATUS_OPTS   = ['new','contacted','qualified','negotiation','closed','lost'];
const PRIORITY_OPTS = ['low','medium','high'];
const TYPE_OPTS     = ['inquiry','site-visit','callback','whatsapp'];

const STATUS_META = {
  new:         { badge:'badge-new',       label:'New',         icon:'🔵' },
  contacted:   { badge:'badge-contacted', label:'Contacted',   icon:'🟡' },
  qualified:   { badge:'badge-qualified', label:'Qualified',   icon:'🟢' },
  negotiation: { badge:'badge-info',      label:'Negotiation', icon:'🟠' },
  closed:      { badge:'badge-success',   label:'Closed',      icon:'✅' },
  lost:        { badge:'badge-danger',    label:'Lost',        icon:'❌' },
};
const PRIORITY_COLORS = { low:'#64748B', medium:'#D97706', high:'#DC2626' };

function relativeDate(dateStr) {
  if (!dateStr) return '—';
  const d = parseISO(dateStr);
  if (isToday(d))     return 'Today, ' + format(d, 'h:mm a');
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'dd MMM yyyy');
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`}>
      {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
    </div>
  );
}

function LeadModal({ lead, onClose, onSave }) {
  const [data, setData]   = useState({ status: lead.status, priority: lead.priority, notes: lead.notes || '' });
  const [saving, setSaving] = useState(false);

  const wa_msg = encodeURIComponent(
    `Hi ${lead.name}, thank you for your interest in ${lead.propertyTitle || 'our properties'}. This is Bhagat Estates. How can we help you?`
  );

  const save = async () => {
    setSaving(true);
    await onSave(lead._id, data);
    setSaving(false);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <div className={styles.leadAvatarLg}>{lead.name.charAt(0).toUpperCase()}</div>
            <div>
              <h3>{lead.name}</h3>
              <span className={`badge ${STATUS_META[lead.status]?.badge || 'badge-gray'}`}>
                {STATUS_META[lead.status]?.icon} {lead.status}
              </span>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody}>

          {/* Contact Actions */}
          <div className={styles.contactRow}>
            <a href={`tel:${lead.phone}`} className={styles.contactActionBtn} style={{background:'rgba(22,163,74,0.1)',color:'#16A34A',borderColor:'rgba(22,163,74,0.2)'}}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
              Call: {lead.phone}
            </a>
            <a href={`https://wa.me/91${lead.phone}?text=${wa_msg}`} target="_blank" rel="noreferrer"
               className={styles.contactActionBtn} style={{background:'rgba(37,211,102,0.1)',color:'#16a34a',borderColor:'rgba(37,211,102,0.25)'}}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            {lead.email && (
              <a href={`mailto:${lead.email}`} className={styles.contactActionBtn} style={{background:'rgba(37,99,235,0.08)',color:'#2563EB',borderColor:'rgba(37,99,235,0.2)'}}>
                ✉️ {lead.email}
              </a>
            )}
          </div>

          {/* Info Grid */}
          <div className={styles.infoGrid}>
            {lead.propertyTitle && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Property</span>
                <span className={styles.infoValue}>🏠 {lead.propertyTitle}</span>
              </div>
            )}
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Lead Type</span>
              <span className={styles.infoValue}>{lead.type?.replace('-',' ')}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Source</span>
              <span className={styles.infoValue}>{lead.source}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Received</span>
              <span className={styles.infoValue}>{format(parseISO(lead.createdAt), 'dd MMM yyyy, h:mm a')}</span>
            </div>
            {lead.lastContactedAt && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Last Contacted</span>
                <span className={styles.infoValue}>{format(parseISO(lead.lastContactedAt), 'dd MMM yyyy')}</span>
              </div>
            )}
          </div>

          {/* Site Visit Info */}
          {lead.type === 'site-visit' && lead.visitDate && (
            <div className={styles.visitInfoBox}>
              <span>📅</span>
              <div>
                <strong>Site Visit Scheduled</strong>
                <div>{format(parseISO(lead.visitDate), 'EEEE, dd MMMM yyyy')} at {lead.visitTime || 'TBD'}</div>
              </div>
              <span className={`badge ${lead.visitStatus === 'confirmed' ? 'badge-success' : lead.visitStatus === 'completed' ? 'badge-info' : 'badge-warning'}`}>
                {lead.visitStatus}
              </span>
            </div>
          )}

          {/* Message */}
          {lead.message && (
            <div className={styles.messageBox}>
              <div className={styles.messageLabel}>Message from Client</div>
              <p>{lead.message}</p>
            </div>
          )}

          {/* Update Form */}
          <div className={styles.updateForm}>
            <h4 className={styles.updateTitle}>Update Lead</h4>
            <div className={styles.updateRow}>
              <div className="form-group" style={{flex:1}}>
                <label className="form-label">Status</label>
                <select className="form-input" value={data.status}
                  onChange={e => setData(d => ({...d, status: e.target.value}))}>
                  {STATUS_OPTS.map(s => (
                    <option key={s} value={s}>{STATUS_META[s]?.icon} {s.charAt(0).toUpperCase()+s.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{flex:1}}>
                <label className="form-label">Priority</label>
                <select className="form-input" value={data.priority}
                  onChange={e => setData(d => ({...d, priority: e.target.value}))}>
                  {PRIORITY_OPTS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Follow-up Notes</label>
              <textarea className="form-input" rows={3} value={data.notes}
                onChange={e => setData(d => ({...d, notes: e.target.value}))}
                placeholder="Add notes, follow-up actions, client requirements..." style={{resize:'vertical'}} />
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-accent" onClick={save} disabled={saving}>
            {saving ? <><span className="spinner"></span> Saving...</> : '✓ Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Leads() {
  const [leads, setLeads]         = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [page, setPage]           = useState(1);
  const [filter, setFilter]       = useState({ status: '', type: '', dateFrom: '', dateTo: '', search: '' });
  const [selected, setSelected]   = useState(null);
  const [toast, setToast]         = useState(null);
  const [summary, setSummary]     = useState({});

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 25 };
      if (filter.status)   params.status   = filter.status;
      if (filter.type)     params.type     = filter.type;
      if (filter.dateFrom) params.dateFrom = filter.dateFrom;
      if (filter.dateTo)   params.dateTo   = filter.dateTo;
      if (filter.search)   params.search   = filter.search;

      const res = await leadAPI.getAll(params);
      setLeads(res.data.data);
      setPagination(res.data.pagination);

      // Build summary counts from fresh data
      const all = res.data.data;
      const counts = {};
      STATUS_OPTS.forEach(s => { counts[s] = all.filter(l => l.status === s).length; });
      setSummary(counts);
    } catch { showToast('Failed to load leads', 'error'); }
    finally { setLoading(false); }
  }, [page, filter]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (id, data) => {
    try {
      await leadAPI.update(id, data);
      showToast('Lead updated successfully ✓');
      setSelected(null);
      load();
    } catch { showToast('Update failed', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead permanently?')) return;
    try {
      await leadAPI.delete(id);
      showToast('Lead deleted');
      load();
    } catch { showToast('Delete failed', 'error'); }
  };

  const resetFilters = () => {
    setFilter({ status: '', type: '', dateFrom: '', dateTo: '', search: '' });
    setPage(1);
  };

  const totalNew = leads.filter(l => l.status === 'new').length;

  return (
    <div>
      <Toast toast={toast} />
      {selected && <LeadModal lead={selected} onClose={() => setSelected(null)} onSave={handleSave} />}

      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">
            Leads CRM
            {totalNew > 0 && <span className={styles.newBadge}>{totalNew} New</span>}
          </div>
          <div className="page-subtitle">{pagination?.totalRecords || 0} total leads in system</div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn btn-outline btn-sm" onClick={load}>↻ Refresh</button>
        </div>
      </div>

      {/* Status Summary Cards */}
      <div className={styles.summaryRow}>
        {STATUS_OPTS.map(s => (
          <button key={s}
            className={`${styles.summaryCard} ${filter.status === s ? styles.summaryCardActive : ''}`}
            onClick={() => { setFilter(f => ({...f, status: f.status === s ? '' : s})); setPage(1); }}>
            <span className={styles.summaryIcon}>{STATUS_META[s]?.icon}</span>
            <span className={styles.summaryCount}>{summary[s] || 0}</span>
            <span className={styles.summaryLabel}>{STATUS_META[s]?.label}</span>
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <div className={styles.filtersBar}>
        <input
          className={`form-input ${styles.searchInput}`}
          placeholder="🔍 Search by name, phone..."
          value={filter.search}
          onChange={e => setFilter(f => ({...f, search: e.target.value}))}
        />
        <select className="form-input" style={{width:'auto'}} value={filter.type}
          onChange={e => setFilter(f => ({...f, type: e.target.value}))}>
          <option value="">All Types</option>
          {TYPE_OPTS.map(t => <option key={t} value={t}>{t.replace('-',' ').replace(/\b\w/g,c=>c.toUpperCase())}</option>)}
        </select>
        <div className={styles.dateGroup}>
          <input type="date" className="form-input" value={filter.dateFrom} title="From date"
            onChange={e => setFilter(f => ({...f, dateFrom: e.target.value}))} style={{width:140}} />
          <span style={{color:'var(--text-muted)',fontSize:12}}>to</span>
          <input type="date" className="form-input" value={filter.dateTo} title="To date"
            onChange={e => setFilter(f => ({...f, dateTo: e.target.value}))} style={{width:140}} />
        </div>
        {(filter.status || filter.type || filter.dateFrom || filter.dateTo || filter.search) && (
          <button className="btn btn-ghost btn-sm" onClick={resetFilters}>✕ Clear All</button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{display:'flex',justifyContent:'center',padding:72}}><div className="spinner-lg"></div></div>
      ) : leads.length === 0 ? (
        <div className="empty-state">
          <div style={{fontSize:48,marginBottom:16}}>📋</div>
          <h3>No Leads Found</h3>
          <p>Leads submitted from the website will appear here.</p>
        </div>
      ) : (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Contact</th>
                  <th>Type</th>
                  <th>Property</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead._id} className={styles.tableRow} onClick={() => setSelected(lead)}>
                    <td>
                      <div className={styles.clientCell}>
                        <div className={styles.clientAvatar}>{lead.name.charAt(0).toUpperCase()}</div>
                        <div>
                          <div className={styles.clientName}>{lead.name}</div>
                          {lead.email && <div className={styles.clientEmail}>{lead.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <a href={`tel:${lead.phone}`} className={styles.phoneLink}
                         onClick={e => e.stopPropagation()}>
                        {lead.phone}
                      </a>
                    </td>
                    <td>
                      <span className="badge badge-info">
                        {lead.type?.replace('-',' ').replace(/\b\w/g,c=>c.toUpperCase())}
                      </span>
                    </td>
                    <td className={styles.propCell}>
                      {lead.propertyTitle || <span style={{color:'var(--text-muted)'}}>General</span>}
                    </td>
                    <td>
                      <span className={`badge ${STATUS_META[lead.status]?.badge || 'badge-gray'}`}>
                        {STATUS_META[lead.status]?.icon} {lead.status}
                      </span>
                    </td>
                    <td>
                      <span className={styles.priorityBadge}
                        style={{color: PRIORITY_COLORS[lead.priority], borderColor: PRIORITY_COLORS[lead.priority]+'40', background: PRIORITY_COLORS[lead.priority]+'10'}}>
                        {lead.priority === 'high' ? '▲' : lead.priority === 'medium' ? '▶' : '▼'} {lead.priority}
                      </span>
                    </td>
                    <td className={styles.dateCell}>{relativeDate(lead.createdAt)}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className={styles.actionBtns}>
                        <a href={`tel:${lead.phone}`} className={styles.actionBtn} style={{color:'#16A34A'}} title="Call">
                          <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
                        </a>
                        <a href={`https://wa.me/91${lead.phone}?text=${encodeURIComponent('Hi '+lead.name+', this is Bhagat Estates. How can we help you?')}`}
                           target="_blank" rel="noreferrer" className={styles.actionBtn} style={{color:'#25d366'}} title="WhatsApp">
                          <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        </a>
                        <button className={styles.actionBtn} style={{color:'var(--error)'}} onClick={() => handleDelete(lead._id)} title="Delete">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination?.total > 1 && (
            <div className="pagination" style={{marginTop:24}}>
              <button className="page-btn" onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}>‹</button>
              {Array.from({length:pagination.total},(_,i)=>i+1).map(pg => (
                <button key={pg} className={`page-btn ${pg===page?'active':''}`} onClick={() => setPage(pg)}>{pg}</button>
              ))}
              <button className="page-btn" onClick={() => setPage(p => Math.min(pagination.total,p+1))} disabled={page===pagination.total}>›</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
