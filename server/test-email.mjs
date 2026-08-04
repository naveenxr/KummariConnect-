import nodemailer from 'nodemailer';

const EMAIL_USER = 'n84677462@gmail.com';
const EMAIL_PASS = 'hxae klup olqj tofs';

console.log('Testing Gmail SMTP...');
console.log('User:', EMAIL_USER);
console.log('Pass length:', EMAIL_PASS.length);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

transporter.verify((err, success) => {
  if (err) {
    console.log('❌ SMTP Verification FAILED');
    console.log('Error:', err.message);
    console.log('Code:', err.code);
    console.log('');
    console.log('Common fixes:');
    console.log('1. Make sure 2-Step Verification is ON for', EMAIL_USER);
    console.log('2. Generate a fresh App Password at: https://myaccount.google.com/apppasswords');
    console.log('3. The App Password should be 16 characters (without spaces)');
    console.log('4. Update EMAIL_PASS in server/.env with the new password');
  } else {
    console.log('✅ SMTP Verified! Server is ready to send emails.');
    
    // Try sending a test email
    transporter.sendMail({
      from: `"KummariConnect Test" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      subject: '✅ Test Email from KummariConnect',
      text: 'This is a test email to verify Nodemailer is working correctly!'
    }, (err2, info) => {
      if (err2) {
        console.log('❌ Send failed:', err2.message);
      } else {
        console.log('✅ Test email sent! Message ID:', info.messageId);
        console.log('Check your inbox at:', EMAIL_USER);
      }
    });
  }
});
