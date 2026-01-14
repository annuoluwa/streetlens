import React from 'react';

const AboutPage = () => (
  <div style={{ maxWidth: 700, margin: '2rem auto', background: '#f8f9fa', borderRadius: 8, boxShadow: '0 2px 8px rgba(44,62,80,0.08)', padding: '2rem' }}>
    <h2 style={{ color: '#21618c', fontWeight: 'bold', marginBottom: '1.2rem' }}>About StreetLens</h2>
    <p style={{ fontSize: '1.1rem', marginBottom: '1.2rem' }}>
      <strong>StreetLens</strong> is a community-powered platform for reporting, tracking, and escalating rent abuse and housing issues in your area. Our mission is to empower tenants, residents, and local authorities to work together for safer, fairer, and more transparent housing.
    </p>
    <ul style={{ fontSize: '1.05rem', marginBottom: '1.2rem' }}>
      <li>Submit and track reports of rent abuse, unsafe conditions, or unfair practices.</li>
      <li>Escalate urgent cases to local councils and authorities.</li>
      <li>Admins can review, flag, and manage reports for effective action.</li>
      <li>Receive notifications and updates on your cases.</li>
      <li>Access your profile to manage your account and view your report history.</li>
    </ul>
    <p style={{ fontSize: '1.05rem', color: '#555' }}>
      StreetLens is built with privacy and security in mind. Your data is protected, and your voice matters. Join us in making housing better for everyone.
    </p>
    <hr style={{ margin: '2rem 0' }} />
    <p style={{ fontSize: '1rem', color: '#888' }}>
      For questions, feedback, or partnership inquiries, please <a href="/contact" style={{ color: '#3498db', textDecoration: 'underline' }}>contact us</a>.
    </p>
  </div>
);

export default AboutPage;
