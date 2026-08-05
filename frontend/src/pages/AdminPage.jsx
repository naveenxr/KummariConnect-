import React, { useState } from 'react';
import { API_BASE_URL } from '../services/api';
import { 
  LayoutDashboard, 
  Ticket, 
  MapPin, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Bell, 
  User, 
  Calendar, 
  Clock, 
  ArrowUpRight, 
  Search, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Map, 
  DollarSign, 
  ChevronRight,
  Filter,
  Download,
  AlertCircle
} from 'lucide-react';

export default function AdminPage({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAvailable, setIsAvailable] = useState(true);
  const [bookingFilter, setBookingFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationMsg, setNotificationMsg] = useState('');

  // Initial Bookings Data from Figma Prototype
  const [bookings, setBookings] = useState([
    { id: '#001', customer: 'The Miller Family', trip: 'Coastal Heritage Walk', people: '4 People', location: 'Sunset Point Gate', status: 'ONGOING', revenue: 2850, date: 'Today 05:30 PM' },
    { id: '#002', customer: 'Sarah Chen', trip: 'Eco-Photography Tour', people: '1 Person', location: 'Main Ferry Terminal', status: 'UPCOMING', revenue: 1200, date: 'Tomorrow 06:30 AM' },
    { id: '#003', customer: 'Raj Kumar', trip: 'Sunrise Trek', people: '2 People', location: 'Vivekananda Rock', status: 'ONGOING', revenue: 1800, date: 'Today 05:00 AM' },
    { id: '#004', customer: 'Emma Williams', trip: 'Temple Circuit Tour', people: '3 People', location: 'Padmanabhapuram Palace', status: 'UPCOMING', revenue: 2400, date: '2026-08-06' },
    { id: '#005', customer: 'David & Lisa Park', trip: 'Beach Conservation Walk', people: '2 People', location: 'Kanyakumari Beach', status: 'COMPLETED', revenue: 1600, date: '2026-08-03' },
    { id: '#006', customer: 'Amit Patel Group', trip: 'Full Day Eco Tour', people: '6 People', location: 'Multiple Locations', status: 'UPCOMING', revenue: 4200, date: '2026-08-07' },
    { id: '#007', customer: 'Zhang Wei', trip: 'Bird Watching Experience', people: '1 Person', location: 'Muttom Wetlands', status: 'COMPLETED', revenue: 900, date: '2026-08-02' },
    { id: '#008', customer: 'Roberts Family', trip: 'Sunset Cruise', people: '5 People', location: 'Ferry Terminal', status: 'UPCOMING', revenue: 3500, date: '2026-08-08' }
  ]);

  // Guide Applicants Data for Verification Tab
  const [applicants, setApplicants] = useState([
    { id: 'GAP-401', name: 'Ramesh Kumar', experience: '6 Years', language: 'Tamil, English', docsVerified: true, status: 'Pending Review' },
    { id: 'GAP-402', name: 'Anitha Rajan', experience: '4 Years', language: 'Tamil, Malayalam, English', docsVerified: true, status: 'Pending Review' },
    { id: 'GAP-403', name: 'Vignesh M.', experience: '2 Years', language: 'Tamil, Hindi', docsVerified: false, status: 'Action Needed' }
  ]);

  // Destination Places Data
  const places = [
    { name: 'Vivekananda Rock Memorial', crowdStatus: 'High', activeVisitors: 1420, maxCapacity: 2000, passPrice: '₹75' },
    { name: 'Thiruvalluvar Statue', crowdStatus: 'Moderate', activeVisitors: 890, maxCapacity: 1500, passPrice: '₹50' },
    { name: 'Sunset Point & Promenade', crowdStatus: 'Very High', activeVisitors: 3200, maxCapacity: 4000, passPrice: 'Free' },
    { name: 'Muttom Lighthouse & Beach', crowdStatus: 'Low', activeVisitors: 240, maxCapacity: 1000, passPrice: '₹20' },
    { name: 'Padmanabhapuram Palace', crowdStatus: 'Moderate', activeVisitors: 610, maxCapacity: 1200, passPrice: '₹100' }
  ];

  // Certified Guides Data
  const guides = [
    { name: 'Ramesh Kumar', rating: '4.9', tours: 340, status: 'On Duty', phone: '+91 98765 43210' },
    { name: 'Anitha Rajan', rating: '4.95', tours: 412, status: 'On Duty', phone: '+91 98765 88901' },
    { name: 'Srinivasan K.', rating: '4.85', tours: 198, status: 'On Break', phone: '+91 94431 12345' },
    { name: 'Meenakshi S.', rating: '5.0', tours: 520, status: 'On Duty', phone: '+91 98422 77654' }
  ];

  // User Submitted Support Queries & Feedback State
  const [supportTickets, setSupportTickets] = useState([]);

  // Fetch support tickets from Express API
  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/support/tickets`);
      const data = await res.json();
      if (data.success) {
        setSupportTickets(data.tickets);
      }
    } catch {
      // Fallback ticket
      setSupportTickets([
        {
          ticketId: 'TKT-89012',
          userName: 'Karthik Raja',
          userEmail: 'karthik.r@gmail.com',
          category: 'Technical / App Difficulty',
          subject: 'OTP verification delay on Gmail',
          description: 'Received OTP after 45 seconds during register page submission.',
          urgency: 'Medium',
          rating: 4,
          status: 'IN REVIEW',
          createdAt: new Date().toISOString()
        }
      ]);
    }
  };

  React.useEffect(() => {
    fetchTickets();
  }, []);

  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    try {
      await fetch(`${API_BASE_URL}/support/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch {
      // Ignore
    }
    setSupportTickets(prev => prev.map(t => t.ticketId === ticketId ? { ...t, status: newStatus } : t));
    triggerNotification(`Ticket ${ticketId} updated to ${newStatus}`);
  };

  const handleApproveApplicant = (id) => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
    triggerNotification('Guide applicant approved successfully!');
  };

  const triggerNotification = (msg) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(''), 3000);
  };

  // Filter Bookings logic
  const filteredBookings = bookings.filter(b => {
    const matchesFilter = bookingFilter === 'All' ? true : b.status === bookingFilter.toUpperCase();
    const matchesSearch = b.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.trip.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalRevenueSum = bookings.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F4F7F5', fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#1E293B' }}>
      
      {/* =========================================================================
          LEFT SIDEBAR (Matching Figma Green Theme)
          ========================================================================= */}
      <aside style={{
        width: '260px',
        backgroundColor: '#11261D',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 16px',
        flexShrink: 0,
        boxShadow: '4px 0 24px rgba(0,0,0,0.06)'
      }}>
        <div>
          {/* Logo & Header */}
          <div style={{ padding: '0 12px 24px 12px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '24px' }}>
            <div style={{ fontSize: '0.72rem', color: '#52B788', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Eco-System Management
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
              Admin Portal
            </h2>
          </div>

          {/* Nav Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'bookings', label: 'Bookings', icon: Ticket },
              { id: 'places', label: 'Places', icon: MapPin },
              { id: 'verification', label: 'Verification', icon: ShieldCheck },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'guides', label: 'Guides List', icon: Users }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? '600' : '400',
                    backgroundColor: isActive ? '#2D6A4F' : 'transparent',
                    color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease'
                  }}
                >
                  <Icon size={18} color={isActive ? '#52B788' : 'rgba(255, 255, 255, 0.7)'} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            onClick={() => triggerNotification('Settings modal under maintenance')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              color: 'rgba(255, 255, 255, 0.7)',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Settings size={16} /> Settings
          </button>

          <button
            onClick={() => triggerNotification('Support portal connected')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              color: 'rgba(255, 255, 255, 0.7)',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <HelpCircle size={16} /> Support
          </button>

          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#F87171',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: 'none',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            <LogOut size={16} /> Exit Admin Portal
          </button>
        </div>
      </aside>

      {/* =========================================================================
          MAIN WORKSPACE CONTENT AREA
          ========================================================================= */}
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>

        {/* Global Toast Notification */}
        {notificationMsg && (
          <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            backgroundColor: '#1B4332',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '12px',
            fontSize: '0.88rem',
            fontWeight: '600',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={18} color="#52B788" /> {notificationMsg}
          </div>
        )}

        {/* =========================================================================
            TOP NAV HEADER (Kanniyakumari Eco-Travel & Status Toggle)
            ========================================================================= */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1B4332' }}>
            Kanniyakumari Eco-Travel
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Status Toggle (CURRENT STATUS: AVAILABLE) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#FFFFFF',
              padding: '6px 16px',
              borderRadius: '9999px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748B', letterSpacing: '0.05em' }}>
                CURRENT STATUS:
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: isAvailable ? '#2D6A4F' : '#64748B' }}>
                {isAvailable ? 'AVAILABLE' : 'OFF DUTY'}
              </span>
              <button
                onClick={() => setIsAvailable(!isAvailable)}
                style={{
                  width: '36px',
                  height: '20px',
                  borderRadius: '9999px',
                  backgroundColor: isAvailable ? '#2D6A4F' : '#CBD5E1',
                  border: 'none',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  position: 'absolute',
                  top: '2px',
                  left: isAvailable ? '18px' : '2px',
                  transition: 'all 0.2s ease'
                }} />
              </button>
            </div>

            {/* Notification Bell */}
            <button style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Bell size={18} color="#475569" />
            </button>

            {/* Admin Avatar */}
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#2D6A4F', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.9rem' }}>
              A
            </div>
          </div>
        </div>

        {/* =========================================================================
            VIEW 1: DASHBOARD TAB (Matching Figma Frame 10)
            ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Welcome Banner */}
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1B4332', marginBottom: '4px' }}>
                Admin Portal – Good Morning, Arjun
              </h1>
              <p style={{ fontSize: '0.92rem', color: '#64748B' }}>
                Ready for your sunrise trek to Vivekananda Rock? Monitor real-time eco-tours and guide assignments.
              </p>
            </div>

            {/* Main 2-Column Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px' }}>
              
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                
                {/* Active Bookings Section */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1B4332' }}>Active Bookings</h3>
                    <button 
                      onClick={() => setActiveTab('bookings')}
                      style={{ background: 'none', border: 'none', color: '#2D6A4F', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
                    >
                      View All History →
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Booking Card 1 */}
                    <div style={{ backgroundColor: '#F8FAF9', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#D8F3DC', color: '#2D6A4F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Users size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', color: '#1E293B', fontSize: '0.95rem' }}>The Miller Family</div>
                          <div style={{ fontSize: '0.82rem', color: '#64748B' }}>4 People • Coastal Heritage Walk</div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ backgroundColor: '#E8F5E9', color: '#2D6A4F', fontSize: '0.72rem', fontWeight: '700', padding: '4px 10px', borderRadius: '9999px', letterSpacing: '0.04em' }}>
                          STARTING IN 45M
                        </span>
                        <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                          <MapPin size={12} /> Sunset Point Gate
                        </div>
                      </div>
                    </div>

                    {/* Booking Card 2 */}
                    <div style={{ backgroundColor: '#F8FAF9', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', color: '#1E293B', fontSize: '0.95rem' }}>Sarah Chen</div>
                          <div style={{ fontSize: '0.82rem', color: '#64748B' }}>1 Person • Eco-Photography Tour</div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', fontSize: '0.72rem', fontWeight: '700', padding: '4px 10px', borderRadius: '9999px', letterSpacing: '0.04em' }}>
                          TOMORROW 06:30 AM
                        </span>
                        <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                          <MapPin size={12} /> Main Ferry Terminal
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Access Visual Cards Grid (Matching Figma Images) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  
                  {/* Card 1: Traveler Documents */}
                  <div 
                    onClick={() => setActiveTab('verification')}
                    style={{
                      borderRadius: '20px',
                      backgroundImage: 'linear-gradient(180deg, rgba(17, 38, 29, 0.4) 0%, rgba(17, 38, 29, 0.9) 100%), url("https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      padding: '24px',
                      color: '#FFFFFF',
                      height: '160px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.08)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <FileText size={18} color="#52B788" />
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Traveler Documents</h4>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.85)' }}>Access permits and ID scans</p>
                  </div>

                  {/* Card 2: Route Maps */}
                  <div 
                    onClick={() => setActiveTab('places')}
                    style={{
                      borderRadius: '20px',
                      backgroundImage: 'linear-gradient(180deg, rgba(17, 38, 29, 0.4) 0%, rgba(17, 38, 29, 0.9) 100%), url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      padding: '24px',
                      color: '#FFFFFF',
                      height: '160px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.08)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <Map size={18} color="#52B788" />
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Route Maps</h4>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.85)' }}>Interactive eco-trail navigation</p>
                  </div>

                </div>

              </div>

              {/* Right Column / Widgets */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Upcoming Schedule Mini Calendar */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1B4332' }}>Upcoming Schedule</h4>
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>‹ ›</span>
                  </div>

                  {/* Dates Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', fontSize: '0.75rem' }}>
                    {['28', '29', '30', '1', '2', '3', '4'].map((d, i) => (
                      <div 
                        key={i} 
                        style={{
                          padding: '6px 8px',
                          borderRadius: '8px',
                          backgroundColor: d === '2' ? '#2D6A4F' : 'transparent',
                          color: d === '2' ? '#FFFFFF' : '#475569',
                          fontWeight: d === '2' ? '700' : '500'
                        }}
                      >
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Today's Timeline */}
                  <div style={{ marginTop: '20px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                      TODAY'S TIMELINE
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem' }}>
                        <span style={{ fontWeight: '700', color: '#2D6A4F', width: '42px' }}>05:00</span>
                        <div>
                          <div style={{ fontWeight: '700', color: '#1E293B' }}>Sunrise Gathering</div>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Venkateswara Temple Point</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem' }}>
                        <span style={{ fontWeight: '700', color: '#2D6A4F', width: '42px' }}>09:30</span>
                        <div>
                          <div style={{ fontWeight: '700', color: '#1E293B' }}>Coastal Ecosystem Walk</div>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Muttom Beach Cluster</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Earnings Card */}
                <div style={{ backgroundColor: '#EBF6F0', borderRadius: '20px', padding: '20px', border: '1px solid #D8E6E0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#2D6A4F', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    MONTHLY EARNINGS
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '8px 0' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1B4332' }}>₹24,850</span>
                    <span style={{ fontSize: '0.78rem', color: '#2D6A4F', fontWeight: '700' }}>+12% vs last month</span>
                  </div>

                  <button 
                    onClick={() => triggerNotification('Payout request initialized!')}
                    style={{
                      width: '100%',
                      backgroundColor: '#FFFFFF',
                      color: '#2D6A4F',
                      border: '1px solid #2D6A4F',
                      borderRadius: '10px',
                      padding: '10px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      marginTop: '8px'
                    }}
                  >
                    Withdraw Funds
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 2: BOOKINGS TAB (Matching Figma "Admin Booking Dashboard")
            ========================================================================= */}
        {activeTab === 'bookings' && (
          <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#1B4332' }}>Booking Dashboard</h1>
                <p style={{ fontSize: '0.88rem', color: '#64748B' }}>Monitor and manage all trip bookings in real-time</p>
              </div>

              <button 
                onClick={() => setActiveTab('dashboard')}
                style={{ background: 'none', border: 'none', color: '#2D6A4F', fontWeight: '600', fontSize: '0.88rem', cursor: 'pointer' }}
              >
                ← Back to Dashboard
              </button>
            </div>

            {/* Top Stat Metrics Grid (4 Cards from Figma) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
              
              {/* Stat Card 1: TOTAL BOOKINGS */}
              <div style={{ backgroundColor: '#E8F5E9', padding: '20px', borderRadius: '16px', border: '1px solid #C8E6C9' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#2D6A4F', textTransform: 'uppercase' }}>TOTAL BOOKINGS</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1B4332', margin: '4px 0' }}>8</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>All time bookings</div>
              </div>

              {/* Stat Card 2: ONGOING TRIPS */}
              <div style={{ backgroundColor: '#ECFDF5', padding: '20px', borderRadius: '16px', border: '1px solid #A7F3D0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase' }}>ONGOING TRIPS</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#065F46', margin: '4px 0' }}>2</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Currently active</div>
              </div>

              {/* Stat Card 3: UPCOMING TRIPS */}
              <div style={{ backgroundColor: '#F1F5F9', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>UPCOMING TRIPS</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1E293B', margin: '4px 0' }}>4</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Scheduled soon</div>
              </div>

              {/* Stat Card 4: TOTAL REVENUE */}
              <div style={{ backgroundColor: '#EFF6FF', padding: '20px', borderRadius: '16px', border: '1px solid #BFDBFE' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#1D4ED8', textTransform: 'uppercase' }}>TOTAL REVENUE</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1E3A8A', margin: '4px 0' }}>₹18.4k</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>This month</div>
              </div>

            </div>

            {/* Currently Ongoing Trips Panel */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px', border: '1px solid #E2E8F0', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1B4332' }}>Currently Ongoing Trips</h3>
                <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', fontSize: '0.75rem', fontWeight: '700', padding: '4px 12px', borderRadius: '9999px' }}>
                  2 Active
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ backgroundColor: '#F8FAF9', borderRadius: '14px', padding: '16px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#D8F3DC', color: '#2D6A4F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>The Miller Family</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>4 People • Coastal Heritage Walk</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ backgroundColor: '#DCFCE7', color: '#166534', fontSize: '0.7rem', fontWeight: '700', padding: '3px 8px', borderRadius: '6px' }}>
                      STARTING IN 45M
                    </span>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '3px' }}>Sunset Point Gate</div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#F8FAF9', borderRadius: '14px', padding: '16px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Raj Kumar</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>2 People • Sunrise Trek</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ backgroundColor: '#DCFCE7', color: '#166534', fontSize: '0.7rem', fontWeight: '700', padding: '3px 8px', borderRadius: '6px' }}>
                      STARTED 2H AGO
                    </span>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '3px' }}>Vivekananda Rock</div>
                  </div>
                </div>
              </div>
            </div>

            {/* All Bookings Table View */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
              
              {/* Table Controls Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1B4332' }}>All Bookings</h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Search input */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#F8FAF9', border: '1px solid #E2E8F0', padding: '6px 14px', borderRadius: '9999px' }}>
                    <Search size={14} color="#94A3B8" />
                    <input 
                      type="text" 
                      placeholder="Search bookings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.82rem' }}
                    />
                  </div>

                  {/* Filter Pills */}
                  <div style={{ display: 'flex', backgroundColor: '#F1F5F9', padding: '3px', borderRadius: '10px', gap: '2px' }}>
                    {['All', 'Ongoing', 'Upcoming', 'Completed'].map(f => (
                      <button
                        key={f}
                        onClick={() => setBookingFilter(f)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: bookingFilter === f ? '700' : '500',
                          backgroundColor: bookingFilter === f ? '#2D6A4F' : 'transparent',
                          color: bookingFilter === f ? '#FFFFFF' : '#64748B',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #F1F5F9', color: '#94A3B8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '12px' }}>ID</th>
                      <th style={{ padding: '12px' }}>Customer & Trip</th>
                      <th style={{ padding: '12px' }}>People</th>
                      <th style={{ padding: '12px' }}>Location</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                        <td style={{ padding: '14px 12px', fontWeight: '700', color: '#2D6A4F' }}>{b.id}</td>
                        <td style={{ padding: '14px 12px' }}>
                          <div style={{ fontWeight: '700', color: '#1E293B' }}>{b.customer}</div>
                          <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{b.trip}</div>
                        </td>
                        <td style={{ padding: '14px 12px', color: '#475569' }}>{b.people}</td>
                        <td style={{ padding: '14px 12px', color: '#64748B' }}>{b.location}</td>
                        <td style={{ padding: '14px 12px' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: '800',
                            padding: '4px 10px',
                            borderRadius: '9999px',
                            backgroundColor: b.status === 'ONGOING' ? '#DCFCE7' : b.status === 'UPCOMING' ? '#E0F2FE' : '#F1F5F9',
                            color: b.status === 'ONGOING' ? '#15803D' : b.status === 'UPCOMING' ? '#0369A1' : '#475569'
                          }}>
                            {b.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 12px', fontWeight: '700', textAlign: 'right', color: '#1E293B' }}>
                          ₹{b.revenue.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Summary Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F1F5F9', fontSize: '0.85rem', color: '#64748B' }}>
                <div>Showing {filteredBookings.length} of {bookings.length} bookings</div>
                <div style={{ fontWeight: '700', color: '#2D6A4F', fontSize: '0.95rem' }}>
                  Total Revenue: ₹{totalRevenueSum.toLocaleString('en-IN')}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 3: PLACES TAB
            ========================================================================= */}
        {activeTab === 'places' && (
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#1B4332', marginBottom: '8px' }}>Eco-Destinations & Pass Quota</h1>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '24px' }}>Real-time crowd meter and visitor limits for Kanniyakumari heritage sites.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat( auto-fit, minmax(280px, 1fr) )', gap: '20px' }}>
              {places.map((p, idx) => (
                <div key={idx} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1B4332' }}>{p.name}</h3>
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', backgroundColor: p.crowdStatus === 'High' || p.crowdStatus === 'Very High' ? '#FEE2E2' : '#DCFCE7', color: p.crowdStatus === 'High' || p.crowdStatus === 'Very High' ? '#991B1B' : '#166534' }}>
                      {p.crowdStatus} Crowd
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '8px' }}>
                    Active Visitors: <strong style={{ color: '#1E293B' }}>{p.activeVisitors}</strong> / {p.maxCapacity}
                  </div>

                  {/* Progress bar */}
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden', marginBottom: '14px' }}>
                    <div style={{ width: `${(p.activeVisitors / p.maxCapacity) * 100}%`, height: '100%', backgroundColor: p.activeVisitors / p.maxCapacity > 0.8 ? '#EF4444' : '#2D6A4F', borderRadius: '9999px' }} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span>Entry Pass: <strong>{p.passPrice}</strong></span>
                    <button 
                      onClick={() => triggerNotification(`Quota updated for ${p.name}`)}
                      style={{ backgroundColor: '#F8FAF9', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '4px 10px', cursor: 'pointer', fontWeight: '600', color: '#2D6A4F' }}
                    >
                      Adjust Limit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 4: VERIFICATION & SUPPORT TAB
            ========================================================================= */}
        {activeTab === 'verification' && (
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#1B4332', marginBottom: '8px' }}>Guide Identity & User Support Tickets</h1>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '24px' }}>Review guide license permits and handle user difficulty queries/feedback sent to Admin.</p>

            {/* Guide Applicants */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px', border: '1px solid #E2E8F0', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1B4332', marginBottom: '16px' }}>Guide License Applicants</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {applicants.map(a => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderRadius: '14px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAF9' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ fontWeight: '700', fontSize: '1rem' }}>{a.name}</h4>
                        <span style={{ fontSize: '0.72rem', color: '#64748B' }}>({a.id})</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '4px' }}>
                        Experience: {a.experience} • Languages: {a.language}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '4px 10px', borderRadius: '9999px', backgroundColor: a.status === 'Approved' ? '#DCFCE7' : '#FEF3C7', color: a.status === 'Approved' ? '#166534' : '#92400E' }}>
                        {a.status}
                      </span>
                      {a.status !== 'Approved' && (
                        <button
                          onClick={() => handleApproveApplicant(a.id)}
                          style={{ backgroundColor: '#2D6A4F', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}
                        >
                          Approve License
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Submitted Support Queries & Feedback (Sent from Dashboard) */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1B4332' }}>User Submitted Queries & Feedback</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748B' }}>Received from Tourist Dashboard Support modal</p>
                </div>
                <span style={{ backgroundColor: '#E0F2FE', color: '#0369A1', fontSize: '0.75rem', fontWeight: '700', padding: '4px 12px', borderRadius: '9999px' }}>
                  {supportTickets.length} Tickets
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {supportTickets.map(t => (
                  <div key={t.ticketId} style={{ backgroundColor: '#F8FAF9', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#166534' }}>#{t.ticketId}</span>
                        <span style={{ backgroundColor: '#DCFCE7', color: '#166534', fontSize: '0.72rem', fontWeight: '800', padding: '2px 8px', borderRadius: '9999px' }}>
                          {t.category}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Urgency: {t.urgency}</span>
                      </div>

                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        backgroundColor: t.status === 'RESOLVED' ? '#DCFCE7' : t.status === 'IN PROGRESS' ? '#E0F2FE' : '#FEF3C7',
                        color: t.status === 'RESOLVED' ? '#166534' : t.status === 'IN PROGRESS' ? '#0369A1' : '#92400E'
                      }}>
                        {t.status}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>{t.subject}</h4>
                    <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: '1.5', marginBottom: '12px' }}>
                      {t.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '10px', fontSize: '0.8rem', color: '#64748B' }}>
                      <div>
                        Submitted By: <strong>{t.userName}</strong> ({t.userEmail}) • Rating: {'⭐'.repeat(t.rating || 5)}
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        {t.status !== 'IN PROGRESS' && t.status !== 'RESOLVED' && (
                          <button
                            onClick={() => handleUpdateTicketStatus(t.ticketId, 'IN PROGRESS')}
                            style={{ backgroundColor: '#E0F2FE', color: '#0369A1', border: 'none', borderRadius: '8px', padding: '4px 10px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}
                          >
                            Set In Progress
                          </button>
                        )}
                        {t.status !== 'RESOLVED' && (
                          <button
                            onClick={() => handleUpdateTicketStatus(t.ticketId, 'RESOLVED')}
                            style={{ backgroundColor: '#166534', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '4px 10px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}
                          >
                            Mark Resolved
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 5: ANALYTICS TAB
            ========================================================================= */}
        {activeTab === 'analytics' && (
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#1B4332', marginBottom: '8px' }}>Eco-Tourism Analytics & Trends</h1>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '24px' }}>Real-time statistics on tourist throughput, guide bookings, and artisan sales.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1B4332', marginBottom: '16px' }}>Monthly Visitor Traffic</h3>
                <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '16px', paddingBottom: '10px', borderBottom: '2px solid #F1F5F9' }}>
                  {[40, 65, 80, 55, 90, 100].map((h, i) => (
                    <div key={i} style={{ flex: 1, backgroundColor: '#2D6A4F', height: `${h}%`, borderRadius: '6px 6px 0 0' }} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8', marginTop: '8px' }}>
                  <span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1B4332', marginBottom: '16px' }}>Tourist Demographic</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '20px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                      <span>Domestic Travelers (India)</span>
                      <strong>82%</strong>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#F1F5F9', borderRadius: '9999px' }}>
                      <div style={{ width: '82%', height: '100%', backgroundColor: '#2D6A4F', borderRadius: '9999px' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                      <span>International Eco-Tourists</span>
                      <strong>18%</strong>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#F1F5F9', borderRadius: '9999px' }}>
                      <div style={{ width: '18%', height: '100%', backgroundColor: '#52B788', borderRadius: '9999px' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 6: GUIDES LIST TAB
            ========================================================================= */}
        {activeTab === 'guides' && (
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#1B4332', marginBottom: '8px' }}>Certified Local Guides Roster</h1>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '24px' }}>On-duty status and contact management for verified local tour guides.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {guides.map((g, idx) => (
                <div key={idx} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1E293B' }}>{g.name}</h3>
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', backgroundColor: g.status === 'On Duty' ? '#DCFCE7' : '#FEF3C7', color: g.status === 'On Duty' ? '#166534' : '#92400E' }}>
                      {g.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '12px' }}>
                    ⭐ <strong>{g.rating}</strong> Rating • {g.tours} Completed Tours
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '16px' }}>
                    📞 {g.phone}
                  </div>

                  <button 
                    onClick={() => triggerNotification(`Direct dispatch sent to ${g.name}`)}
                    style={{ width: '100%', backgroundColor: '#F8FAF9', border: '1px solid #2D6A4F', color: '#2D6A4F', fontWeight: '600', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem' }}
                  >
                    Assign Direct Tour
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
