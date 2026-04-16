import React from 'react';

const LegalPage = () => (
  <div style={{ maxWidth: 700, margin: '2rem auto', background: '#f8f9fa', borderRadius: 8, boxShadow: '0 2px 8px rgba(44,62,80,0.08)', padding: '2rem' }}>
    <h2 style={{ color: '#21618c', fontWeight: 'bold', marginBottom: '1.2rem' }}>Disclaimer & Limitation of Liability</h2>
    <p style={{ fontSize: '1.1rem', marginBottom: '1.2rem' }}>
      <strong>StreetLens</strong> ("we", "us", "our")
    </p>

    <h3 style={{ color: '#21618c', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.8rem' }}>1. General</h3>
    <p style={{ fontSize: '1.05rem', marginBottom: '1.2rem' }}>
      This website is operated as a community information platform. By using this site, you agree to the terms set out below. Nothing in these terms affects your statutory rights under UK law.
    </p>

    <h3 style={{ color: '#21618c', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.8rem' }}>2. No Liability for Death or Personal Injury</h3>
    <p style={{ fontSize: '1.05rem', marginBottom: '1.2rem' }}>
      We do not exclude or limit liability for death or personal injury caused by our negligence, or for fraudulent misrepresentation, as required under the Unfair Contract Terms Act 1977 and the Consumer Rights Act 2015.
    </p>

    <h3 style={{ color: '#21618c', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.8rem' }}>3. Accuracy of Information</h3>
    <p style={{ fontSize: '1.05rem', marginBottom: '1.2rem' }}>
      Content and data on this site is provided for general community information and discussion purposes only. Whilst we take reasonable care to ensure content is accurate, we make no warranty express or implied as to its completeness or fitness for a particular purpose. We are not liable for any reliance placed on content where it would be unreasonable to do so.
    </p>

    <h3 style={{ color: '#21618c', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.8rem' }}>4. No Professional Advice</h3>
    <p style={{ fontSize: '1.05rem', marginBottom: '1.2rem' }}>
      Nothing on this site constitutes legal, financial, surveying, or professional housing advice. You should always seek independent professional advice before making any housing or property-related decision. We expressly disclaim responsibility for any loss arising from reliance on content as professional advice.
    </p>

    <h3 style={{ color: '#21618c', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.8rem' }}>5. Third-Party Links</h3>
    <p style={{ fontSize: '1.05rem', marginBottom: '1.2rem' }}>
      We are not responsible for the content, accuracy, or practices of any third-party websites linked from this site. Links are provided for convenience only and do not constitute endorsement.
    </p>

    <h3 style={{ color: '#21618c', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.8rem' }}>6. User-Generated Content</h3>
    <p style={{ fontSize: '1.05rem', marginBottom: '1.2rem' }}>
      Comments and community submissions are the views of individual users and do not represent the views of this website. Under the Online Safety Act 2023, we are committed to taking reasonable and proportionate steps to moderate harmful content. However, we are not liable for user-generated content that we have no reasonable knowledge of or have acted promptly to remove upon notification.
    </p>

    <h3 style={{ color: '#21618c', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.8rem' }}>7. Limitation of Liability</h3>
    <p style={{ fontSize: '1.05rem', marginBottom: '0.8rem' }}>
      To the fullest extent permitted by UK law, our total liability to any user in connection with use of this site shall be limited to direct losses only. We exclude liability for:
    </p>
    <ul style={{ fontSize: '1.05rem', marginBottom: '1.2rem', paddingLeft: '1.5rem' }}>
      <li>Indirect or consequential loss</li>
      <li>Loss of data</li>
      <li>Loss of profit or anticipated savings</li>
      <li>Any loss not reasonably foreseeable at the time of use</li>
    </ul>
    <p style={{ fontSize: '1.05rem', marginBottom: '1.2rem' }}>
      This limitation applies whether the claim arises in contract, tort, or otherwise, and is subject to Clause 2 above.
    </p>

    <h3 style={{ color: '#21618c', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.8rem' }}>8. Fairness & Reasonableness</h3>
    <p style={{ fontSize: '1.05rem', marginBottom: '1.2rem' }}>
      These terms are intended to be fair and reasonable within the meaning of the Consumer Rights Act 2015 and the Unfair Contract Terms Act 1977. Any term found to be unenforceable shall be severed, leaving the remainder of these terms in full force.
    </p>

    <h3 style={{ color: '#21618c', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.8rem' }}>9. Governing Law</h3>
    <p style={{ fontSize: '1.05rem', marginBottom: '1.2rem' }}>
      These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
    </p>

    <hr style={{ margin: '2rem 0' }} />
    <p style={{ fontSize: '1rem', color: '#888' }}>
      For legal questions or concerns, please <a href="/contact" style={{ color: '#3498db', textDecoration: 'underline' }}>contact us</a>.
    </p>
  </div>
);

export default LegalPage;
