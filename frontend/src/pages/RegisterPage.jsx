import React, { useState } from 'react';
import { Shield, Compass, KeyRound, CheckCircle2, Lock, Mail, User as UserIcon } from 'lucide-react';
import { API_BASE_URL } from '../services/api';

export default function RegisterPage({ onGoToLogin, onRegisterSuccess }) {
  const [role, setRole] = useState('Tourist'); // 'Tourist' or 'Guide'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [demoCode, setDemoCode] = useState('');

  // Guide-Specific Registration State
  const [guideLicense, setGuideLicense] = useState('');
  const [guideSpecialty, setGuideSpecialty] = useState('Coastal Trails & Marine Ecosystems');
  const [guideLanguage, setGuideLanguage] = useState('Tamil');

  // 6-Digit Email OTP State
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [isVerified, setIsVerified] = useState(false);

  // Handle Initial Registration Submission -> Trigger Gmail OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirm) {
      setErrorMsg('Passwords do not match');
      return;
    }

    if (role === 'Guide' && (!guideLicense || guideLicense.length < 3)) {
      setErrorMsg('Please enter a valid Government Tour Guide License / ID Number');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identity: email,
          name,
          role,
          password,
          guideInfo: role === 'Guide' ? {
            licenseNo: guideLicense,
            specialty: guideSpecialty,
            languages: [guideLanguage, 'English']
          } : null
        })
      });
      const data = await res.json();

      if (!data.success) {
        setErrorMsg(data.message || 'Failed to send verification email. Try again.');
        setLoading(false);
        return;
      }

      if (data.demoOtp) {
        setDemoCode(data.demoOtp);
      }
      setOtpDigits(['', '', '', '', '', '']);
      setShowOtpScreen(true);
    } catch {
      setErrorMsg('Cannot connect to server. Please check your connection and try again.');
    }
    setLoading(false);
  };

  // Handle OTP Verification & DB User / Guide Creation
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const fullOtp = otpDigits.join('');
    if (fullOtp.length < 6) {
      setErrorMsg('Please enter all 6 digits of the verification code sent to your email.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identity: email,
          otp: fullOtp,
          name,
          role,
          password,
          guideInfo: role === 'Guide' ? {
            licenseNo: guideLicense,
            specialty: guideSpecialty,
            languages: [guideLanguage, 'English']
          } : null
        })
      });
      const data = await res.json();

      if (data.success) {
        setIsVerified(true);
        if (data.token) {
          localStorage.setItem('userToken', data.token);
          localStorage.setItem('currentUser', JSON.stringify(data.user));
        }
        setTimeout(() => {
          if (onRegisterSuccess) {
            onRegisterSuccess(data.user || { name, email, role });
          }
        }, 1500);
      } else {
        setErrorMsg(data.message || 'OTP verification failed. Please enter the correct code.');
      }
    } catch {
      setErrorMsg('Cannot connect to server. Please try again.');
    }
    setLoading(false);
  };

  // Handle Direct Google OAuth Registration
  const handleGoogleRegister = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInfo: {
            name: name || (email ? email.split('@')[0] : 'Google Explorer'),
            email: email || 'google.user@kanniyakumari.com',
            picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            googleId: 'g-oauth-' + Date.now()
          },
          role
        })
      });
      const data = await res.json();

      if (data.success) {
        setIsVerified(true);
        if (data.token) {
          localStorage.setItem('userToken', data.token);
          localStorage.setItem('currentUser', JSON.stringify(data.user));
        }
        setTimeout(() => {
          if (onRegisterSuccess) {
            onRegisterSuccess(data.user);
          }
        }, 1500);
      } else {
        setErrorMsg(data.message || 'Google Registration failed.');
      }
    } catch {
      setErrorMsg('Cannot connect to server. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F4F7F5' }}>
      
      {/* Top Navbar */}
      <nav style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E0D8',
        padding: '0 32px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#00334E' }}>
          Kanyakumari Explore
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '0.9rem', color: '#556980', cursor: 'pointer' }}>Help Center</span>
          <button
            onClick={onGoToLogin}
            style={{
              backgroundColor: '#00334E',
              color: '#FFFFFF',
              padding: '0.55rem 1.4rem',
              borderRadius: '9999px',
              fontSize: '0.9rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Main Content Grid */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)' }}>
        
        {/* Left Sage Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #DCE5DF 0%, #CCD9CF 50%, #C4D3C9 100%)',
          padding: '60px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: '#00334E'
        }}>
          <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <h1 style={{
              fontSize: '2.8rem',
              fontWeight: '700',
              fontFamily: "'Playfair Display', Georgia, serif",
              lineHeight: '1.15',
              marginBottom: '20px'
            }}>
              Begin Your Journey Where Seas Converge
            </h1>

            <p style={{ fontSize: '0.96rem', color: '#3A5243', lineHeight: '1.65', marginBottom: '40px' }}>
              Join a community of conscious explorers discovering the timeless beauty of Kanyakumari. Whether you're here to wander or to lead, your story starts at the edge of the horizon.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#00334E', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Shield size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#00334E' }}>Verified Guides</div>
                  <div style={{ fontSize: '0.85rem', color: '#4E6857' }}>Experience local heritage with trusted experts.</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#00334E', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Compass size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#00334E' }}>Curated Routes</div>
                  <div style={{ fontSize: '0.85rem', color: '#4E6857' }}>Hand-picked experiences across the Three Seas.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div style={{
          backgroundColor: '#F5F2EC',
          padding: '40px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '28px',
            padding: '40px 36px',
            width: '100%',
            maxWidth: '440px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.06)',
            border: '1px solid #EFEAE4'
          }}>
            
            {showOtpScreen ? (
              <div style={{ textAlign: 'center' }}>
                {isVerified ? (
                  <div>
                    <CheckCircle2 size={54} color="#10B981" style={{ margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#00334E', marginBottom: '6px' }}>
                      Account Created & Verified!
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: '#778899' }}>Saved to Database. Redirecting to your dashboard...</p>
                  </div>
                ) : (
                  <form onSubmit={handleVerifyOtp}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#E0F2FE',
                      color: '#0284C7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px'
                    }}>
                      <KeyRound size={24} />
                    </div>

                    <h3 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#00334E', marginBottom: '6px' }}>
                      Verify Gmail Security Code
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: '#556980', marginBottom: '24px' }}>
                      Sent 6-digit security code to <strong style={{ color: '#00334E' }}>{email}</strong>
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
                          id={`otp-${idx}`}
                          type="text"
                          maxLength="1"
                          value={digit}
                          onChange={(e) => {
                            const val = e.target.value;
                            const newD = [...otpDigits];
                            newD[idx] = val;
                            setOtpDigits(newD);
                            if (val && idx < 5) {
                              const nextInput = document.getElementById(`otp-${idx + 1}`);
                              if (nextInput) nextInput.focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !digit && idx > 0) {
                              const prevInput = document.getElementById(`otp-${idx - 1}`);
                              if (prevInput) prevInput.focus();
                            }
                          }}
                          style={{
                            width: '42px',
                            height: '48px',
                            borderRadius: '10px',
                            border: digit ? '2px solid #166534' : '1.5px solid #CBD5E1',
                            fontSize: '1.2rem',
                            fontWeight: '800',
                            color: '#166534',
                            textAlign: 'center',
                            outline: 'none',
                            backgroundColor: digit ? '#F0FDF4' : '#FFFFFF'
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
                        backgroundColor: '#00334E',
                        color: '#FFFFFF',
                        padding: '12px',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {loading ? 'Verifying...' : 'Verify Code & Create Account'}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#00334E', marginBottom: '4px' }}>
                  Create Account
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#778899', marginBottom: '20px' }}>
                  Join the Kanyakumari Explore community today.
                </p>

                {/* Role Switcher */}
                <div style={{
                  backgroundColor: '#F5F2EC',
                  borderRadius: '12px',
                  padding: '4px',
                  display: 'flex',
                  gap: '4px',
                  marginBottom: '20px'
                }}>
                  {['Tourist', 'Guide'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      style={{
                        flex: 1,
                        padding: '7px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: role === r ? '600' : '400',
                        backgroundColor: role === r ? '#FFFFFF' : 'transparent',
                        color: role === r ? '#00334E' : '#778899',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: role === r ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#556980', fontWeight: '500', marginBottom: '4px' }}>
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
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid #E2D9CF',
                        fontSize: '0.88rem',
                        color: '#00334E',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#556980', fontWeight: '500', marginBottom: '4px' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid #E2D9CF',
                        fontSize: '0.88rem',
                        color: '#00334E',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#556980', fontWeight: '500', marginBottom: '4px' }}>
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #E2D9CF',
                          fontSize: '0.88rem',
                          color: '#00334E',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#556980', fontWeight: '500', marginBottom: '4px' }}>
                        Confirm
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        required
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #E2D9CF',
                          fontSize: '0.88rem',
                          color: '#00334E',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {role === 'Guide' && (
                    <div style={{ backgroundColor: '#F0FDF4', borderRadius: '12px', padding: '14px', border: '1px solid #BBF7D0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '0.76rem', fontWeight: '800', color: '#166534', letterSpacing: '0.05em' }}>
                        🛡️ OFFICIAL GUIDE REGISTRATION DETAILS
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', color: '#166534', fontWeight: '700', marginBottom: '4px' }}>
                          Govt License / ID Badge Number *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. TN-KK-8904"
                          required={role === 'Guide'}
                          value={guideLicense}
                          onChange={(e) => setGuideLicense(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid #86EFAC',
                            fontSize: '0.86rem',
                            color: '#166534',
                            outline: 'none',
                            backgroundColor: '#FFFFFF'
                          }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.74rem', color: '#166534', fontWeight: '700', marginBottom: '4px' }}>
                            Primary Specialty
                          </label>
                          <select
                            value={guideSpecialty}
                            onChange={(e) => setGuideSpecialty(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #86EFAC', fontSize: '0.8rem', backgroundColor: '#FFFFFF', color: '#166534' }}
                          >
                            <option value="Coastal Trails & Marine Ecosystems">Coastal Trails & Marine</option>
                            <option value="Sacred Temples & Heritage Architecture">Temples & Heritage</option>
                            <option value="Maritime History & Chola Architecture">Maritime History</option>
                            <option value="Western Ghats Trekking & Waterfalls">Mountain Trekking</option>
                            <option value="Catamaran Fishing & Marine Birds">Fishing & Marine Life</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.74rem', color: '#166534', fontWeight: '700', marginBottom: '4px' }}>
                            Primary Language
                          </label>
                          <select
                            value={guideLanguage}
                            onChange={(e) => setGuideLanguage(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #86EFAC', fontSize: '0.8rem', backgroundColor: '#FFFFFF', color: '#166534' }}
                          >
                            <option value="Tamil">Tamil</option>
                            <option value="Malayalam">Malayalam</option>
                            <option value="English">English</option>
                            <option value="Hindi">Hindi</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {errorMsg && (
                    <div style={{ fontSize: '0.82rem', color: '#DC2626', textAlign: 'center' }}>
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      backgroundColor: '#00334E',
                      color: '#FFFFFF',
                      padding: '11px',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      marginTop: '6px'
                    }}
                  >
                    {loading ? 'Sending OTP Code...' : 'Create My Account'}
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#E2D9CF' }} />
                    <span style={{ fontSize: '0.72rem', color: '#778899' }}>OR</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#E2D9CF' }} />
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleRegister}
                    style={{
                      width: '100%',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2D9CF',
                      borderRadius: '10px',
                      padding: '10px',
                      fontSize: '0.86rem',
                      fontWeight: '600',
                      color: '#00334E',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '16px' }} />
                    Continue with Google Account
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.82rem', color: '#556980' }}>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={onGoToLogin}
                      style={{ background: 'none', border: 'none', color: '#00334E', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Login
                    </button>
                  </div>

                </form>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#00334E',
        color: 'rgba(255, 255, 255, 0.65)',
        padding: '20px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        fontSize: '0.8rem'
      }}>
        <div>© 2024 KANYAKUMARI TOURISM DEVELOPMENT. ALL RIGHTS RESERVED.</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Help Center</span>
          <span>Accessibility</span>
        </div>
      </footer>

    </div>
  );
}
