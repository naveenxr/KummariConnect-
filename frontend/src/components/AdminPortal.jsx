import React from 'react';
import { Users, Ticket, ShieldAlert, ShoppingCart, TrendingUp, CheckCircle, RefreshCw, Layers } from 'lucide-react';
import { MOCK_ADMIN_STATS } from '../data/mockData';

export default function AdminPortal({ lang }) {
  return (
    <div className="container section-padding">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <div className="badge badge-navy" style={{ marginBottom: '0.5rem' }}>
            <Layers size={14} /> KANNYAKUMARI TOURISM AUTHORITY PORTAL
          </div>
          <h1 className="section-title">
            {lang === 'EN' ? 'Admin & Operations Control' : 'நிர்வாக கட்டுப்பாட்டு மையம்'}
          </h1>
          <p className="section-desc">
            {lang === 'EN' ? 'Real-time overview of visitor volume, ferry ticketing, guide approvals, and artisan sales.' : 'சுற்றுலா மேலாண்மை மற்றும் தரவு பகுப்பாய்வு.'}
          </p>
        </div>

        <button className="btn-outline">
          <RefreshCw size={16} /> Sync Database
        </button>
      </div>

      {/* STATS METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #3B82F6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.85rem', fontWeight: '600' }}>
            TOTAL VISITORS TODAY <Users size={18} color="#3B82F6" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0B2545', margin: '0.5rem 0' }}>
            {MOCK_ADMIN_STATS.totalVisitorsToday.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: '700' }}>
            ↑ 14% higher than yesterday
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #FF6B4A' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.85rem', fontWeight: '600' }}>
            FERRY TICKETS ISSUED <Ticket size={18} color="#FF6B4A" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0B2545', margin: '0.5rem 0' }}>
            {MOCK_ADMIN_STATS.ferryTicketsIssued.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Avg Queue Time: 12 mins
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #10B981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.85rem', fontWeight: '600' }}>
            ACTIVE GUIDES ON DUTY <ShieldAlert size={18} color="#10B981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0B2545', margin: '0.5rem 0' }}>
            {MOCK_ADMIN_STATS.activeGuidesOnDuty}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#F59E0B', fontWeight: '700' }}>
            4 Guide approvals pending
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #F59E0B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.85rem', fontWeight: '600' }}>
            ARTISAN SALES (MONTH) <TrendingUp size={18} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0B2545', margin: '0.5rem 0' }}>
            {MOCK_ADMIN_STATS.marketplaceSalesMonth}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: '700' }}>
            100% Direct to Artisan SHGs
          </div>
        </div>
      </div>

      {/* RECENT TRANSACTIONS TABLE */}
      <div className="card" style={{ padding: '1.8rem' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#0B2545', fontWeight: '700', marginBottom: '1.2rem' }}>
          Live Express API Booking Feed
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#64748B' }}>
              <th style={{ padding: '0.8rem' }}>Booking ID</th>
              <th style={{ padding: '0.8rem' }}>Customer Name</th>
              <th style={{ padding: '0.8rem' }}>Service Type</th>
              <th style={{ padding: '0.8rem' }}>Date</th>
              <th style={{ padding: '0.8rem' }}>Amount</th>
              <th style={{ padding: '0.8rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ADMIN_STATS.recentBookings.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '1rem 0.8rem', fontWeight: '700', color: '#FF6B4A' }}>{b.id}</td>
                <td style={{ padding: '1rem 0.8rem', fontWeight: '600', color: '#0B2545' }}>{b.name}</td>
                <td style={{ padding: '1rem 0.8rem' }}>{b.type}</td>
                <td style={{ padding: '1rem 0.8rem', color: '#64748B' }}>{b.date}</td>
                <td style={{ padding: '1rem 0.8rem', fontWeight: '700' }}>{b.amount}</td>
                <td style={{ padding: '1rem 0.8rem' }}>
                  <span className="badge badge-coral" style={{ background: '#D1FAE5', color: '#065F46' }}>
                    <CheckCircle size={12} /> {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
