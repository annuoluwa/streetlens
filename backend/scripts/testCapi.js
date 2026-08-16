/**
 * Manual CAPI test script.
 * Fires a test CompleteRegistration event to Meta's Test Events screen.
 *
 * Usage:
 *   node scripts/testCapi.js
 *
 * Remove META_TEST_EVENT_CODE from .env.production when testing is done.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.production') });

const PIXEL_ID = '1030204429921736';
const crypto = require('crypto');

function sha256(value) {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

async function run() {
  const token = process.env.META_ACCESS_TOKEN;
  const testCode = process.env.META_TEST_EVENT_CODE;

  if (!token) {
    console.error('ERROR: META_ACCESS_TOKEN is not set in .env.production');
    process.exit(1);
  }

  console.log(`Sending test event to Meta CAPI...`);
  console.log(`Pixel ID  : ${PIXEL_ID}`);
  console.log(`Test code : ${testCode || '(none — live mode)'}`);

  const body = {
    data: [
      {
        event_name: 'CompleteRegistration',
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: 'https://streetlens.kagex.co.uk/register',
        action_source: 'website',
        user_data: {
          em: sha256('test@example.com'),
        },
      },
    ],
    access_token: token,
    ...(testCode && { test_event_code: testCode }),
  };

  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    if (res.ok) {
      console.log('\n✓ SUCCESS — event sent. Check Events Manager > Test Events tab.');
      console.log('Response:', JSON.stringify(json, null, 2));
    } else {
      console.error('\n✗ FAILED');
      console.error('Status:', res.status);
      console.error('Response:', JSON.stringify(json, null, 2));
    }
  } catch (err) {
    console.error('\n✗ Network error:', err.message);
  }
}

run();
