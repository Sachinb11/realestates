import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { dashboardAPI, formatPrice } from '../utils/api';
import styles from './Dashboard.module.css';

const COLORS  = ['#D4AF37','#16A34A','#2563EB','#D97706','#DC2626','#7C3AED'];
const PIE_COLORS = { flat:'#1a3c5e', plot:'#2d6a4f', commercial:'#7b2d8b', rental:'#c8963e', 'builder-project':'#c62828' };

const STATS_CONFIG = [
  { key: 'active',      label: 'Active Properties', icon: '🏠', color: '#1a3c5e' },
  { key: 'totalLeads',  label: 'Total Leads',        icon: '📋', color: '#D4AF37' },
  { key: 'siteVisits',  label: 'Site Visits',         icon: '📅', color: '#16A34A' },
  { key: 'thisMonth',   label: 'Leads This Month',    icon: '📈', color: '#2563EB' },
];

function StatCard({ icon, label, value, sub, color, growth }) {
  return (
    <div className={styles.statCard} style={{'--accent-color': color}}>
      <div className={styles.statTop}>
        <div className={styles.statIconWrap}>{icon}</div>
        {growth !== undefined && (
          <div className={styles.statGrow} style={{color: growth >= 0 ? '#16A34A' : '#DC2626', background: growth >= 0 ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)'}}>
            {growth >= 0 ? '↑' : '↓'} {Math.abs(growth)}%
          </div>
        )}
      </div>
      <div className={styles.statValue}>{value?.toLocaleString() ?? '—'}</div>
      <div className={styles.statLabel}>{label}</div>
      {sub && <div className={styles.statSub}>{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    dashboardAPI.getStats()
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'60vh'}}>
      <div className="spinner-lg"></div>
    </div>
  );

  const leadsByStatus = data?.leads?.byStatus?.map(s => ({
    name: s._id?.charAt(0).toUpperCase() + s._id?.slice(1) || '—',
    count: s.count
  })) || [];

  const propByType = data?.properties?.byType?.map(t => ({
    name: t._id?.replace('-', ' ') || '—',
    value: t.count,
    color: PIE_COLORS[t._id] || '#999'
  })) || [];

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Welcome back — here's what's happening today</div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <Link to="/leads" className="btn btn-outline btn-sm">View Leads →</Link>
          <button className="btn btn-accent" onClick={() => navigate('/properties/new')}>
            + Add Property
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        <StatCard icon="🏠" label="Active Properties" value={data?.properties?.active}
          sub={`${data?.properties?.total} total listed`} color="#1a3c5e" />
        <StatCard icon="📋" label="Total Leads" value={data?.leads?.total}
          sub={`${data?.leads?.new} new unread`} color="#D4AF37" />
        <StatCard icon="📅" label="Site Visits" value={data?.leads?.siteVisits}
          sub="Booked visits" color="#16A34A" />
        <StatCard icon="📈" label="This Month" value={data?.leads?.thisMonth}
          sub={`vs last month`} growth={data?.leads?.growth} color="#2563EB" />
      </div>

      {/* Charts Row */}
      <div className={styles.chartsRow}>
        {/* Leads by Status */}
        <div className="card" style={{flex:'1.3',padding:24}}>
          <h3 className={styles.chartTitle}>Leads by Status</h3>
          {leadsByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={leadsByStatus} margin={{top:4,right:4,bottom:0,left:-10}}>
                <XAxis dataKey="name" tick={{fontSize:12,fill:'var(--text-muted)'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize:12,fill:'var(--text-muted)'}} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{background:'var(--card-bg)',border:'1px solid var(--border)',borderRadius:10,fontSize:13}}
                  cursor={{fill:'var(--border-light)'}}
                />
                <Bar dataKey="count" radius={[6,6,0,0]} maxBarSize={48}>
                  {leadsByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <div style={{textAlign:'center',padding:40,color:'var(--text-muted)'}}>No lead data yet</div>}
        </div>

        {/* Properties by Type */}
        <div className="card" style={{flex:'1',padding:24}}>
          <h3 className={styles.chartTitle}>Properties by Type</h3>
          {propByType.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={propByType} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" outerRadius={75} innerRadius={36}
                  paddingAngle={3}>
                  {propByType.map((entry, i) => <Cell key={i} fill={entry.color || COLORS[i]} />)}
                </Pie>
                <Legend formatter={(value) => <span style={{fontSize:12,color:'var(--text-secondary)'}}>{value}</span>} />
                <Tooltip contentStyle={{background:'var(--card-bg)',border:'1px solid var(--border)',borderRadius:10,fontSize:13}} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div style={{textAlign:'center',padding:40,color:'var(--text-muted)'}}>No property data yet</div>}
        </div>
      </div>

      {/* Bottom Row */}
      <div className={styles.bottomRow}>
        {/* Recent Leads */}
        <div className="card" style={{flex:'1.3',padding:24}}>
          <div className={styles.tableHeader}>
            <h3 className={styles.chartTitle}>Recent Leads</h3>
            <Link to="/leads" className="btn btn-ghost btn-sm">View All →</Link>
          </div>
          {data?.recent?.leads?.length > 0 ? (
            <div className="table-wrap" style={{marginTop:16}}>
              <table>
                <thead><tr><th>Name</th><th>Phone</th><th>Type</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {data.recent.leads.map(l => (
                    <tr key={l._id}>
                      <td><strong>{l.name}</strong></td>
                      <td style={{fontSize:13}}>{l.phone}</td>
                      <td><span className="badge badge-info" style={{fontSize:10}}>{l.type}</span></td>
                      <td><span className={`badge badge-${l.status === 'new' ? 'new' : l.status === 'closed' ? 'success' : 'warning'}`} style={{fontSize:10}}>{l.status}</span></td>
                      <td style={{fontSize:12,color:'var(--text-muted)'}}>{new Date(l.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <div style={{textAlign:'center',padding:32,color:'var(--text-muted)'}}>No leads yet</div>}
        </div>

        {/* Top Properties */}
        <div className="card" style={{flex:'1',padding:24}}>
          <div className={styles.tableHeader}>
            <h3 className={styles.chartTitle}>Top Properties</h3>
            <Link to="/properties" className="btn btn-ghost btn-sm">View All →</Link>
          </div>
          <div className={styles.topPropList}>
            {data?.top?.properties?.length > 0 ? data.top.properties.map((p, i) => (
              <div key={p._id} className={styles.topPropItem}>
                <div className={styles.topPropRank} style={{background: i===0 ? '#D4AF37':i===1?'#94A3B8':i===2?'#CD7F32':'var(--bg-subtle)', color: i<=2?'white':'var(--text-muted)'}}>
                  {i+1}
                </div>
                <div className={styles.topPropInfo}>
                  <div className={styles.topPropName}>{p.title}</div>
                  <div className={styles.topPropMeta}>👁 {p.views} views · 📩 {p.inquiries} inquiries</div>
                </div>
              </div>
            )) : <div style={{textAlign:'center',padding:32,color:'var(--text-muted)'}}>No properties yet</div>}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{padding:24}}>
        <h3 className={styles.chartTitle} style={{marginBottom:16}}>Quick Actions</h3>
        <div className={styles.quickActions}>
          {[
            { label:'+ Add Property',    icon:'🏠', color:'#1a3c5e', action:()=>navigate('/properties/new') },
            { label:'View All Leads',    icon:'📋', color:'#D4AF37', action:()=>navigate('/leads') },
            { label:'Site Visits',       icon:'📅', color:'#16A34A', action:()=>navigate('/visits') },
            { label:'Manage Properties', icon:'⚙️', color:'#7C3AED', action:()=>navigate('/properties') },
          ].map((a,i) => (
            <button key={i} className={styles.quickAction} style={{'--qa-color':a.color}} onClick={a.action}>
              <span style={{fontSize:18}}>{a.icon}</span> {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
