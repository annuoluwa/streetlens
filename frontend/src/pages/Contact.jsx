import React, { useState } from 'react';
import api from '../utils/api';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in your name, email and message.');
      return;
    }

    setSubmitting(true);
    const eventId = crypto.randomUUID();
    try {
      await api.post('/contact', { name, email, message, eventId });
      if (window.fbq) window.fbq('track', 'Lead', {}, { eventID: eventId });
      setSuccess('Thanks for reaching out. Your message has been sent.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: 720 }}>
      <div className="mb-4 text-center">
        <h1 className="h2 mb-2">Contact StreetLens</h1>
        <p className="text-muted mb-0">
          Have questions about housing transparency, the product, or your case study? Send a message directly to the founder.
        </p>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="card shadow-sm p-4 border-0">
        <div className="mb-3">
          <label className="form-label fw-semibold" htmlFor="contact-name">Name</label>
          <input
            id="contact-name"
            type="text"
            className="form-control"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold" htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            type="email"
            className="form-control"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold" htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            className="form-control"
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Tell me about your housing story, product questions, or feedback."
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? 'Sending…' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default Contact;
