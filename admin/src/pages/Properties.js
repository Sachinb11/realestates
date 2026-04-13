import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyAPI, formatPrice } from '../utils/api';
import styles from './Properties.module.css';

const TYPE_COLORS = { flat:'#1a3c5e', plot:'#2d6a4f', commercial:'#7b2d8b', rental:'#c8963e', 'builder-project':'#c62828' };

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({ propertyType: '', isActive: '' });
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15, ...filter };
      if (!params.isActive) delete params.isActive;
      if (!params.propertyType) delete params.propertyType;
      const res = await propertyAPI.getAll(params);
      setProperties(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      showToast('Failed to load properties', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => { loadProperties(); }, [loadProperties]);

  const handleToggle = async (id) => {
    setActionLoading(id);
    try {
      await propertyAPI.toggle(id);
      showToast('Property status updated');
      loadProperties();
    } catch { showToast('Update failed', 'error'); }
    finally { setActionLoading(null); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setActionLoading(deleteId);
    try {
      await propertyAPI.delete(deleteId);
      showToast('Property deleted');
      setDeleteId(null);
      loadProperties();
    } catch { showToast('Delete failed', 'error'); }
    finally { setActionLoading(null); }
  };

  return (
    <div>
      {toast && <div className={`alert alert-${toast.type}`} style={{position:'fixed',top:20,right:20,zIndex:9999,minWidth:280}}>{toast.msg}</div>}

      {deleteId && (
        <div className={styles.modal}>
          <div className={styles.modalBox}>
            <div className={styles.modalIcon}>🗑️</div>
            <h3>Delete Property?</h3>
            <p>This action cannot be undone. The property will be permanently removed.</p>
            <div className={styles.modalBtns}>
              <button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={!!actionLoading}>
                {actionLoading ? <span className="spinner"></span> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="page-header">
        <div>
          <div className="page-title">Properties</div>
          <div className="page-subtitle">{pagination?.totalRecords || 0} total properties</div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/properties/new')}>+ Add Property</button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <select className="form-input" style={{width:'auto'}} value={filter.propertyType}
          onChange={e => setFilter(f => ({...f, propertyType: e.target.value}))}>
          <option value="">All Types</option>
          {['flat','plot','commercial','rental','builder-project'].map(t => (
            <option key={t} value={t}>{t.replace('-',' ')}</option>
          ))}
        </select>
        <select className="form-input" style={{width:'auto'}} value={filter.isActive}
          onChange={e => setFilter(f => ({...f, isActive: e.target.value}))}>
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <button className="btn btn-outline btn-sm" onClick={() => { setFilter({propertyType:'',isActive:''}); setPage(1); }}>
          Clear
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{display:'flex',justifyContent:'center',padding:60}}><div className="spinner-lg"></div></div>
      ) : properties.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
          <h3>No Properties Found</h3>
          <p>Add your first property to get started.</p>
          <button className="btn btn-primary" style={{marginTop:16}} onClick={() => navigate('/properties/new')}>+ Add Property</button>
        </div>
      ) : (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Property</th><th>Type</th><th>Price</th><th>Location</th>
                  <th>BHK</th><th>Status</th><th>Active</th><th>Views</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div className={styles.propCell}>
                        <div className={styles.propThumb}>
                          {p.images?.[0]?.url ? (
                            <img src={p.images[0].url.startsWith('http') ? p.images[0].url : `http://localhost:5000${p.images[0].url}`} alt={p.title} />
                          ) : <span>🏠</span>}
                        </div>
                        <div>
                          <div className={styles.propName}>{p.title}</div>
                          {p.isFeatured && <span className="badge badge-warning" style={{fontSize:11}}>★ Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.typePill} style={{background:`${TYPE_COLORS[p.propertyType]}18`, color: TYPE_COLORS[p.propertyType]}}>
                        {p.propertyType}
                      </span>
                    </td>
                    <td><strong>{formatPrice(p.price, p.priceUnit)}</strong></td>
                    <td style={{fontSize:13}}>{p.location?.locality}, {p.location?.city}</td>
                    <td>{p.bhk !== 'N/A' ? p.bhk : '—'}</td>
                    <td>
                      <span className={`badge ${p.status === 'ready-to-move' ? 'badge-success' : 'badge-warning'}`}>
                        {p.status === 'ready-to-move' ? 'Ready' : 'Under Const.'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggle(p._id)}
                        className={`${styles.toggleBtn} ${p.isActive ? styles.toggleOn : styles.toggleOff}`}
                        disabled={actionLoading === p._id}
                      >
                        {actionLoading === p._id ? '...' : p.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td style={{textAlign:'center'}}>{p.views}</td>
                    <td>
                      <div className={styles.actions}>
                        <button className="btn btn-outline btn-sm btn-icon" title="Edit" onClick={() => navigate(`/properties/edit/${p._id}`)}>✏️</button>
                        <a href={`http://localhost:3000/properties/${p.slug}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm btn-icon" title="View on site">🌐</a>
                        <button className="btn btn-sm btn-icon" style={{background:'rgba(229,62,62,0.1)',color:'var(--error)',border:'none'}} title="Delete" onClick={() => setDeleteId(p._id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination?.total > 1 && (
            <div className="pagination">
              {Array.from({length: pagination.total}, (_,i) => i+1).map(pg => (
                <button key={pg} className={`page-btn ${pg === page ? 'active' : ''}`} onClick={() => setPage(pg)}>{pg}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
