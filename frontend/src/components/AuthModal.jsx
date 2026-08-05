import React, { useState, useRef } from 'react';
import { X, ArrowLeft, KeyRound, CheckCircle2, Lock, Mail, Eye, EyeOff, Shield } from 'lucide-react';
import { API_BASE_URL } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAdminLoginSuccess, onUserLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'otp'
  const [role, setRole] = useState('Tourist'); // 'Tourist' | 'Guide' | 'Admin'

  // Form State
  const [identity, setIdentity] = useState('');
  const [adminId, setAdminId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // OTP State (6 Digits)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [isVerified, setIsVerified] = useState(false);

  const otpInputsRef = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  if (!isOpen) return null;

  // Handle Admin Login Action
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!adminId || !passcode) {
      setErrorMsg('Please enter Admin ID and Admin Passcode.');
      return;
    }

    setLoading(true);

    const finishAdminLogin = () => {
      setIsVerified(true);
      if (onAdminLoginSuccess) {
        onAdminLoginSuccess();
      }
      setTimeout(() => {
        setIsVerified(false);
        onClose();
      }, 1200);
    };

    try {
      const res = await fetch(`${API_BASE_URL}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId, passcode })
      });
      const data = await res.json();

      if (data.success) {
        finishAdminLogin();
      } else {
        setErrorMsg(data.message || 'Invalid Admin ID or Passcode.');
      }
    } catch {
      setErrorMsg('Cannot connect to server. Please try again.');
    }
    setLoading(false);
  };

  // Handle LOGIN: direct email + password (NO OTP)
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identity || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identity, password })
      });
      const data = await res.json();

      if (data.success) {
        setIsVerified(true);
        if (data.token) {
          localStorage.setItem('userToken', data.token);
          localStorage.setItem('currentUser', JSON.stringify(data.user));
        }
        if (onUserLoginSuccess) onUserLoginSuccess(data.user);
        setTimeout(() => { setIsVerified(false); onClose(); }, 1200);
      } else {
        setErrorMsg(data.message || 'Login failed. Check your credentials.');
      }
    } catch {
      setErrorMsg('Cannot connect to server. Please try again.');
    }
    setLoading(false);
  };

  // Handle REGISTER: send OTP to email for verification
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identity || !name || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    if (password !== confirm) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity, name, role, password })
      });
      const data = await res.json();

      if (!data.success) {
        setErrorMsg(data.message || 'Failed to send verification email.');
        setLoading(false);
        return;
      }

      setOtpDigits(['', '', '', '', '', '']);
      setMode('otp');
    } catch {
      setErrorMsg('Cannot connect to server. Please try again.');
    }
    setLoading(false);
  };

  // Handle Google OAuth Login Action
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    const userPayload = {
      name: name || (identity ? identity.split('@')[0] : 'Google Explorer'),
      email: identity || 'google.explorer@gmail.com',
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      googleId: 'g-oauth-' + Date.now()
    };

    try {
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInfo: userPayload, role })
      });
      const data = await res.json();

      if (data.success) {
        setIsVerified(true);
        if (onUserLoginSuccess) {
          onUserLoginSuccess(data.user || userPayload);
        }
        setTimeout(() => {
          setIsVerified(false);
          onClose();
        }, 1500);
      } else {
        setErrorMsg(data.message || 'Google OAuth Sign-In failed.');
      }
    } catch {
      setErrorMsg('Cannot connect to server. Please try again.');
    }
    setLoading(false);
  };

  // OTP digit handling (6 Digits)
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    if (value && index < 5) {
      otpInputsRef[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef[index - 1].current?.focus();
    }
  };

  // Verify OTP Action
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identity: identity || 'tourist@kanyakumari.com',
          otp: enteredOtp,
          name: name || 'Explorer',
          role
        })
      });
      const data = await res.json();

      if (data.success) {
        setIsVerified(true);
        if (onUserLoginSuccess) {
          onUserLoginSuccess(data.user || { name: name || 'Explorer', email: identity || 'tourist@kanyakumari.com', role });
        }
        setTimeout(() => {
          setIsVerified(false);
          setMode('login');
          onClose();
        }, 1500);
      } else {
        setErrorMsg(data.message || 'Invalid OTP code.');
      }
    } catch {
      setErrorMsg('Cannot connect to server. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2500,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      overflowY: 'auto'
    }}>
      
      {/* =========================================================================
          TOP NAVBAR (Kanniyakumari Eco-Travel & Back to Explore)
          ========================================================================= */}
      <nav style={{
        height: '64px',
        borderBottom: '1px solid #EAE5DF',
        padding: '0 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        flexShrink: 0
      }}>
        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1B4332', letterSpacing: '-0.01em' }}>
          Kanniyakumari Eco-Travel
        </div>

        <button
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#2D6A4F',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} /> Back to Explore
        </button>
      </nav>

      {/* =========================================================================
          MAIN 2-COLUMN SPLIT CONTAINER (Matching Screenshots 1 & 2)
          ========================================================================= */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', backgroundColor: '#F0F6F3' }}>
        
        {/* LEFT COLUMN: Visual & Story Banner (Thiruvalluvar Statue over Ocean) */}
        <div style={{
          position: 'relative',
          backgroundImage: 'linear-gradient(180deg, rgba(0, 0, 0, 0.1) 30%, rgba(13, 33, 55, 0.88) 100%), url("https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=85")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: '#FFFFFF'
        }}>
          {/* Top Badge for Statue */}
          <div style={{
            alignSelf: 'flex-start',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
            color: '#FFFFFF',
            fontSize: '0.8rem',
            fontWeight: '600',
            padding: '6px 16px',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            🗿 133-Ft Thiruvalluvar Statue • Kanyakumari Shore
          </div>

          <div style={{ maxWidth: '440px' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: '600', color: '#FFFFFF', marginBottom: '8px' }}>
              Preserving the tip of the world.
            </div>

            <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.65', marginBottom: '32px' }}>
              Standing tall at the confluence of three oceans, the 133-foot Thiruvalluvar Statue honors the legendary Tamil poet and philosopher. Join a community of conscious travelers exploring India's southern jewel.
            </p>

            {/* Stats Row */}
            <div style={{ display: 'flex', gap: '48px' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#FFFFFF' }}>12k+</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.75)' }}>Eco-Stays Booked</div>
              </div>

              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#FFFFFF' }}>4.9/5</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.75)' }}>Guide Rating</div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Sign In Form Card Container */}
        <div style={{
          padding: '48px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F0F6F3'
        }}>
          
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '40px 36px',
            width: '100%',
            maxWidth: '440px',
            boxShadow: '0 8px 32px rgba(27, 67, 50, 0.08)',
            border: '1px solid #E2EFE9'
          }}>

            {/* =========================================================================
                MODE 1 & 2: LOGIN / REGISTER FORMS
                ========================================================================= */}
            {mode !== 'otp' && (
              <div>
                
                {/* Form Header */}
                <h2 style={{ fontSize: '1.35rem', fontWeight: '600', color: '#2D6A4F', marginBottom: '4px' }}>
                  {mode === 'register' ? 'Create Your Account' : 'Welcome back'}
                </h2>
                <p style={{ fontSize: '0.86rem', color: '#556980', marginBottom: '24px', lineHeight: '1.5' }}>
                  {mode === 'register' ? 'Join the Kanniyakumari Eco-Travel community.' : 'Access your eco-travel dashboard or create a new account to start planning.'}
                </p>

                {/* Role Tabs Switcher (Tourist | Guide | Admin) */}
                <div style={{
                  backgroundColor: '#EDF5F2',
                  borderRadius: '12px',
                  padding: '4px',
                  display: 'flex',
                  gap: '4px',
                  marginBottom: '24px'
                }}>
                  {(mode === 'register' ? ['Tourist', 'Guide'] : ['Tourist', 'Guide', 'Admin']).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: role === r ? '600' : '400',
                        backgroundColor: role === r ? '#2D6A4F' : 'transparent',
                        color: role === r ? '#FFFFFF' : '#556980',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                {/* ADMIN LOGIN FORM (ONLY ADMIN ID & PASSCODE) */}
                {role === 'Admin' && mode === 'login' ? (
                  <form onSubmit={handleAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    {/* Admin ID */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#4A5568', fontWeight: '500', marginBottom: '6px' }}>
                        Admin ID
                      </label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Shield size={18} color="#2D6A4F" style={{ position: 'absolute', left: '14px' }} />
                        <input
                          type="text"
                          placeholder="e.g. ADM-9021"
                          required
                          value={adminId}
                          onChange={(e) => setAdminId(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px 12px 42px',
                            borderRadius: '12px',
                            border: '1px solid #D8E6E0',
                            backgroundColor: '#FFFFFF',
                            fontSize: '0.9rem',
                            color: '#1B4332',
                            outline: 'none',
                            fontWeight: '600'
                          }}
                        />
                      </div>
                    </div>

                    {/* Admin Passcode */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#4A5568', fontWeight: '500', marginBottom: '6px' }}>
                        Admin Passcode
                      </label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Lock size={18} color="#2D6A4F" style={{ position: 'absolute', left: '14px' }} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          required
                          value={passcode}
                          onChange={(e) => setPasscode(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 42px 12px 42px',
                            borderRadius: '12px',
                            border: '1px solid #D8E6E0',
                            backgroundColor: '#FFFFFF',
                            fontSize: '0.9rem',
                            color: '#1B4332',
                            outline: 'none'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ position: 'absolute', right: '14px', background: 'none', border: 'none', color: '#778899', cursor: 'pointer' }}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {errorMsg && (
                      <div style={{ fontSize: '0.82rem', color: '#DC2626', textAlign: 'center' }}>
                        {errorMsg}
                      </div>
                    )}

                    {isVerified && (
                      <div style={{ fontSize: '0.88rem', color: '#10B981', fontWeight: '600', textAlign: 'center' }}>
                        ✓ Admin Access Granted! Redirecting...
                      </div>
                    )}

                    {/* Green Sign In Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        backgroundColor: '#2D6A4F',
                        color: '#FFFFFF',
                        padding: '12px',
                        borderRadius: '12px',
                        fontSize: '0.92rem',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        marginTop: '8px',
                        boxShadow: '0 4px 14px rgba(45, 106, 79, 0.25)'
                      }}
                    >
                      {loading ? 'Authenticating Admin...' : 'Sign In as Admin'}
                    </button>

                  </form>
                ) : (
                  /* TOURIST & GUIDE LOGIN / REGISTER FORM */
                  <form onSubmit={mode === 'login' ? handleLogin : handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    {/* Full Name (if register mode) */}
                    {mode === 'register' && (
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#4A5568', fontWeight: '500', marginBottom: '6px' }}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your full name"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: '1px solid #D8E6E0',
                            backgroundColor: '#FFFFFF',
                            fontSize: '0.9rem',
                            color: '#1B4332',
                            outline: 'none'
                          }}
                        />
                      </div>
                    )}

                    {/* Email Address */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#4A5568', fontWeight: '500', marginBottom: '6px' }}>
                        Email Address
                      </label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <span style={{ position: 'absolute', left: '14px', color: '#2D6A4F', fontWeight: '600', fontSize: '1.1rem' }}>@</span>
                        <input
                          type="email"
                          placeholder="name@example.com"
                          required
                          value={identity}
                          onChange={(e) => setIdentity(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px 12px 42px',
                            borderRadius: '12px',
                            border: '1px solid #D8E6E0',
                            backgroundColor: '#FFFFFF',
                            fontSize: '0.9rem',
                            color: '#1B4332',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#4A5568', fontWeight: '500', marginBottom: '6px' }}>
                        Password
                      </label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Lock size={18} color="#2D6A4F" style={{ position: 'absolute', left: '14px' }} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 42px 12px 42px',
                            borderRadius: '12px',
                            border: '1px solid #D8E6E0',
                            backgroundColor: '#FFFFFF',
                            fontSize: '0.9rem',
                            color: '#1B4332',
                            outline: 'none'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ position: 'absolute', right: '14px', background: 'none', border: 'none', color: '#778899', cursor: 'pointer' }}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password (if register mode) */}
                    {mode === 'register' && (
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#4A5568', fontWeight: '500', marginBottom: '6px' }}>
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          required
                          value={confirm}
                          onChange={(e) => setConfirm(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: '1px solid #D8E6E0',
                            backgroundColor: '#FFFFFF',
                            fontSize: '0.9rem',
                            color: '#1B4332',
                            outline: 'none'
                          }}
                        />
                      </div>
                    )}

                    {/* Remember me & Forgot password Row */}
                    {mode === 'login' && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#556980', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            style={{ accentColor: '#2D6A4F', width: '16px', height: '16px', cursor: 'pointer' }}
                          />
                          <span>Remember me</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => setMode('otp')}
                          style={{ background: 'none', border: 'none', color: '#2D6A4F', fontWeight: '600', cursor: 'pointer' }}
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}

                    {errorMsg && (
                      <div style={{ fontSize: '0.82rem', color: '#DC2626', textAlign: 'center' }}>
                        {errorMsg}
                      </div>
                    )}

                    {/* Green Action Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        backgroundColor: '#2D6A4F',
                        color: '#FFFFFF',
                        padding: '12px',
                        borderRadius: '12px',
                        fontSize: '0.92rem',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        marginTop: '4px',
                        boxShadow: '0 4px 14px rgba(45, 106, 79, 0.25)'
                      }}
                    >
                      {loading ? (mode === 'register' ? 'Sending OTP...' : 'Signing In...') : mode === 'register' ? 'Create Account' : 'Sign In'}
                    </button>

                    {/* Divider: OR CONTINUE WITH */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '6px 0' }}>
                      <div style={{ flex: 1, height: '1px', backgroundColor: '#E2EFE9' }} />
                      <span style={{ fontSize: '0.72rem', color: '#778899', letterSpacing: '0.05em' }}>OR CONTINUE WITH</span>
                      <div style={{ flex: 1, height: '1px', backgroundColor: '#E2EFE9' }} />
                    </div>

                    {/* Social Buttons (Google & Apple) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #D8E6E0',
                          borderRadius: '12px',
                          padding: '10px',
                          fontSize: '0.88rem',
                          fontWeight: '600',
                          color: '#1B4332',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px' }} />
                        Google
                      </button>

                      <button
                        type="button"
                        onClick={() => alert('Apple Sign-In is coming soon!')}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #D8E6E0',
                          borderRadius: '12px',
                          padding: '10px',
                          fontSize: '0.88rem',
                          fontWeight: '600',
                          color: '#1B4332',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}></span> Apple
                      </button>
                    </div>

                    {/* Toggle between Register & Login */}
                    <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.85rem', color: '#556980' }}>
                      {mode === 'register' ? 'Already have an account? ' : 'New to the portal? '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode(mode === 'register' ? 'login' : 'register');
                          setRole('Tourist');
                        }}
                        style={{ background: 'none', border: 'none', color: '#2D6A4F', fontWeight: '700', cursor: 'pointer' }}
                      >
                        {mode === 'register' ? 'Login' : 'Create an account'}
                      </button>
                    </div>

                  </form>
                )}

              </div>
            )}

            {/* =========================================================================
                MODE 3: OTP VERIFICATION VIEW
                ========================================================================= */}
            {mode === 'otp' && (
              <div style={{ textAlign: 'center' }}>
                
                {/* Back Button */}
                <button
                  onClick={() => setMode('login')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'none',
                    border: 'none',
                    color: '#2D6A4F',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginBottom: '16px'
                  }}
                >
                  <ArrowLeft size={16} /> Back to Sign In
                </button>

                {isVerified ? (
                  <div style={{ padding: '20px 0' }}>
                    <CheckCircle2 size={56} color="#10B981" style={{ margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1B4332', marginBottom: '6px' }}>
                      Verification Successful!
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: '#778899' }}>
                      Signing you in to Kanniyakumari Eco-Travel...
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleVerifyOtp}>
                    
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      backgroundColor: '#E0F2FE',
                      color: '#0284C7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px'
                    }}>
                      <KeyRound size={26} />
                    </div>

                    <h3 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#1B4332', marginBottom: '6px' }}>
                      Verify Gmail Security Code
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: '#556980', marginBottom: '24px' }}>
                      Sent 6-digit security code to <strong style={{ color: '#2D6A4F' }}>{identity || 'your email'}</strong>
                    </p>

                    {/* 6 Digit Boxes */}
                    <div 
                      onPaste={(e) => {
                        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                        if (pasted.length === 6) {
                          setOtpDigits(pasted.split(''));
                        }
                      }}
                      style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}
                    >
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={otpInputsRef[idx]}
                          type="text"
                          maxLength="1"
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          style={{
                            width: '42px',
                            height: '48px',
                            borderRadius: '10px',
                            border: digit ? '2px solid #166534' : '1.5px solid #CBD5E1',
                            backgroundColor: digit ? '#F0FDF4' : '#FFFFFF',
                            fontSize: '1.2rem',
                            fontWeight: '800',
                            color: '#1B4332',
                            textAlign: 'center',
                            outline: 'none',
                            boxShadow: '0 4px 12px rgba(45, 106, 79, 0.08)'
                          }}
                        />
                      ))}
                    </div>

                    {errorMsg && (
                      <div style={{ fontSize: '0.82rem', color: '#DC2626', marginBottom: '16px' }}>
                        {errorMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        width: '100%',
                        backgroundColor: '#2D6A4F',
                        color: '#FFFFFF',
                        padding: '12px',
                        borderRadius: '12px',
                        fontSize: '0.92rem',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(45, 106, 79, 0.25)'
                      }}
                    >
                      {loading ? 'Verifying...' : 'Verify & Proceed'}
                    </button>

                  </form>
                )}

              </div>
            )}

          </div>
        </div>

      </div>

      {/* =========================================================================
          FOOTER (Matching Screenshots 1 & 2)
          ========================================================================= */}
      <footer style={{
        height: '56px',
        backgroundColor: '#F9F9F7',
        borderTop: '1px solid #EAE5DF',
        padding: '0 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        fontSize: '0.8rem',
        color: '#778899',
        flexShrink: 0
      }}>
        <div>© 2024 Kanniyakumari Tourism. Sustainably Crafted.</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
          <span style={{ cursor: 'pointer' }}>Terms of Service</span>
          <span style={{ cursor: 'pointer' }}>Eco-Commitment</span>
          <span style={{ cursor: 'pointer' }}>Contact Us</span>
        </div>
      </footer>

    </div>
  );
}
