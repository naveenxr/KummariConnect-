import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'kummari-connect-secret-key-2026';

// In-memory OTP storage (email -> { otp, purpose, name, password, role, guideInfo, createdAt })
const otpStore = new Map();

// Read env vars INSIDE function (not at module level)
// because dotenv.config() in index.js runs AFTER import statements are hoisted in ESM
const createTransporter = () => {
  const sender = process.env.EMAIL_USER || process.env.GMAIL_USER || '';
  const password = process.env.EMAIL_PASS || process.env.GMAIL_PASS || '';
  if (sender && password && password !== 'your_gmail_app_password') {
    return {
      transporter: nodemailer.createTransport({ service: 'gmail', auth: { user: sender, pass: password } }),
      sender
    };
  }
  console.warn(`⚠️ Gmail credentials missing — EMAIL_USER="${sender || 'MISSING'}", EMAIL_PASS="${password ? '[set]' : 'MISSING'}"`);
  return { transporter: null, sender: null };
};

// Shared: Send branded OTP email
const sendOtpEmail = async (toEmail, otp, name, purpose) => {
  const { transporter, sender } = createTransporter();
  if (!transporter || !sender) {
    throw new Error('Gmail not configured. Set EMAIL_USER and EMAIL_PASS in server/.env and restart.');
  }

  const purposeText = purpose === 'password-change'
    ? 'change your account password'
    : 'complete your account registration';

  await transporter.sendMail({
    from: `"KummariConnect" <${sender}>`,
    to: toEmail,
    subject: `🔒 Your 6-Digit Verification Code - KummariConnect`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px; border: 1px solid #e2efe9; border-radius: 20px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 1.5rem; font-weight: 800; color: #166534;">🌴 KummariConnect</span>
          <div style="font-size: 0.82rem; color: #64748B; margin-top: 4px;">Kanyakumari Eco-Tourism</div>
        </div>
        <h2 style="color: #1E293B; font-size: 1.25rem; font-weight: 700; margin-bottom: 12px; text-align: center;">Verify Your Identity</h2>
        <p style="font-size: 14px; color: #475569; line-height: 1.5; text-align: center; margin-bottom: 24px;">
          Hello <strong>${name || 'Traveler'}</strong>! Use the following 6-digit code to ${purposeText}.
        </p>
        <div style="font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #166534; background-color: #F0FDF4; border: 2px dashed #86EFAC; padding: 24px; border-radius: 16px; text-align: center; margin: 24px 0;">
          ${otp}
        </div>
        <p style="font-size: 13px; color: #94A3B8; text-align: center; margin-top: 24px;">
          ⏱️ This code expires in <strong>10 minutes</strong>. Do not share it with anyone.
        </p>
        <hr style="border: none; border-top: 1px solid #F1F5F9; margin: 24px 0;" />
        <div style="font-size: 0.75rem; color: #94A3B8; text-align: center;">
          © 2024 KummariConnect Tourism Development. All rights reserved.
        </div>
      </div>
    `
  });

  console.log(`✅ OTP email sent to: ${toEmail} (purpose: ${purpose})`);
};

// =========================================================================
// 1. ADMIN LOGIN ROUTE
// =========================================================================
router.post('/admin-login', async (req, res) => {
  try {
    const { adminId, passcode } = req.body;
    if (!adminId || !passcode) {
      return res.status(400).json({ success: false, message: 'Admin ID and Admin Passcode are required.' });
    }
    if (passcode.length < 4) {
      return res.status(400).json({ success: false, message: 'Invalid Admin Passcode.' });
    }
    const token = jwt.sign({ id: adminId, role: 'Admin' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      success: true,
      message: 'Admin Authentication Successful',
      token,
      user: { name: `Admin (${adminId})`, email: `${adminId.toLowerCase()}@admin.kummari.com`, role: 'Admin' }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// 2. SEND OTP FOR REGISTRATION (Tourist / Guide)
// =========================================================================
router.post('/send-otp', async (req, res) => {
  try {
    const { identity, password, name, role, guideInfo } = req.body;
    if (!identity) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const emailKey = identity.toLowerCase().trim();

    // Block if verified account already exists
    const existingUser = await User.findOne({ email: emailKey });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists. Please sign in instead.' });
    }

    // Generate 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with metadata
    otpStore.set(emailKey, {
      otp: generatedOtp,
      purpose: 'registration',
      name,
      password,
      role: role || 'Tourist',
      guideInfo: guideInfo || null,
      createdAt: Date.now()
    });

    console.log(`\n🔑 REGISTRATION OTP for [${emailKey}]: ${generatedOtp}\n`);

    // Send real email
    try {
      await sendOtpEmail(emailKey, generatedOtp, name, 'registration');
      res.json({
        success: true,
        message: `A 6-digit verification code has been sent to ${emailKey}. Check your inbox and spam folder.`,
        emailSent: true
      });
    } catch (mailErr) {
      console.error(`❌ Email failed: ${mailErr.message}`);
      res.status(500).json({
        success: false,
        message: `Failed to send email: ${mailErr.message}`
      });
    }

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// 3. VERIFY REGISTRATION OTP & CREATE USER
// =========================================================================
router.post('/verify-otp', async (req, res) => {
  try {
    const { identity, otp, name, role, password, guideInfo } = req.body;
    const emailKey = (identity || '').toLowerCase().trim();
    const storedData = otpStore.get(emailKey);
    const submittedOtp = (otp || '').trim();

    // Check expiry (10 min)
    if (storedData && Date.now() - storedData.createdAt > 10 * 60 * 1000) {
      otpStore.delete(emailKey);
      return res.status(400).json({ success: false, message: 'Verification code has expired. Please request a new one.' });
    }

    if (!storedData || storedData.otp !== submittedOtp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please check your email and try again.'
      });
    }

    const finalName = name || storedData.name || emailKey.split('@')[0];
    const finalRole = role || storedData.role || 'Tourist';
    const rawPassword = password || storedData.password || 'KummariConnect@2026';
    const finalGuideInfo = guideInfo || storedData.guideInfo || null;

    otpStore.delete(emailKey);

    let user;
    try {
      user = await User.findOne({ email: emailKey });
      const hashedPassword = await bcrypt.hash(rawPassword, 10);

      if (!user) {
        user = new User({
          name: finalName,
          email: emailKey,
          password: hashedPassword,
          role: finalRole,
          isVerified: true,
          guideProfile: finalRole === 'Guide' ? {
            specialty: finalGuideInfo?.specialty || 'General Coastal & Cultural Guide',
            licenseNo: finalGuideInfo?.licenseNo || `TN-KK-${Math.floor(1000 + Math.random() * 9000)}`,
            languages: finalGuideInfo?.languages || ['Tamil', 'English'],
            isApproved: true
          } : undefined
        });
        await user.save();
        console.log(`✅ New ${finalRole} account created: ${user.email}`);
      } else {
        user.isVerified = true;
        user.role = finalRole;
        user.name = finalName;
        user.password = hashedPassword;
        await user.save();
        console.log(`✅ Existing user verified: ${user.email}`);
      }
    } catch (dbErr) {
      console.error(`⚠️ DB error: ${dbErr.message}`);
      user = { _id: 'user-' + Date.now(), name: finalName, email: emailKey, role: finalRole, isVerified: true };
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: `🎉 Email verified! Your ${finalRole} account has been created.`,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isVerified: true }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// 4. SEND OTP FOR PASSWORD CHANGE (requires logged-in user email)
// =========================================================================
router.post('/send-password-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const emailKey = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailKey });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email.' });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore.set(`pwd-${emailKey}`, {
      otp: generatedOtp,
      purpose: 'password-change',
      createdAt: Date.now()
    });

    console.log(`\n🔑 PASSWORD CHANGE OTP for [${emailKey}]: ${generatedOtp}\n`);

    try {
      await sendOtpEmail(emailKey, generatedOtp, user.name, 'password-change');
      res.json({
        success: true,
        message: `Verification code sent to ${emailKey} for password change.`,
        emailSent: true
      });
    } catch (mailErr) {
      console.error(`❌ Email failed: ${mailErr.message}`);
      res.status(500).json({
        success: false,
        message: `Failed to send email: ${mailErr.message}`
      });
    }

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// 5. VERIFY OTP & UPDATE PASSWORD
// =========================================================================
router.post('/verify-password-otp', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const emailKey = (email || '').toLowerCase().trim();
    const storedData = otpStore.get(`pwd-${emailKey}`);
    const submittedOtp = (otp || '').trim();

    if (storedData && Date.now() - storedData.createdAt > 10 * 60 * 1000) {
      otpStore.delete(`pwd-${emailKey}`);
      return res.status(400).json({ success: false, message: 'Verification code has expired.' });
    }

    if (!storedData || storedData.otp !== submittedOtp) {
      return res.status(400).json({ success: false, message: 'Invalid verification code.' });
    }

    otpStore.delete(`pwd-${emailKey}`);

    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ success: false, message: 'New password must be at least 4 characters.' });
    }

    const user = await User.findOne({ email: emailKey });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    console.log(`✅ Password updated for: ${emailKey}`);

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      success: true,
      message: '🎉 Password updated successfully!',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// 6. GOOGLE OAUTH LOGIN
// =========================================================================
router.post('/google', async (req, res) => {
  try {
    const { credential, userInfo, role } = req.body;
    let googleUser = userInfo || {};

    if (credential) {
      try {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();
        googleUser = { googleId: payload.sub, email: payload.email, name: payload.name, picture: payload.picture };
      } catch {
        try {
          const base64Url = credential.split('.')[1];
          if (base64Url) {
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
            const payload = JSON.parse(jsonPayload);
            googleUser = { googleId: payload.sub, email: payload.email, name: payload.name, picture: payload.picture };
          }
        } catch { /* fallback */ }
      }
    }

    if (!googleUser.email) {
      return res.status(400).json({ success: false, message: 'Invalid Google authentication payload' });
    }

    let user;
    try {
      user = await User.findOne({ email: googleUser.email });
      if (!user) {
        user = new User({ name: googleUser.name || googleUser.email.split('@')[0], email: googleUser.email, googleId: googleUser.googleId, avatar: googleUser.picture, role: role || 'Tourist', isVerified: true });
        await user.save();
      } else {
        if (googleUser.googleId) user.googleId = googleUser.googleId;
        if (googleUser.picture) user.avatar = googleUser.picture;
        user.isVerified = true;
        await user.save();
      }
    } catch (dbErr) {
      user = { _id: 'g-' + Date.now(), name: googleUser.name, email: googleUser.email, role: role || 'Tourist', avatar: googleUser.picture };
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, message: 'Google Sign-In Successful', token, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// 7. LOGIN (email + password only — NO OTP needed)
// =========================================================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const emailKey = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailKey });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email. Please register first.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Your account email is not verified. Please register again.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect password. Please try again.' });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// 8. UPDATE PROFILE (Name / Email only — password change uses OTP routes above)
// =========================================================================
router.put('/update-profile', async (req, res) => {
  try {
    const { currentEmail, newName, newEmail } = req.body;
    if (!currentEmail) {
      return res.status(400).json({ success: false, message: 'Current email is required.' });
    }

    const emailKey = currentEmail.toLowerCase().trim();
    const user = await User.findOne({ email: emailKey });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (newEmail && newEmail.toLowerCase().trim() !== emailKey) {
      const exists = await User.findOne({ email: newEmail.toLowerCase().trim() });
      if (exists && exists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }
      user.email = newEmail.toLowerCase().trim();
    }

    if (newName && newName.trim()) {
      user.name = newName.trim();
    }

    await user.save();
    console.log(`✅ Profile updated: [${user.email}] name="${user.name}"`);

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      success: true,
      message: 'Profile updated successfully!',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
