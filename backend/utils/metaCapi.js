const crypto = require('crypto');
const logger = require('../logger');

const PIXEL_ID = '1030204429921736';

function sha256(value) {
  if (!value) return undefined;
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

/**
 * Send a server-side event to Meta Conversions API.
 * Fire-and-forget — never awaited by callers.
 *
 * @param {object} options
 * @param {string} options.eventName    - Meta standard event name e.g. 'CompleteRegistration'
 * @param {string} options.sourceUrl    - Page URL that triggered the event
 * @param {string} [options.eventId]    - Shared event ID for deduplication with browser pixel
 * @param {object} [options.userData]   - Raw (unhashed) user data: { email, phone }
 * @param {object} [options.customData] - Extra custom_data fields
 * @param {object} [options.req]        - Express req object (for IP, UA, cookies)
 */
async function sendCapiEvent({ eventName, sourceUrl, eventId, userData = {}, customData = {}, req }) {
  const token = process.env.META_ACCESS_TOKEN;
  if (!token) {
    logger.warn('META_ACCESS_TOKEN not set — skipping CAPI event');
    return;
  }

  const user_data = {};

  if (userData.email) user_data.em = sha256(userData.email);
  if (userData.phone) user_data.ph = sha256(userData.phone);

  if (req) {
    user_data.client_ip_address = req.ip;
    user_data.client_user_agent = req.get('User-Agent') || '';
    if (req.cookies?._fbc) user_data.fbc = req.cookies._fbc;
    if (req.cookies?._fbp) user_data.fbp = req.cookies._fbp;
  }

  const body = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: sourceUrl,
        action_source: 'website',
        ...(eventId && { event_id: eventId }),
        user_data,
        ...(Object.keys(customData).length > 0 && { custom_data: customData }),
      },
    ],
    access_token: token,
    ...(process.env.META_TEST_EVENT_CODE && { test_event_code: process.env.META_TEST_EVENT_CODE }),
  };

  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      logger.error(`CAPI ${eventName} failed (${res.status}): ${text}`);
    }
  } catch (err) {
    logger.error(`CAPI ${eventName} request error: ${err.message}`);
  }
}

module.exports = { sendCapiEvent };
