import React from 'react';

const PrivacyPage = () => (
  <div style={{ maxWidth: 700, margin: '2rem auto', background: '#f8f9fa', borderRadius: 8, boxShadow: '0 2px 8px rgba(44,62,80,0.08)', padding: '2rem' }}>
    <h2 style={{ color: '#21618c', fontWeight: 'bold', marginBottom: '1.2rem' }}>Privacy Policy</h2>
    <p style={{ fontSize: '1.1rem', marginBottom: '1.2rem' }}>
      <strong>StreetLens</strong> is committed to protecting your privacy and personal data. This policy explains how we collect, use, and safeguard your information when you use our platform.
    </p>
    <ul style={{ fontSize: '1.05rem', marginBottom: '1.2rem' }}>
      <li>We collect only the information necessary to provide our services, such as your email, username, and report details.</li>
      <li>Your data is stored securely and is never sold or shared with third parties except for legal compliance or with your explicit consent.</li>
      <li>All sensitive information, including passwords, is encrypted and protected.</li>
      <li>You can access, update, or delete your account information at any time from your profile page.</li>
      <li>We use cookies only for authentication and session management; no tracking or advertising cookies are used.</li>
      <li>Reports may be shared with local authorities for escalation, but your identity will remain protected unless you choose otherwise.</li>
    </ul>
    <p style={{ fontSize: '1.05rem', color: '#555' }}>
      By using StreetLens, you agree to this privacy policy. We may update this policy as needed, and changes will be posted here.
    </p>
    <hr style={{ margin: '2rem 0' }} />
    <p style={{ fontSize: '1rem', color: '#888' }}>
      For privacy questions or requests, please <a href="/contact" style={{ color: '#3498db', textDecoration: 'underline' }}>contact us</a>.
    </p>
  </div>
);

export default PrivacyPage;
