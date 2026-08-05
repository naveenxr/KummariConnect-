import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Ticket, 
  Trees, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Search, 
  Bell, 
  User, 
  MapPin, 
  Compass, 
  Phone, 
  Mail, 
  Calendar, 
  Star, 
  Award, 
  ArrowRight, 
  Plus, 
  ArrowLeft,
  CheckCircle2,
  Filter,
  Layers,
  Sparkles,
  Bed,
  ShieldCheck,
  CreditCard,
  Check,
  QrCode,
  Smartphone,
  Building2,
  Wallet,
  Lock,
  Download,
  Printer,
  Sparkle,
  Loader2,
  MessageSquare,
  AlertTriangle,
  Send,
  X
} from 'lucide-react';
import { API_BASE_URL } from '../services/api';
import { kanyakumariDestinations, kanyakumariEcoStays } from '../data/kanyakumariData';

export default function TouristDashboard({ user, onLogout, onBookItem, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [placeFilter, setPlaceFilter] = useState('All');
  const [stayCategoryFilter, setStayCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationMsg, setNotificationMsg] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedGuideForModal, setSelectedGuideForModal] = useState(null);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Edit Profile Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editProfileTab, setEditProfileTab] = useState('general'); // 'general' | 'password'
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  const openProfileModal = () => {
    setEditName(user?.name || '');
    setEditEmail(user?.email || '');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setProfileMsg({ type: '', text: '' });
    setProfileOtpSent(false);
    setProfileOtpDigits(['', '', '', '', '', '']);
    setEditProfileTab('general');
    setShowProfileModal(true);
  };

  // Password change OTP state
  const [profileOtpSent, setProfileOtpSent] = useState(false);
  const [profileOtpDigits, setProfileOtpDigits] = useState(['', '', '', '', '', '']);

  const handleProfileOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...profileOtpDigits];
    newDigits[index] = value.slice(-1);
    setProfileOtpDigits(newDigits);
    if (value && index < 5) {
      const next = document.getElementById(`profile-otp-${index + 1}`);
      if (next) next.focus();
    }
  };

  const handleProfileOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !profileOtpDigits[index] && index > 0) {
      const prev = document.getElementById(`profile-otp-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  // Send OTP for password change
  const handleSendPasswordOtp = async () => {
    setProfileMsg({ type: '', text: '' });
    if (!newPassword || newPassword.length < 4) {
      setProfileMsg({ type: 'error', text: 'New password must be at least 4 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setProfileMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setProfileSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/send-password-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email })
      });
      const data = await res.json();
      if (data.success) {
        setProfileOtpSent(true);
        setProfileOtpDigits(['', '', '', '', '', '']);
        setProfileMsg({ type: 'success', text: `Verification code sent to ${user?.email}. Check your inbox.` });
      } else {
        setProfileMsg({ type: 'error', text: data.message || 'Failed to send OTP.' });
      }
    } catch {
      setProfileMsg({ type: 'error', text: 'Cannot connect to server.' });
    }
    setProfileSubmitting(false);
  };

  // Verify OTP and update password
  const handleVerifyPasswordOtp = async () => {
    const otp = profileOtpDigits.join('');
    if (otp.length < 6) {
      setProfileMsg({ type: 'error', text: 'Please enter all 6 digits.' });
      return;
    }

    setProfileSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-password-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, otp, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setProfileMsg({ type: 'success', text: '🎉 Password updated successfully!' });
        if (data.user && onUpdateUser) onUpdateUser(data.user);
        triggerToast('🔒 Password changed successfully!');
        setTimeout(() => {
          setShowProfileModal(false);
          setProfileOtpSent(false);
          setNewPassword('');
          setConfirmPassword('');
        }, 1200);
      } else {
        setProfileMsg({ type: 'error', text: data.message || 'Invalid verification code.' });
      }
    } catch {
      setProfileMsg({ type: 'error', text: 'Cannot connect to server.' });
    }
    setProfileSubmitting(false);
  };

  // Save general profile info (name / email — no OTP needed)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });

    // If on password tab, handle password OTP flow
    if (editProfileTab === 'password') {
      if (!profileOtpSent) {
        handleSendPasswordOtp();
      } else {
        handleVerifyPasswordOtp();
      }
      return;
    }

    // General info update
    setProfileSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentEmail: user?.email,
          newName: editName,
          newEmail: editEmail
        })
      });
      const data = await res.json();
      if (data.success) {
        setProfileMsg({ type: 'success', text: '🎉 Profile updated successfully!' });
        if (onUpdateUser) onUpdateUser(data.user);
        triggerToast('🎉 Profile details saved!');
        setTimeout(() => setShowProfileModal(false), 1200);
      } else {
        setProfileMsg({ type: 'error', text: data.message || 'Failed to update profile.' });
      }
    } catch {
      setProfileMsg({ type: 'error', text: 'Cannot connect to server.' });
    }
    setProfileSubmitting(false);
  };

  // 5 Admin-Verified Local Tour Guides Data (Verified after Admin Credential Review)
  const verifiedGuides = [
    {
      id: 'g-1',
      badgeNo: 'TN-KK-8901',
      name: 'Rajesh Kumar',
      specialty: 'Coastal Trails & Marine Ecosystems',
      rating: '4.9',
      tours: 156,
      fee: '₹800 / tour',
      languages: ['Tamil', 'English', 'Hindi'],
      phone: '+91 98765 43210',
      email: 'rajesh.kumar@ecotourism.in',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Born and raised in Kanyakumari. Over 15 years guiding visitors through hidden coastal trails, secret beach coves, and Triveni Sangam ocean confluence walks.'
    },
    {
      id: 'g-2',
      badgeNo: 'TN-KK-8902',
      name: 'Priya Nair',
      specialty: 'Sacred Temples & Heritage Architecture',
      rating: '4.95',
      tours: 210,
      fee: '₹1,000 / tour',
      languages: ['Tamil', 'Malayalam', 'English'],
      phone: '+91 98765 88901',
      email: 'priya.nair@ecotourism.in',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      bio: 'Specialist in Bhagavathy Amman Temple mythology, Suchindram Sthanumalayan stone pillar acoustic science, and Travancore royal heritage tours.'
    },
    {
      id: 'g-3',
      badgeNo: 'TN-KK-8903',
      name: 'Anand R.',
      specialty: 'Maritime History & Chola Architecture',
      rating: '5.0',
      tours: 184,
      fee: '₹1,200 / tour',
      languages: ['Tamil', 'English'],
      phone: '+91 94431 12345',
      email: 'anand.r@ecotourism.in',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      bio: 'Deep expertise in Chola maritime history, Vattakottai oceanfront fort defense structures, and Swami Vivekananda rock meditation memorial lore.'
    },
    {
      id: 'g-4',
      badgeNo: 'TN-KK-8904',
      name: 'Meera K.',
      specialty: 'Western Ghats Trekking & Waterfalls',
      rating: '4.88',
      tours: 142,
      fee: '₹950 / tour',
      languages: ['Tamil', 'English', 'Hindi'],
      phone: '+91 98422 77654',
      email: 'meera.k@ecotourism.in',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=300&q=80',
      bio: 'Certified eco-trekking guide covering Maruthuvar medicinal hills, Pechiparai reservoir forest trails, and Thiruparappu cascading waterfalls.'
    },
    {
      id: 'g-5',
      badgeNo: 'TN-KK-8905',
      name: 'Muthuvelan K.',
      specialty: 'Catamaran Fishing & Marine Bird Watching',
      rating: '4.85',
      tours: 98,
      fee: '₹750 / tour',
      languages: ['Tamil', 'Malayalam'],
      phone: '+91 97890 33411',
      email: 'muthuvelan@ecotourism.in',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: 'Native coastal fisherman and certified marine eco-guide. Offers authentic early sunrise sea tours, local fish market walks, and bird sanctuary tours.'
    }
  ];

  // Support & Feedback Form State
  const [supportCategory, setSupportCategory] = useState('App Difficulty / Bug');
  const [supportSubject, setSupportSubject] = useState('');
  const [supportDescription, setSupportDescription] = useState('');
  const [supportUrgency, setSupportUrgency] = useState('Normal');
  const [supportRating, setSupportRating] = useState(5);
  const [supportSubmitting, setSupportSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  
  // Eco-Stays State & Workflow Steps
  // ecoStep: 'select' (Step 1) | 'payment' (Step 2) | 'razorpay_modal' | 'razorpay_processing' | 'order_loading' (5s) | 'confirmed'
  const [ecoStep, setEcoStep] = useState('select');
  const [selectedStayId, setSelectedStayId] = useState('stay-2'); // Default 'Hotel Tamilnadu'
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'wallet'
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [vpaId, setVpaId] = useState('user@upi');
  
  // Card Inputs
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('•••');
  
  // 5-Second Booking Progress Loader State
  const [orderProgress, setOrderProgress] = useState(0);
  const [loadingStatusText, setLoadingStatusText] = useState('Securing room reservation at Hotel Tamilnadu...');

  // Verified 100+ Eco-Stays Dataset
  const ecoStays = kanyakumariEcoStays;

  const filteredEcoStays = ecoStays.filter(s => {
    const matchesCat = stayCategoryFilter === 'All' ? true : s.category === stayCategoryFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (s.location && s.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Master 35+ Kanyakumari Destinations Dataset
  const hiddenPlaces = kanyakumariDestinations;

  const triggerToast = (msg) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(''), 3500);
  };

  const selectedStay = ecoStays.find(s => s.id === selectedStayId) || ecoStays[1];
  const stayNights = 3;
  const stayCost = selectedStay.price * stayNights;
  const ecoConservationFee = 1200;
  const grandTotal = stayCost + ecoConservationFee;

  // Handle Support Form Submission to Express Backend (Sent directly to Admin)
  const handleSupportFormSubmit = async (e) => {
    e.preventDefault();
    if (!supportSubject || !supportDescription) {
      triggerToast('Please provide a subject and detailed description.');
      return;
    }

    setSupportSubmitting(true);

    const payload = {
      userName: user?.name || 'Eco Traveler',
      userEmail: user?.email || 'tourist@kanyakumari.com',
      category: supportCategory,
      subject: supportSubject,
      description: supportDescription,
      urgency: supportUrgency,
      rating: supportRating
    };

    try {
      const res = await fetch(`${API_BASE_URL}/support/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setSubmittedTicket(data.ticket);
        triggerToast(`Support ticket #${data.ticketId} sent to Admin!`);
      } else {
        const fallbackTicket = { ...payload, ticketId: 'TKT-' + Math.floor(10000 + Math.random() * 90000), status: 'IN REVIEW' };
        setSubmittedTicket(fallbackTicket);
      }
    } catch {
      const fallbackTicket = { ...payload, ticketId: 'TKT-' + Math.floor(10000 + Math.random() * 90000), status: 'IN REVIEW' };
      setSubmittedTicket(fallbackTicket);
    }
    setSupportSubmitting(false);
  };

  // 5-Second Order Progress Animation Logic
  useEffect(() => {
    let interval;
    if (ecoStep === 'order_loading') {
      setOrderProgress(0);
      setLoadingStatusText(`Securing room reservation at ${selectedStay.name}...`);
      
      const startTime = Date.now();
      const duration = 5000; // 5 Seconds exact

      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
        setOrderProgress(pct);

        if (pct < 35) {
          setLoadingStatusText(`Securing room reservation at ${selectedStay.name}...`);
        } else if (pct < 75) {
          setLoadingStatusText('Allocating certified local guide (Rajesh Kumar)...');
        } else {
          setLoadingStatusText('Registering 12kg CO2 offset certificate & issuing digital pass...');
        }

        if (pct >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setEcoStep('confirmed');
            triggerToast(`🎉 Booking Order Confirmed for ${selectedStay.name}!`);
          }, 300);
        }
      }, 50);
    }
    return () => clearInterval(interval);
  }, [ecoStep, selectedStay.name]);

  // Handle Razorpay Payment Start
  const handleRazorpayPayClick = () => {
    setEcoStep('razorpay_processing');
    setTimeout(() => {
      setEcoStep('order_loading');
    }, 2200);
  };

  const filteredPlaces = hiddenPlaces.filter(p => {
    const pTitle = p.title || p.name || '';
    const pCat = p.category || '';
    const pLoc = p.location || '';
    const matchesFilter = placeFilter === 'All' ? true : 
                          pCat.toLowerCase().includes(placeFilter.toLowerCase()) || 
                          placeFilter.toLowerCase().includes(pCat.toLowerCase());
    const matchesSearch = pTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pLoc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F4F7F5', fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#1E293B' }}>
      
      {/* =========================================================================
          LEFT SIDEBAR (Matching Screenshots 1–4)
          ========================================================================= */}
      <aside style={{
        width: '260px',
        backgroundColor: '#FFFFFF',
        color: '#1E293B',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 16px',
        borderRight: '1px solid #E2E8F0',
        flexShrink: 0
      }}>
        <div>
          {/* User Profile Header in Sidebar */}
          <div style={{ padding: '0 12px 24px 12px', borderBottom: '1px solid #F1F5F9', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1B4332' }}>
              {user?.name || 'User Name'}
            </h3>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
              Eco-System Management
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '14px',
                fontSize: '0.92rem',
                fontWeight: activeTab === 'dashboard' ? '700' : '500',
                backgroundColor: activeTab === 'dashboard' ? '#DCFCE7' : 'transparent',
                color: activeTab === 'dashboard' ? '#166534' : '#64748B',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
            >
              <LayoutDashboard size={18} color={activeTab === 'dashboard' ? '#166534' : '#64748B'} />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '14px',
                fontSize: '0.92rem',
                fontWeight: activeTab === 'bookings' ? '700' : '500',
                backgroundColor: activeTab === 'bookings' ? '#DCFCE7' : 'transparent',
                color: activeTab === 'bookings' ? '#166534' : '#64748B',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
            >
              <Ticket size={18} color={activeTab === 'bookings' ? '#166534' : '#64748B'} />
              Bookings
            </button>

            <button
              onClick={() => setActiveTab('places')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '14px',
                fontSize: '0.92rem',
                fontWeight: activeTab === 'places' ? '700' : '500',
                backgroundColor: activeTab === 'places' ? '#DCFCE7' : 'transparent',
                color: activeTab === 'places' ? '#166534' : '#64748B',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
            >
              <Trees size={18} color={activeTab === 'places' ? '#166534' : '#64748B'} />
              Places
            </button>

            <button
              onClick={() => setActiveTab('guides')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '14px',
                fontSize: '0.92rem',
                fontWeight: activeTab === 'guides' ? '700' : '500',
                backgroundColor: activeTab === 'guides' ? '#DCFCE7' : 'transparent',
                color: activeTab === 'guides' ? '#166534' : '#64748B',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
            >
              <ShieldCheck size={18} color={activeTab === 'guides' ? '#166534' : '#64748B'} />
              Find Guides
            </button>
          </nav>
        </div>

        {/* Bottom Settings & Support */}
        <div style={{ paddingTop: '20px', borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            onClick={() => triggerToast('Settings preference loaded')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', fontSize: '0.86rem', color: '#64748B', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Settings size={16} /> Settings
          </button>

          <button
            onClick={() => {
              setSubmittedTicket(null);
              setShowSupportModal(true);
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', fontSize: '0.86rem', fontWeight: '600', color: '#166534', backgroundColor: '#DCFCE7', border: 'none', cursor: 'pointer' }}
          >
            <HelpCircle size={16} color="#166534" /> Support & Feedback
          </button>

          <button
            onClick={onLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', fontSize: '0.86rem', fontWeight: '600', color: '#DC2626', backgroundColor: '#FEE2E2', border: 'none', cursor: 'pointer', marginTop: '10px' }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* =========================================================================
          MAIN WORKSPACE CONTENT AREA
          ========================================================================= */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

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

        {/* Top Navbar Header */}
        <header style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '0 40px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <h2 
              onClick={() => setActiveTab('dashboard')}
              style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1B4332', cursor: 'pointer' }}
            >
              Kanniyakumari Eco-Travel
            </h2>

            <div style={{ display: 'flex', gap: '24px', fontSize: '0.9rem', fontWeight: '600' }}>
              <span 
                onClick={() => setActiveTab('places')}
                style={{
                  color: activeTab === 'places' ? '#2D6A4F' : '#64748B',
                  borderBottom: activeTab === 'places' ? '2px solid #2D6A4F' : 'none',
                  paddingBottom: '18px',
                  cursor: 'pointer'
                }}
              >
                Destinations
              </span>
              <span 
                onClick={() => setActiveTab('ecoStays')}
                style={{
                  color: activeTab === 'ecoStays' ? '#2D6A4F' : '#64748B',
                  borderBottom: activeTab === 'ecoStays' ? '2px solid #2D6A4F' : 'none',
                  paddingBottom: '18px',
                  cursor: 'pointer'
                }}
              >
                Eco-Stays
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#F1F5F9', padding: '8px 16px', borderRadius: '9999px', width: '240px' }}>
              <Search size={16} color="#94A3B8" />
              <input 
                type="text" 
                placeholder="Search eco-spots..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '100%' }}
              />
            </div>

            {/* Notification Bell */}
            <button style={{ background: '#F8FAF9', border: '1px solid #E2E8F0', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Bell size={18} color="#64748B" />
            </button>

            {/* Profile Avatar — Click to Edit Profile */}
            <div 
              onClick={openProfileModal}
              title="Edit Profile"
              style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#2D6A4F', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', border: '2px solid transparent', transition: 'border 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.border = '2px solid #52B788'}
              onMouseLeave={(e) => e.currentTarget.style.border = '2px solid transparent'}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </header>

        {/* Content Body Container */}
        <div style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>

          {/* =========================================================================
              VIEW 1: DASHBOARD TAB (Matching Screenshots 1 & 2)
              ========================================================================= */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Hero Welcome Text */}
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.45rem', fontWeight: '700', color: '#2D6A4F', marginBottom: '6px' }}>
                  Welcome back, Eco-Traveler!
                </h1>
                <p style={{ fontSize: '0.92rem', color: '#475569' }}>
                  Your journey through the Southern tip's preserved wonders continues. You've offset <strong style={{ color: '#166534' }}>12kg of CO2</strong> this month.
                </p>
              </div>

              {/* Interactive Aerial Map Banner */}
              <div style={{
                position: 'relative',
                height: '340px',
                borderRadius: '24px',
                backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.4) 100%), url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                marginBottom: '36px',
                overflow: 'hidden'
              }}>
                {/* Floating Filter Badge Top Left */}
                <div style={{
                  position: 'absolute',
                  top: '24px',
                  left: '24px',
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '16px',
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trees size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      ACTIVE FILTERS
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#1E293B' }}>
                      Hidden Places & Eco-Stays
                    </div>
                  </div>
                </div>

                {/* Floating Map Pins */}
                {[
                  { top: '22%', left: '58%' },
                  { top: '38%', left: '55%' },
                  { top: '58%', left: '60%' },
                  { top: '68%', left: '58%' }
                ].map((pin, i) => (
                  <div key={i} style={{ position: 'absolute', top: pin.top, left: pin.left, width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#FFFFFF', color: '#2D6A4F', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', cursor: 'pointer' }}>
                    <Trees size={16} />
                  </div>
                ))}

                {/* Center on My Location Button Bottom Right */}
                <button
                  onClick={() => triggerToast('Map centered on your current GPS location')}
                  style={{
                    position: 'absolute',
                    bottom: '24px',
                    right: '24px',
                    backgroundColor: '#FFFFFF',
                    color: '#166534',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '12px 20px',
                    fontSize: '0.86rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    cursor: 'pointer'
                  }}
                >
                  <Compass size={18} /> Center on My Location
                </button>
              </div>

              {/* Quick Access Section Header */}
              <div style={{ marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#2D6A4F' }}>Quick Access</h3>
              </div>

              {/* 3 Quick Access Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                
                {/* Card 1: Explore Hidden Places */}
                <div 
                  onClick={() => setActiveTab('places')}
                  style={{
                    borderRadius: '24px',
                    backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%), url("https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '24px',
                    color: '#FFFFFF',
                    height: '210px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
                  }}
                >
                  <span style={{ backgroundColor: '#166534', color: '#FFFFFF', fontSize: '0.68rem', fontWeight: '800', padding: '4px 10px', borderRadius: '9999px', width: 'fit-content', letterSpacing: '0.05em' }}>
                    TRENDING
                  </span>

                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '4px' }}>Explore Hidden Places</h4>
                    <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.85)' }}>Discover untouched coastal trails and sacred groves.</p>
                  </div>
                </div>

                {/* Card 2: View Verified Stays */}
                <div 
                  onClick={() => setActiveTab('ecoStays')}
                  style={{
                    backgroundColor: '#C7F9CC',
                    borderRadius: '24px',
                    padding: '24px',
                    color: '#166534',
                    height: '210px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '14px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bed size={20} color="#166534" />
                  </div>

                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#166534', marginBottom: '6px' }}>View Verified Stays</h4>
                    <p style={{ fontSize: '0.8rem', color: '#2D6A4F', lineHeight: '1.4', marginBottom: '16px' }}>
                      100% Eco-certified boutique hotels and farm stays.
                    </p>
                    <div style={{ fontSize: '0.86rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Browse List <ArrowRight size={16} />
                    </div>
                  </div>
                </div>

                {/* Card 3: Find Your Guide */}
                <div 
                  onClick={() => setActiveTab('guides')}
                  style={{
                    position: 'relative',
                    borderRadius: '24px',
                    backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(17,38,29,0.9) 100%), url("https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '24px',
                    color: '#FFFFFF',
                    height: '210px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
                  }}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                    <Search size={18} color="#FFFFFF" />
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '2px' }}>Find Your Guide</h4>
                    <div style={{ fontSize: '0.68rem', fontWeight: '800', color: 'rgba(255,255,255,0.75)', letterSpacing: '0.08em' }}>
                      LOCALS WHO KNOW THE LAND
                    </div>
                  </div>

                  <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={18} color="#FFFFFF" />
                  </div>
                </div>

              </div>

              {/* Global Footer */}
              <footer style={{ borderTop: '1px solid #E2E8F0', paddingTop: '28px', marginTop: '20px', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr', gap: '32px', fontSize: '0.82rem', color: '#64748B' }}>
                <div>
                  <h5 style={{ fontWeight: '700', color: '#1B4332', fontSize: '0.95rem', marginBottom: '8px' }}>Kanniyakumari Eco-Travel</h5>
                  <p style={{ lineHeight: '1.5' }}>Promoting conscious tourism at the intersection of three oceans.</p>
                </div>

                <div>
                  <h6 style={{ fontSize: '0.72rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '10px' }}>LINKS</h6>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
                  </div>
                </div>

                <div>
                  <h6 style={{ fontSize: '0.72rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '10px' }}>COMMUNITY</h6>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span>Eco-Commitment</span>
                    <span>Contact Us</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ marginTop: '16px', fontSize: '0.78rem' }}>© 2024 Kanniyakumari Tourism. Sustainably Crafted.</div>
                </div>
              </footer>
            </div>
          )}

          {/* =========================================================================
              VIEW 2: ECO-STAYS VIEW WITH MULTIPLE PAYMENT METHODS & RAZORPAY ANIMATION
              ========================================================================= */}
          {activeTab === 'ecoStays' && (
            <div>
              {/* 3-Step Progress Stepper Header */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '60px', marginBottom: '36px' }}>
                
                {/* Step 1 */}
                <div 
                  onClick={() => setEcoStep('select')}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', opacity: ecoStep === 'select' ? 1 : 0.7 }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#166534', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(22, 101, 52, 0.25)' }}>
                    <Bed size={22} />
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', letterSpacing: '0.05em' }}>SELECT STAY</div>
                  <div style={{ width: '120px', height: '3px', backgroundColor: '#166534', borderRadius: '9999px' }} />
                </div>

                {/* Step 2 */}
                <div 
                  onClick={() => setEcoStep('payment')}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', opacity: (ecoStep === 'payment' || ecoStep === 'razorpay_modal' || ecoStep === 'order_loading' || ecoStep === 'confirmed') ? 1 : 0.5 }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: (ecoStep === 'payment' || ecoStep === 'razorpay_modal' || ecoStep === 'order_loading' || ecoStep === 'confirmed') ? '#166534' : '#E2E8F0', color: (ecoStep === 'payment' || ecoStep === 'razorpay_modal' || ecoStep === 'order_loading' || ecoStep === 'confirmed') ? '#FFFFFF' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CreditCard size={20} />
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: (ecoStep === 'payment' || ecoStep === 'razorpay_modal' || ecoStep === 'order_loading' || ecoStep === 'confirmed') ? '#166534' : '#64748B', letterSpacing: '0.05em' }}>PAYMENT</div>
                  <div style={{ width: '120px', height: '3px', backgroundColor: (ecoStep === 'payment' || ecoStep === 'razorpay_modal' || ecoStep === 'order_loading' || ecoStep === 'confirmed') ? '#166534' : '#CBD5E1', borderRadius: '9999px' }} />
                </div>

                {/* Step 3 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: ecoStep === 'confirmed' ? 1 : 0.5 }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: ecoStep === 'confirmed' ? '#166534' : '#E2E8F0', color: ecoStep === 'confirmed' ? '#FFFFFF' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: ecoStep === 'confirmed' ? '#166534' : '#64748B', letterSpacing: '0.05em' }}>DATES & CONFIRMATION</div>
                  <div style={{ width: '120px', height: '3px', backgroundColor: ecoStep === 'confirmed' ? '#166534' : '#CBD5E1', borderRadius: '9999px' }} />
                </div>
              </div>

              {/* STEP 1: SELECT STAY VIEW */}
              {ecoStep === 'select' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
                  
                  {/* Left Column: Available Eco-Stays List */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                      <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1B4332' }}>
                          Available Eco-Stays ({filteredEcoStays.length})
                        </h1>
                        <p style={{ fontSize: '0.88rem', color: '#64748B' }}>100+ Verified sustainable stays & heritage resorts in Kanyakumari</p>
                      </div>
                    </div>

                    {/* Stay Category Filter Pills */}
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                      {['All', 'Beachfront', 'Heritage & Villas', 'Eco Lodge & Cabins', 'Resorts & Spa', 'Hill & Plantation Stays', 'Budget Eco Stays'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setStayCategoryFilter(cat)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '9999px',
                            fontSize: '0.78rem',
                            fontWeight: stayCategoryFilter === cat ? '700' : '500',
                            backgroundColor: stayCategoryFilter === cat ? '#166534' : '#FFFFFF',
                            color: stayCategoryFilter === cat ? '#FFFFFF' : '#475569',
                            border: stayCategoryFilter === cat ? 'none' : '1px solid #E2E8F0',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Grid of Eco-Stay Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px', maxHeight: '720px', overflowY: 'auto', paddingRight: '6px' }}>
                      {filteredEcoStays.map(stay => {
                        const isSelected = selectedStayId === stay.id;
                        return (
                          <div
                            key={stay.id}
                            style={{
                              backgroundColor: '#FFFFFF',
                              borderRadius: '20px',
                              overflow: 'hidden',
                              border: isSelected ? '2px solid #166534' : '1px solid #E2E8F0',
                              boxShadow: isSelected ? '0 8px 24px rgba(22, 101, 52, 0.12)' : '0 4px 14px rgba(0,0,0,0.03)',
                              display: 'flex',
                              flexDirection: 'column',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div style={{
                              height: '160px',
                              backgroundImage: `url("${stay.image}")`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              padding: '12px',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between'
                            }}>
                              <span style={{ backgroundColor: stay.badgeColor || '#DCFCE7', color: stay.badgeTextColor || '#166534', fontSize: '0.7rem', fontWeight: '800', padding: '4px 10px', borderRadius: '9999px', width: 'fit-content' }}>
                                🌱 {stay.badge}
                              </span>

                              {isSelected && (
                                <span style={{ alignSelf: 'center', backgroundColor: '#166534', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: '800', padding: '4px 14px', borderRadius: '9999px', letterSpacing: '0.05em' }}>
                                  SELECTED
                                </span>
                              )}
                            </div>

                            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                                  <h3 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#1E293B' }}>{stay.name}</h3>
                                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#EAB308', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                    ⭐ {stay.rating}
                                  </span>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '600', marginBottom: '6px' }}>
                                  📍 {stay.location}
                                </div>
                                <p style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: '1.4', marginBottom: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                  {stay.description}
                                </p>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                                <div>
                                  <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1E293B' }}>₹{stay.price.toLocaleString('en-IN')}</span>
                                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}> /night</span>
                                </div>

                                <button
                                  onClick={() => setSelectedStayId(stay.id)}
                                  style={{
                                    backgroundColor: isSelected ? '#166534' : '#F0FDF4',
                                    color: isSelected ? '#FFFFFF' : '#166534',
                                    border: isSelected ? 'none' : '1px solid #DCFCE7',
                                    borderRadius: '10px',
                                    padding: '6px 14px',
                                    fontSize: '0.82rem',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {isSelected ? 'Selected' : 'Select'}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Summary Column */}
                  <div>
                    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '28px', border: '1px solid #E2E8F0', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', position: 'sticky', top: '20px' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1B4332', marginBottom: '20px' }}>Booking Summary</h3>

                      <div style={{ backgroundColor: '#F8FAF9', borderRadius: '16px', padding: '14px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                        <img src={selectedStay.image} alt={selectedStay.name} style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>SELECTED STAY</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#1E293B' }}>{selectedStay.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748B' }}>2 Guests • {stayNights} Nights</div>
                        </div>
                      </div>

                      <div style={{ backgroundColor: '#F8FAF9', borderRadius: '16px', padding: '14px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={18} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>GUIDE</div>
                          <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Not selected yet</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#475569', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Stay ( {selectedStay.price.toLocaleString('en-IN')} x {stayNights} )</span>
                          <strong>{stayCost.toLocaleString('en-IN')}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Eco-Conservation Fee</span>
                          <strong>{ecoConservationFee.toLocaleString('en-IN')}</strong>
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', marginBottom: '24px' }}>
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '600', marginBottom: '4px' }}>Estimated Total</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1B4332' }}>
                            ₹{grandTotal.toLocaleString('en-IN')}
                          </span>
                          <span style={{ backgroundColor: '#DCFCE7', color: '#166534', fontSize: '0.72rem', fontWeight: '800', padding: '4px 10px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ShieldCheck size={12} /> SECURE
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setEcoStep('payment')}
                        style={{
                          width: '100%',
                          backgroundColor: '#166534',
                          color: '#FFFFFF',
                          padding: '14px',
                          borderRadius: '14px',
                          fontSize: '0.95rem',
                          fontWeight: '700',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(22, 101, 52, 0.25)'
                        }}
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: PAYMENT METHOD SELECTION VIEW */}
              {ecoStep === 'payment' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
                  
                  {/* Left Column: Multiple Payment Methods Choice */}
                  <div>
                    <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1B4332', marginBottom: '4px' }}>
                          Select Payment Method
                        </h1>
                        <p style={{ fontSize: '0.88rem', color: '#64748B' }}>
                          Choose your preferred payment gateway method
                        </p>
                      </div>

                      <button
                        onClick={() => setEcoStep('select')}
                        style={{ background: 'none', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '6px 14px', fontSize: '0.82rem', color: '#64748B', cursor: 'pointer' }}
                      >
                        ← Change Stay
                      </button>
                    </div>

                    {/* Payment Category Selector Grid (4 Options) */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
                      {[
                        { id: 'upi', label: 'UPI Instant', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
                        { id: 'card', label: 'Cards', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
                        { id: 'netbanking', label: 'Netbanking', icon: Building2, desc: 'HDFC, SBI, ICICI, Axis' },
                        { id: 'wallet', label: 'Wallets', icon: Wallet, desc: 'Amazon Pay, Paytm' }
                      ].map(m => {
                        const IconComponent = m.icon;
                        const isSelected = paymentMethod === m.id;
                        return (
                          <div
                            key={m.id}
                            onClick={() => setPaymentMethod(m.id)}
                            style={{
                              backgroundColor: '#FFFFFF',
                              borderRadius: '16px',
                              padding: '18px 14px',
                              border: isSelected ? '2px solid #166534' : '1px solid #E2E8F0',
                              backgroundColor: isSelected ? '#F0FDF4' : '#FFFFFF',
                              boxShadow: isSelected ? '0 4px 14px rgba(22, 101, 52, 0.1)' : '0 2px 8px rgba(0,0,0,0.02)',
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all 0.18s ease'
                            }}
                          >
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: isSelected ? '#166534' : '#F1F5F9', color: isSelected ? '#FFFFFF' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                              <IconComponent size={20} />
                            </div>
                            <div style={{ fontSize: '0.88rem', fontWeight: '700', color: isSelected ? '#166534' : '#1E293B', marginBottom: '2px' }}>{m.label}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{m.desc}</div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Method Details Box */}
                    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '28px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
                      
                      {/* Option 1: UPI Options */}
                      {paymentMethod === 'upi' && (
                        <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>
                            Fast UPI Payment Apps
                          </h3>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
                            {[
                              { id: 'gpay', name: 'Google Pay', icon: '🟢 GPay' },
                              { id: 'phonepe', name: 'PhonePe', icon: '🟣 PhonePe' },
                              { id: 'paytm', name: 'Paytm', icon: '🔵 Paytm' },
                              { id: 'vpa', name: 'Other VPA ID', icon: '⚡ VPA' }
                            ].map(u => (
                              <div
                                key={u.id}
                                onClick={() => setSelectedUpiApp(u.id)}
                                style={{
                                  padding: '14px',
                                  borderRadius: '14px',
                                  border: selectedUpiApp === u.id ? '2px solid #166534' : '1px solid #E2E8F0',
                                  backgroundColor: selectedUpiApp === u.id ? '#F0FDF4' : '#F8FAF9',
                                  textAlign: 'center',
                                  fontWeight: '700',
                                  fontSize: '0.86rem',
                                  color: selectedUpiApp === u.id ? '#166534' : '#475569',
                                  cursor: 'pointer'
                                }}
                              >
                                {u.icon}
                              </div>
                            ))}
                          </div>

                          <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>
                              Enter UPI ID / VPA Address
                            </label>
                            <input 
                              type="text" 
                              value={vpaId}
                              onChange={(e) => setVpaId(e.target.value)}
                              placeholder="e.g. mobileNumber@upi"
                              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Option 2: Cards */}
                      {paymentMethod === 'card' && (
                        <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>
                            Credit or Debit Card
                          </h3>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Card Number</label>
                              <input 
                                type="text" 
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
                              />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                              <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Expiry Date</label>
                                <input 
                                  type="text" 
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
                                />
                              </div>

                              <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>CVV Code</label>
                                <input 
                                  type="password" 
                                  value={cardCvv}
                                  onChange={(e) => setCardCvv(e.target.value)}
                                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Option 3: Netbanking */}
                      {paymentMethod === 'netbanking' && (
                        <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>
                            Popular Indian Banks
                          </h3>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {['HDFC Bank', 'State Bank of India (SBI)', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Bank of Baroda'].map((b, i) => (
                              <button key={i} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAF9', textAlign: 'left', fontSize: '0.86rem', fontWeight: '600', cursor: 'pointer' }}>
                                🏦 {b}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Option 4: Wallets */}
                      {paymentMethod === 'wallet' && (
                        <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>
                            Supported Digital Wallets
                          </h3>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {['Amazon Pay Wallet', 'Paytm Wallet', 'Mobikwik Wallet', 'Airtel Money'].map((w, i) => (
                              <button key={i} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAF9', textAlign: 'left', fontSize: '0.86rem', fontWeight: '600', cursor: 'pointer' }}>
                                👛 {w}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Pay Button Triggering Razorpay Modal */}
                    <button
                      onClick={() => setEcoStep('razorpay_modal')}
                      style={{
                        width: '100%',
                        backgroundColor: '#166534',
                        color: '#FFFFFF',
                        padding: '16px',
                        borderRadius: '16px',
                        fontSize: '1rem',
                        fontWeight: '800',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 6px 20px rgba(22, 101, 52, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                      }}
                    >
                      <Lock size={18} /> Pay ₹{grandTotal.toLocaleString('en-IN')} with Razorpay Gateway
                    </button>
                  </div>

                  {/* Right Summary Column */}
                  <div>
                    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '28px', border: '1px solid #E2E8F0', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', position: 'sticky', top: '20px' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1B4332', marginBottom: '20px' }}>Booking Summary</h3>

                      <div style={{ backgroundColor: '#F8FAF9', borderRadius: '16px', padding: '14px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                        <img src={selectedStay.image} alt={selectedStay.name} style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>SELECTED STAY</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#1E293B' }}>{selectedStay.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748B' }}>2 Guests • {stayNights} Nights</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#475569', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Stay ( {selectedStay.price.toLocaleString('en-IN')} x {stayNights} )</span>
                          <strong>{stayCost.toLocaleString('en-IN')}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Eco-Conservation Fee</span>
                          <strong>{ecoConservationFee.toLocaleString('en-IN')}</strong>
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '600', marginBottom: '4px' }}>Estimated Total</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1B4332' }}>
                          ₹{grandTotal.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* RAZORPAY POPUP MODAL DIALOG */}
              {ecoStep === 'razorpay_modal' && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 99999, backgroundColor: 'rgba(12, 35, 64, 0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '420px', backgroundColor: '#FFFFFF', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    
                    <div style={{ backgroundColor: '#0C2340', color: '#FFFFFF', padding: '24px', textAlign: 'center', position: 'relative' }}>
                      <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: '800', color: '#52B788', textTransform: 'uppercase', marginBottom: '4px' }}>
                        🔒 100% SECURE PAYMENT BY RAZORPAY
                      </div>
                      <h3 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '4px 0' }}>
                        ₹{grandTotal.toLocaleString('en-IN')}
                      </h3>
                      <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                        Kanniyakumari Eco-Travel • {selectedStay.name}
                      </div>

                      <button
                        onClick={() => setEcoStep('payment')}
                        style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94A3B8', fontSize: '1.2rem', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    </div>

                    <div style={{ padding: '24px' }}>
                      <div style={{ backgroundColor: '#F8FAF9', padding: '12px 16px', borderRadius: '12px', fontSize: '0.82rem', color: '#475569', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Contact: <strong>{user?.email || 'tourist@kanyakumari.com'}</strong></span>
                        <span style={{ color: '#166534', fontWeight: '700' }}>Verified</span>
                      </div>

                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '10px' }}>
                          PAYMENT METHOD SELECTED
                        </div>
                        <div style={{ padding: '14px', borderRadius: '14px', backgroundColor: '#F0FDF4', border: '1px solid #DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: '700', color: '#166534' }}>
                          <span>⚡ {paymentMethod.toUpperCase()} (UPI / Card / Bank)</span>
                          <span style={{ fontSize: '0.75rem', backgroundColor: '#166534', color: '#FFFFFF', padding: '2px 8px', borderRadius: '9999px' }}>INSTANT</span>
                        </div>
                      </div>

                      <button
                        onClick={handleRazorpayPayClick}
                        style={{
                          width: '100%',
                          backgroundColor: '#0C2340',
                          color: '#FFFFFF',
                          padding: '16px',
                          borderRadius: '14px',
                          fontSize: '1.05rem',
                          fontWeight: '800',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 8px 24px rgba(12, 35, 64, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <ShieldCheck size={20} color="#52B788" /> Pay ₹{grandTotal.toLocaleString('en-IN')} Now
                      </button>

                      <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.75rem', color: '#94A3B8' }}>
                        Powered by <strong>Razorpay</strong> • Encrypted 256-bit SSL
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* RAZORPAY PROCESSING OVERLAY ANIMATION */}
              {ecoStep === 'razorpay_processing' && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 99999, backgroundColor: 'rgba(12, 35, 64, 0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', color: '#FFFFFF' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid #52B788', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', margin: '0 auto 24px' }} />
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px' }}>Communicating with Razorpay Gateway...</h3>
                    <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>Verifying 256-bit SSL encryption & bank authorization...</p>
                  </div>
                  <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
              )}

              {/* 5-SECOND BOOKING PROGRESS LOADER VIEW */}
              {ecoStep === 'order_loading' && (
                <div style={{ maxWidth: '640px', margin: '40px auto', backgroundColor: '#FFFFFF', borderRadius: '28px', padding: '40px', textAlign: 'center', border: '1px solid #E2E8F0', boxShadow: '0 12px 36px rgba(0,0,0,0.06)' }}>
                  <div style={{ position: 'relative', width: '96px', height: '96px', margin: '0 auto 28px' }}>
                    <div style={{ width: '96px', height: '96px', borderRadius: '50%', border: '6px solid #DCFCE7', borderTopColor: '#166534', animation: 'spin 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite' }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: '800', color: '#166534' }}>
                      {orderProgress}%
                    </div>
                  </div>

                  <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1B4332', marginBottom: '8px' }}>
                    Processing Your Eco-Stay Booking
                  </h2>
                  <p style={{ fontSize: '0.94rem', color: '#64748B', marginBottom: '32px' }}>
                    Please wait while our system verifies your payment and issues your stay voucher.
                  </p>

                  <div style={{ width: '100%', height: '10px', backgroundColor: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden', marginBottom: '20px' }}>
                    <div style={{ width: `${orderProgress}%`, height: '100%', backgroundColor: '#166534', borderRadius: '9999px', transition: 'width 0.1s linear' }} />
                  </div>

                  <div style={{ backgroundColor: '#F0FDF4', borderRadius: '16px', padding: '16px 20px', border: '1px solid #DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: '700', color: '#166534' }}>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    {loadingStatusText}
                  </div>
                </div>
              )}

              {/* ORDER CONFIRMED VIEW & TICKET */}
              {ecoStep === 'confirmed' && (
                <div style={{ maxWidth: '680px', margin: '20px auto', backgroundColor: '#FFFFFF', borderRadius: '28px', padding: '40px', border: '1px solid #E2E8F0', boxShadow: '0 12px 36px rgba(0,0,0,0.06)' }}>
                  <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(22, 101, 52, 0.2)' }}>
                    <CheckCircle2 size={40} color="#166534" />
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <span style={{ backgroundColor: '#DCFCE7', color: '#166534', fontSize: '0.75rem', fontWeight: '800', padding: '4px 14px', borderRadius: '9999px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      BOOKING CONFIRMED & TAKEN
                    </span>
                    <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1B4332', marginTop: '10px', marginBottom: '4px' }}>
                      Order #BK-890421
                    </h2>
                    <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
                      Your stay voucher has been emailed to <strong>{user?.email || 'tourist@kanyakumari.com'}</strong>
                    </p>
                  </div>

                  <div style={{ backgroundColor: '#F8FAF9', borderRadius: '20px', padding: '24px', border: '1px dashed #CBD5E1', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0', marginBottom: '16px' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>STAY HOTEL</div>
                        <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1E293B' }}>{selectedStay.name}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>PAID AMOUNT</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#166534' }}>₹{grandTotal.toLocaleString('en-IN')}</div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.86rem', color: '#475569' }}>
                      <div><strong>Razorpay Txn ID:</strong> `pay_Pz92Kx8109`</div>
                      <div><strong>Duration:</strong> 2 Guests • 3 Nights</div>
                      <div><strong>Allocated Guide:</strong> Rajesh Kumar (⭐ 4.9)</div>
                      <div><strong>CO2 Offset:</strong> 12kg Certified</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                      onClick={() => triggerToast('Invoice PDF downloaded to your device!')}
                      style={{ flex: 1, backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '14px', padding: '14px', fontSize: '0.9rem', fontWeight: '700', color: '#1E293B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <Download size={18} /> Download Invoice (PDF)
                    </button>

                    <button
                      onClick={() => setActiveTab('bookings')}
                      style={{ flex: 1, backgroundColor: '#166534', color: '#FFFFFF', border: 'none', borderRadius: '14px', padding: '14px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      View in My Bookings <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* =========================================================================
              VIEW 3: MY BOOKINGS TAB (Matching Screenshots 3 & 4)
              ========================================================================= */}
          {activeTab === 'bookings' && (
            <div>
              <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1B4332', marginBottom: '4px' }}>
                  My Bookings
                </h1>
                <p style={{ fontSize: '0.92rem', color: '#64748B' }}>
                  Manage your eco-tourism experiences and connect with your guides
                </p>
              </div>

              {/* Your Allocated Guide Card Container */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '36px' }}>
                
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1B4332', marginBottom: '2px' }}>Your Allocated Guide</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '24px' }}>Expert local guide for your upcoming journey</p>

                {/* Guide Header Info */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '18px', backgroundColor: '#166534', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: '800', flexShrink: 0 }}>
                    R
                  </div>

                  <div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1E293B', marginBottom: '2px' }}>Rajesh Kumar</h4>
                    <div style={{ fontSize: '0.86rem', color: '#64748B', marginBottom: '8px' }}>Coastal Trails & Marine Ecosystems</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.84rem' }}>
                      <span style={{ color: '#EAB308', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ⭐ 4.9
                      </span>
                      <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Award size={14} color="#64748B" /> 156 tours
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio Paragraph Box */}
                <div style={{ backgroundColor: '#F8FAF9', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', fontSize: '0.9rem', color: '#475569', lineHeight: '1.6', marginBottom: '24px' }}>
                  Born and raised in Kanniyakumari, Rajesh has spent over 15 years guiding visitors through the region's hidden coastal trails and sacred groves. His passion for marine conservation and deep knowledge of local ecosystems make every tour an unforgettable learning experience.
                </div>

                {/* Languages & Expertise Badges */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>LANGUAGES</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['Tamil', 'English', 'Hindi'].map((l, i) => (
                        <span key={i} style={{ backgroundColor: '#DCFCE7', color: '#166534', fontSize: '0.78rem', fontWeight: '600', padding: '4px 12px', borderRadius: '9999px' }}>
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>EXPERTISE</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {['Marine Biology', 'Local History', 'Photography'].map((e, i) => (
                        <span key={i} style={{ backgroundColor: '#DCFCE7', color: '#166534', fontSize: '0.78rem', fontWeight: '600', padding: '4px 12px', borderRadius: '9999px' }}>
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Info Rows */}
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#475569', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Phone size={16} color="#166534" /> <strong>+91 98765 43210</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Mail size={16} color="#166534" /> rajesh.kumar@ecotourism.in
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Calendar size={16} color="#166534" /> Next available: May 18, 2026
                  </div>
                </div>

                {/* Big Green Contact Guide Button */}
                <button
                  onClick={() => setShowContactModal(true)}
                  style={{
                    width: '100%',
                    backgroundColor: '#166534',
                    color: '#FFFFFF',
                    padding: '14px',
                    borderRadius: '9999px',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(22, 101, 52, 0.25)'
                  }}
                >
                  Contact Guide
                </button>

              </div>

              {/* Previous Bookings History */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#166534', marginBottom: '2px' }}>Previous & Active Bookings</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '24px' }}>Your eco-journey history</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Latest Confirmed Booking Item */}
                  <div style={{ backgroundColor: '#F0FDF4', borderRadius: '18px', padding: '20px', border: '2px solid #DCFCE7' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#166534' }}>{selectedStay.name} (Stay Pass)</h4>
                      <span style={{ backgroundColor: '#166534', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: '800', padding: '4px 10px', borderRadius: '9999px' }}>
                        CONFIRMED #BK-890421
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#64748B', display: 'flex', gap: '20px', marginBottom: '12px' }}>
                      <span>📅 Active Trip • 3 Nights</span>
                      <span>👤 Rajesh Kumar</span>
                    </div>

                    <div style={{ borderTop: '1px solid #DCFCE7', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#166534' }}>
                      <span>Total Paid: ₹{grandTotal.toLocaleString('en-IN')}</span>
                      <span style={{ fontWeight: '700' }}>CO2 Offset: 12kg Certified</span>
                    </div>
                  </div>

                  {/* Item 1 */}
                  <div style={{ backgroundColor: '#F8FAF9', borderRadius: '18px', padding: '20px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1B4332' }}>Vivekananda Rock Memorial</h4>
                      <span style={{ backgroundColor: '#DCFCE7', color: '#166534', fontSize: '0.72rem', fontWeight: '800', padding: '4px 10px', borderRadius: '9999px' }}>
                        COMPLETED
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#64748B', display: 'flex', gap: '20px', marginBottom: '12px' }}>
                      <span>📅 Apr 15, 2024</span>
                      <span>👤 Rajesh Kumar</span>
                    </div>

                    <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569' }}>
                      <span>Duration: 3 hours</span>
                      <span style={{ fontWeight: '700', color: '#166534' }}>CO2 Offset: 2.5kg</span>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div style={{ backgroundColor: '#F8FAF9', borderRadius: '18px', padding: '20px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1B4332' }}>Thiruvalluvar Statue & Coastal Trail</h4>
                      <span style={{ backgroundColor: '#DCFCE7', color: '#166534', fontSize: '0.72rem', fontWeight: '800', padding: '4px 10px', borderRadius: '9999px' }}>
                        COMPLETED
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#64748B', display: 'flex', gap: '20px', marginBottom: '12px' }}>
                      <span>📅 Mar 22, 2024</span>
                      <span>👤 Priya Nair</span>
                    </div>

                    <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569' }}>
                      <span>Duration: 5 hours</span>
                      <span style={{ fontWeight: '700', color: '#166534' }}>CO2 Offset: 4.2kg</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* =========================================================================
              VIEW 4: PLACES TAB / HIDDEN TREASURES (Matching Screenshot 5)
              ========================================================================= */}
          {activeTab === 'places' && (
            <div>
              {/* Back to Dashboard Link */}
              <button
                onClick={() => setActiveTab('dashboard')}
                style={{ background: 'none', border: 'none', color: '#475569', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                ← Back to DashBoard
              </button>

              {/* Giant Hero Title */}
              <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1E293B', lineHeight: '1.15', marginBottom: '8px' }}>
                  Discover Kanyakumari's <br />
                  <span style={{ color: '#00B4D8' }}>Hidden Treasures</span>
                </h1>
                <p style={{ fontSize: '0.94rem', color: '#64748B', lineHeight: '1.6' }}>
                  Explore pristine beaches, ancient forts, cascading waterfalls, and sacred spots where nature meets heritage.
                </p>
              </div>

              {/* 4 Metric Overview Cards */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' }}>
                
                {/* Metric 1: All Destinations */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '16px 24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '16px', minWidth: '180px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '14px', backgroundColor: '#00C49F', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1E293B' }}>{hiddenPlaces.length}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Total Destinations</div>
                  </div>
                </div>

                {/* Metric 2: Eco Zones & Waterfalls */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '16px 24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '16px', minWidth: '180px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '14px', backgroundColor: '#00C49F', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trees size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1E293B' }}>8</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Nature & Waterfalls</div>
                  </div>
                </div>

                {/* Metric 3: Beach Spots */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '16px 24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '16px', minWidth: '180px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '14px', backgroundColor: '#00C49F', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Compass size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1E293B' }}>6</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Beach Spots</div>
                  </div>
                </div>

                {/* Metric 4: Ancient Shrines */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '16px 24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '16px', minWidth: '180px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '14px', backgroundColor: '#00C49F', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1E293B' }}>11</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Sacred Shrines</div>
                  </div>
                </div>

              </div>

              {/* Filter Pills Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '36px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.86rem', color: '#64748B', fontWeight: '600', marginRight: '4px' }}>Filter:</span>
                {['All', 'Attractions', 'Spiritual', 'Heritage', 'Nature & Waterfalls', 'Beaches', 'Hidden Spots'].map(f => (
                  <button
                    key={f}
                    onClick={() => setPlaceFilter(f)}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '9999px',
                      fontSize: '0.86rem',
                      fontWeight: placeFilter === f ? '700' : '500',
                      backgroundColor: placeFilter === f ? '#00C49F' : '#FFFFFF',
                      color: placeFilter === f ? '#FFFFFF' : '#475569',
                      border: placeFilter === f ? 'none' : '1px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Places Card Gallery */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                {filteredPlaces.map(p => {
                  const displayTitle = p.title || p.name || 'Kanyakumari Spot';
                  const displayBadge = p.badge || p.tag || p.category || 'Spot';
                  const displayPrice = p.passPrice || p.formattedPrice || (typeof p.price === 'number' ? (p.price === 0 ? 'Free' : `₹${p.price}`) : p.price || 'Free');
                  const displayBadgeColor = p.badgeColor || '#DCFCE7';
                  const displayBadgeTextColor = p.badgeTextColor || '#166534';

                  return (
                    <div
                      key={p.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      {/* Card Image */}
                      <div style={{
                        height: '200px',
                        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%), url("${p.image}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        color: '#FFFFFF'
                      }}>
                        <span style={{
                          backgroundColor: displayBadgeColor,
                          color: displayBadgeTextColor,
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          width: 'fit-content'
                        }}>
                          {displayBadge}
                        </span>

                        <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>{displayTitle}</h3>
                      </div>

                      {/* Card Details */}
                      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                            <MapPin size={14} color="#00C49F" /> {p.location}
                          </div>
                          <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: '1.5', marginBottom: '16px' }}>
                            {p.description}
                          </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '14px' }}>
                          <div>
                            <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '700' }}>ENTRY PERMIT</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1B4332' }}>{displayPrice}</div>
                          </div>

                          <button
                            onClick={() => {
                              if (onBookItem) {
                                onBookItem(p, 'destination');
                              } else {
                                triggerToast(`Pass booked for ${displayTitle}!`);
                              }
                            }}
                            style={{
                              backgroundColor: '#166534',
                              color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '8px 18px',
                            fontSize: '0.86rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          Book Pass
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>

            </div>
          )}

          {/* =========================================================================
              VIEW 5: ADMIN-VERIFIED LOCAL GUIDES DIRECTORY (5 Active Guides)
              ========================================================================= */}
          {activeTab === 'guides' && (
            <div>
              {/* Header */}
              <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1B4332', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    Admin-Verified Local Guides <ShieldCheck size={28} color="#166534" />
                  </h1>
                  <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
                    Connect directly with government-accredited local guides verified after strict Admin review.
                  </p>
                </div>

                <div style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '8px 18px', borderRadius: '9999px', fontSize: '0.82rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} color="#166534" /> 5 Active Verified Guides
                </div>
              </div>

              {/* Admin Verification Guarantee Banner */}
              <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '20px', padding: '20px 24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#166534', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#166534', marginBottom: '2px' }}>
                    100% Admin Credential Verification Guarantee
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#15803D', lineHeight: '1.5', margin: 0 }}>
                    Every local guide listed below has passed official identity verification, police background check, and local eco-tourism accreditation by the KummariConnect Admin team.
                  </p>
                </div>
              </div>

              {/* 5 Verified Guides Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
                {verifiedGuides.map((g) => (
                  <div key={g.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 6px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      {/* Guide Profile Header */}
                      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                        <img src={g.image} alt={g.name} style={{ width: '64px', height: '64px', borderRadius: '18px', objectFit: 'cover' }} />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1E293B', margin: 0 }}>{g.name}</h3>
                            <ShieldCheck size={18} color="#166534" />
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#166534', fontWeight: '700', marginBottom: '6px' }}>
                            {g.specialty}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem' }}>
                            <span style={{ color: '#EAB308', fontWeight: '700' }}>⭐ {g.rating}</span>
                            <span style={{ color: '#64748B' }}>• {g.tours} tours guided</span>
                          </div>
                        </div>
                      </div>

                      {/* Verification Status Pill */}
                      <div style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', width: 'fit-content', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={14} /> ADMIN VERIFIED GUIDE (#{g.badgeNo})
                      </div>

                      <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', marginBottom: '16px' }}>
                        {g.bio}
                      </p>

                      {/* Fluent Languages */}
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px' }}>FLUENT LANGUAGES</div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {g.languages.map((lang, idx) => (
                            <span key={idx} style={{ backgroundColor: '#F1F5F9', color: '#475569', fontSize: '0.76rem', fontWeight: '600', padding: '3px 10px', borderRadius: '6px' }}>
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Fee & Contact Button */}
                    <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '700' }}>GUIDE FEE</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#166534' }}>{g.fee}</div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedGuideForModal(g);
                          setShowContactModal(true);
                        }}
                        style={{
                          backgroundColor: '#166534',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '10px 18px',
                          fontSize: '0.86rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        Contact Guide <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </main>

      {/* =========================================================================
          ECO SUPPORT & FEEDBACK PORTAL MODAL (Sent directly to Admin)
          ========================================================================= */}
      {showSupportModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '28px', width: '90%', maxWidth: '560px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.2)', border: '1px solid #E2E8F0' }}>
            
            {/* Header */}
            <div style={{ backgroundColor: '#166534', color: '#FFFFFF', padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.08em', color: '#DCFCE7', textTransform: 'uppercase', marginBottom: '2px' }}>
                  ADMIN DISPATCH PORTAL
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HelpCircle size={22} /> Support & Query Feedback
                </h3>
              </div>

              <button
                onClick={() => setShowSupportModal(false)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', opacity: 0.8 }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '32px', maxHeight: '80vh', overflowY: 'auto' }}>
              
              {/* If Ticket Submitted, Show Ticket Confirmation Card */}
              {submittedTicket ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <CheckCircle2 size={36} color="#166534" />
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#166534', marginBottom: '4px' }}>
                    Ticket #{submittedTicket.ticketId} Sent to Admin!
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '24px' }}>
                    Your query / difficulty has been recorded in the Admin Dashboard. Our team will get back to <strong>{submittedTicket.userEmail}</strong> within 2 hours.
                  </p>

                  <div style={{ backgroundColor: '#F8FAF9', borderRadius: '16px', padding: '20px', textAlign: 'left', border: '1px solid #E2E8F0', marginBottom: '24px', fontSize: '0.88rem', color: '#475569' }}>
                    <div style={{ marginBottom: '8px' }}><strong>Category:</strong> {submittedTicket.category}</div>
                    <div style={{ marginBottom: '8px' }}><strong>Subject:</strong> {submittedTicket.subject}</div>
                    <div style={{ marginBottom: '8px' }}><strong>Status:</strong> <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '800' }}>{submittedTicket.status || 'IN REVIEW'}</span></div>
                    <div><strong>Submitted By:</strong> {submittedTicket.userName}</div>
                  </div>

                  <button
                    onClick={() => setShowSupportModal(false)}
                    style={{ width: '100%', backgroundColor: '#166534', color: '#FFFFFF', padding: '14px', borderRadius: '12px', fontSize: '0.92rem', fontWeight: '700', border: 'none', cursor: 'pointer' }}
                  >
                    Done & Close
                  </button>
                </div>
              ) : (
                /* Form View */
                <form onSubmit={handleSupportFormSubmit}>
                  
                  {/* Category Selection */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
                      Category / Issue Type
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {[
                        'App Difficulty / Bug',
                        'Booking Query',
                        'Eco-Guide Experience Feedback',
                        'Payment & Refund Assistance',
                        'General Suggestion'
                      ].map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSupportCategory(cat)}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '10px',
                            fontSize: '0.78rem',
                            fontWeight: supportCategory === cat ? '700' : '500',
                            backgroundColor: supportCategory === cat ? '#F0FDF4' : '#F8FAF9',
                            color: supportCategory === cat ? '#166534' : '#475569',
                            border: supportCategory === cat ? '1px solid #166534' : '1px solid #E2E8F0',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subject Input */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>
                      Subject / Query Title *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Difficulty with OTP email delivery or guide schedule"
                      value={supportSubject}
                      onChange={(e) => setSupportSubject(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem' }}
                    />
                  </div>

                  {/* Detailed Description */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>
                      Describe the difficulty or feedback in detail *
                    </label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Please explain what happened or what assistance you need..."
                      value={supportDescription}
                      onChange={(e) => setSupportDescription(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem', resize: 'vertical' }}
                    />
                  </div>

                  {/* Urgency & Rating Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Urgency Level</label>
                      <select 
                        value={supportUrgency}
                        onChange={(e) => setSupportUrgency(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.86rem', backgroundColor: '#FFFFFF' }}
                      >
                        <option value="Normal">Normal (Response in 24h)</option>
                        <option value="High">High (Response in 4h)</option>
                        <option value="Urgent">Urgent (Response in 1h)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Satisfaction Rating</label>
                      <div style={{ display: 'flex', gap: '6px', paddingTop: '4px' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setSupportRating(star)}
                            style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
                          >
                            {star <= supportRating ? '⭐' : '☆'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={supportSubmitting}
                    style={{
                      width: '100%',
                      backgroundColor: '#166534',
                      color: '#FFFFFF',
                      padding: '14px',
                      borderRadius: '14px',
                      fontSize: '0.95rem',
                      fontWeight: '800',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(22, 101, 52, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {supportSubmitting ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={18} />}
                    Submit Query to Admin
                  </button>

                </form>
              )}

            </div>

          </div>
        </div>
      )}

      {/* Contact Guide Modal */}
      {showContactModal && (() => {
        const modalGuide = selectedGuideForModal || verifiedGuides[0];
        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', width: '90%', maxWidth: '440px', textAlign: 'center' }}>
              <img src={modalGuide.image} alt={modalGuide.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px', border: '2px solid #166534' }} />
              
              <div style={{ backgroundColor: '#DCFCE7', color: '#166534', fontSize: '0.72rem', fontWeight: '800', padding: '4px 12px', borderRadius: '9999px', width: 'fit-content', margin: '0 auto 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} /> ADMIN VERIFIED ({modalGuide.badgeNo})
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', marginBottom: '2px' }}>Contact {modalGuide.name}</h3>
              <p style={{ fontSize: '0.84rem', color: '#166534', fontWeight: '600', marginBottom: '16px' }}>{modalGuide.specialty}</p>

              <div style={{ backgroundColor: '#F8FAF9', padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#475569', textAlign: 'left', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
                <div>📞 <strong>Phone:</strong> {modalGuide.phone}</div>
                <div>✉️ <strong>Email:</strong> {modalGuide.email}</div>
                <div>⭐ <strong>Rating:</strong> {modalGuide.rating} ({modalGuide.tours} tours completed)</div>
                <div>💵 <strong>Guide Fee:</strong> {modalGuide.fee}</div>
              </div>

              <button
                onClick={() => {
                  setShowContactModal(false);
                  triggerToast(`🎉 Direct message sent to ${modalGuide.name}! They will call you shortly.`);
                }}
                style={{ width: '100%', backgroundColor: '#166534', color: '#FFFFFF', padding: '12px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700', border: 'none', cursor: 'pointer' }}
              >
                Send Direct Message to Guide
              </button>
              <button
                onClick={() => setShowContactModal(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '0.85rem', marginTop: '12px', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        );
      })()}
      {/* =========================================================================
          EDIT PROFILE MODAL
          ========================================================================= */}
      {showProfileModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000
        }}>
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '0', width: '460px', maxHeight: '85vh', overflow: 'hidden',
            boxShadow: '0 24px 48px rgba(0,0,0,0.15)'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #1B4332, #2D6A4F)', padding: '28px 32px', color: '#FFFFFF',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0 }}>Edit Profile</h3>
                <p style={{ fontSize: '0.82rem', opacity: 0.8, marginTop: '4px' }}>Update your account details</p>
              </div>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: '800'
              }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>

            {/* Tab Selector */}
            <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0' }}>
              <button
                onClick={() => setEditProfileTab('general')}
                style={{
                  flex: 1, padding: '14px', fontSize: '0.88rem', fontWeight: '700', border: 'none', cursor: 'pointer',
                  backgroundColor: editProfileTab === 'general' ? '#FFFFFF' : '#F8FAFC',
                  color: editProfileTab === 'general' ? '#1B4332' : '#94A3B8',
                  borderBottom: editProfileTab === 'general' ? '3px solid #2D6A4F' : '3px solid transparent'
                }}
              >
                👤 General Info
              </button>
              <button
                onClick={() => setEditProfileTab('password')}
                style={{
                  flex: 1, padding: '14px', fontSize: '0.88rem', fontWeight: '700', border: 'none', cursor: 'pointer',
                  backgroundColor: editProfileTab === 'password' ? '#FFFFFF' : '#F8FAFC',
                  color: editProfileTab === 'password' ? '#1B4332' : '#94A3B8',
                  borderBottom: editProfileTab === 'password' ? '3px solid #2D6A4F' : '3px solid transparent'
                }}
              >
                🔒 Change Password
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveProfile} style={{ padding: '28px 32px' }}>

              {editProfileTab === 'general' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Enter your full name"
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #E2E8F0',
                        fontSize: '0.92rem', color: '#1E293B', outline: 'none', transition: 'border 0.2s',
                        backgroundColor: '#F8FAFC'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#2D6A4F'}
                      onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="your@email.com"
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #E2E8F0',
                        fontSize: '0.92rem', color: '#1E293B', outline: 'none', backgroundColor: '#F8FAFC'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#2D6A4F'}
                      onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                    />
                  </div>

                  <div style={{ backgroundColor: '#F0FDF4', borderRadius: '10px', padding: '12px 16px', border: '1px solid #BBF7D0' }}>
                    <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: '600' }}>
                      🛡️ Role: <strong>{user?.role || 'Tourist'}</strong>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                      Account role cannot be changed from this page
                    </div>
                  </div>
                </div>
              )}

              {editProfileTab === 'password' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                  {!profileOtpSent ? (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          New Password
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password (min 4 chars)"
                          style={{
                            width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #E2E8F0',
                            fontSize: '0.92rem', color: '#1E293B', outline: 'none', backgroundColor: '#F8FAFC'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#2D6A4F'}
                          onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          style={{
                            width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #E2E8F0',
                            fontSize: '0.92rem', color: '#1E293B', outline: 'none', backgroundColor: '#F8FAFC'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#2D6A4F'}
                          onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                        />
                      </div>

                      <div style={{ backgroundColor: '#FFF7ED', borderRadius: '10px', padding: '12px 16px', border: '1px solid #FED7AA' }}>
                        <div style={{ fontSize: '0.78rem', color: '#9A3412', fontWeight: '600' }}>
                          🔒 Password changes require email OTP verification
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#78716C', marginTop: '2px' }}>
                          A 6-digit code will be sent to {user?.email}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.88rem', color: '#1E293B', fontWeight: '600', marginBottom: '4px' }}>
                          Enter 6-Digit Verification Code
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '16px' }}>
                          Sent to <strong style={{ color: '#2D6A4F' }}>{user?.email}</strong>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        {profileOtpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`profile-otp-${idx}`}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleProfileOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleProfileOtpKeyDown(idx, e)}
                            style={{
                              width: '42px', height: '48px', borderRadius: '10px',
                              border: digit ? '2px solid #166534' : '1.5px solid #CBD5E1',
                              backgroundColor: digit ? '#F0FDF4' : '#FFFFFF',
                              fontSize: '1.2rem', fontWeight: '800', color: '#1B4332',
                              textAlign: 'center', outline: 'none'
                            }}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => { setProfileOtpSent(false); setProfileMsg({ type: '', text: '' }); }}
                        style={{ background: 'none', border: 'none', color: '#2D6A4F', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', textAlign: 'center' }}
                      >
                        ← Back to password fields
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Status Message */}
              {profileMsg.text && (
                <div style={{
                  marginTop: '16px', padding: '10px 14px', borderRadius: '10px', fontSize: '0.84rem', fontWeight: '600',
                  backgroundColor: profileMsg.type === 'success' ? '#F0FDF4' : '#FEF2F2',
                  color: profileMsg.type === 'success' ? '#166534' : '#DC2626',
                  border: `1px solid ${profileMsg.type === 'success' ? '#BBF7D0' : '#FECACA'}`
                }}>
                  {profileMsg.text}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700',
                    backgroundColor: '#F1F5F9', color: '#64748B', border: 'none', cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileSubmitting}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700',
                    background: 'linear-gradient(135deg, #1B4332, #2D6A4F)', color: '#FFFFFF', border: 'none', cursor: 'pointer',
                    opacity: profileSubmitting ? 0.6 : 1
                  }}
                >
                  {profileSubmitting ? 'Processing...' : editProfileTab === 'password' ? (profileOtpSent ? '🔑 Verify OTP & Change Password' : '📧 Send Verification Code') : '💾 Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
