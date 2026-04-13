import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { dashboardAPI, formatPrice } from '../utils/api';
import styles from './Dashboard.module.css';

const COLORS = ['#1a3c5e', '#c8963e', '#38a169', '#3182ce', '#e53e3e'];

const STAT_CONFIG = [
  { key: 'activeProperties', label: 'Active Properties', icon: '🏠', color: '#1a3c5e', sub: key => `of ${key} total` },
  { key: 'totalLeads', label: 'Total Leads', icon: '📋', color: '#c8963e', sub: key => `${key} new` },
  { key: 'siteVisits', label: 'Site Visits', icon: '📅', color: '#38a169', sub: () => 'booked' },
  { key: 'leadsThisMonth', label: 'Leads This Month', icon: '📈', color: '#3182ce', sub: key => `${key > 0 ? '+' : ''}${key}% vs last month` },
];

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

  const stats = data ? [
    { ...STAT_CONFIG[0], value: data.properties.active, subVal: data.properties.total },
    { ...STAT_CONFIG[1], value: data.leads.total, subVal: data.leads.new },
    { ...STAT_CONFIG[2], value: data.leads.siteVisits, subVal: null },
    { ...STAT_CONFIG[3], value: data.leads.thisMonth, subVal: data.leads.growth },
  ] : [];

  const propByType = data?.properties?.byType?.map(t => ({
    name: t._id?.replace('-', ' ') || 'unknown',
    value: t.count
  })) || [];

  const leadByStatus = data?.leads?.byStatus?.map(s => ({
    name: s._id,
    count: s.count
  })) || [];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Welcome back — here's what's happening today</div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/properties/new')}>
          + Add Property
        </button>
      </div>

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        {stats.map((s, i) => (
          <div key={i} className={styles.statCard} style={{'--accent-color': s.color}}>
            <div className={styles.statTop}>
              <div className={styles.statIconWrap}>{s.icon}</div>
              <div className={styles.statGrow} style={{color: s.subVal > 0 ? 'var(--success)' : 'var(--text-muted)'}}>
                {i === 3 ? `${s.subVal > 0 ? '+' : ''}${s.subVal}%` : ''}
              </div>
            </div>
            <div className={styles.statValue}>{s.value?.toLocaleString()}</div>
            <div className={styles.statLabel}>{s.label}</div>
            {i === 0 && <div className={styles.statSub}>of {data.properties.total} total</div>}
            {i === 1 && <div className={styles.statSub}>{data.leads.new} new unread</div>}
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className={styles.chartsRow}>
        {/* Leads by Status */}
        <div className="card" style={{flex: '1.2'}}>
          <h3 className={styles.chartTitle}>Leads by Status</h3>
          {leadByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={leadByStatus} margin={{top:10,right:10,bottom:0,left:-10}}>
                <XAxis dataKey="name" tick={{fontSize:12}} />
                <YAxis tick={{fontSize:12}} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--primary)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div style={{textAlign:'center',padding:40,color:'var(--text-muted)'}}>No data yet</div>}
        </div>

        {/* Properties by Type */}
        <div className="card" style={{flex: '1'}}>
          <h3 className={styles.chartTitle}>Properties by Type</h3>
          {propByType.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={propByType} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" label={({name,value}) => `${value}`}>
                  {propByType.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div style={{textAlign:'center',padding:40,color:'var(--text-muted)'}}>No data yet</div>}
        </div>
      </div>

      {/* Bottom Row */}
      <div className={styles.bottomRow}>
        {/* Recent Leads */}
        <div className="card" style={{flex:1.4}}>
          <div className={styles.tableHeader}>
            <h3 className={styles.chartTitle} style={{marginBottom:0}}>Recent Leads</h3>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/leads')}>View All</button>
          </div>
          {data?.recent?.leads?.length > 0 ? (
            <div className="table-wrap" style={{marginTop:16}}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th><th>Phone</th><th>Type</th><th>Property</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent.leads.map(lead => (
                    <tr key={lead._id}>
                      <td><strong>{lead.name}</strong></td>
                      <td>{lead.phone}</td>
                      <td><span className="badge badge-info">{lead.type}</span></td>
                      <td style={{maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                        {lead.propertyTitle || lead.property?.title || '—'}
                      </td>
                      <td><span className={`badge badge-${lead.status === 'new' ? 'new' : lead.status === 'closed' ? 'success' : 'contacted'}`}>{lead.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <div className="empty-state" style={{padding:32}}><p>No leads yet</p></div>}
        </div>

        {/* Top Properties */}
        <div className="card" style={{flex:1}}>
          <div className={styles.tableHeader}>
            <h3 className={styles.chartTitle} style={{marginBottom:0}}>Top Properties</h3>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/properties')}>View All</button>
          </div>
          {data?.top?.properties?.length > 0 ? (
            <div className={styles.topPropList}>
              {data.top.properties.map((p, i) => (
                <div key={p._id} className={styles.topPropItem}>
                  <div className={styles.topPropRank}>{i + 1}</div>
                  <div className={styles.topPropInfo}>
                    <div className={styles.topPropName}>{p.title}</div>
                    <div className={styles.topPropMeta}>{p.propertyType} · {p.views} views · {p.inquiries} inquiries</div>
                  </div>
                </div>
              ))}
            </div>
          ) : <div className="empty-state" style={{padding:32}}><p>No properties yet</p></div>}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        {[
          { label: '+ New Property', icon: '🏠', action: () => navigate('/properties/new'), color: 'var(--primary)' },
          { label: 'View All Leads', icon: '📋', action: () => navigate('/leads'), color: 'var(--accent)' },
          { label: 'Site Visits', icon: '📅', action: () => navigate('/visits'), color: 'var(--success)' },
          { label: '🌐 View Website', icon: '', action: () => window.open('http://localhost:3000', '_blank'), color: 'var(--info)' },
        ].map(a => (
          <button key={a.label} onClick={a.action} className={styles.quickAction} style={{'--qa-color': a.color}}>
            <span>{a.icon}</span> {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
