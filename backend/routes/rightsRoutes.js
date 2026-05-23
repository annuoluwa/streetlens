const express = require('express');
const router = express.Router();
const rightsData = require('../data/right.json');
const emailMap = require('../utils/email.json');

router.get('/rights', (req, res) => {
  res.json(rightsData);
});

// Returns the council email for a given city using partial case-insensitive matching.
// e.g. "Manchester" matches "Manchester City Council"
router.get('/council-email', (req, res) => {
  const city = (req.query.city || '').toLowerCase().trim();
  if (!city) return res.json({ email: null });

  const entry = Object.entries(emailMap).find(([key]) =>
    key.toLowerCase().includes(city)
  );

  res.json({ email: entry ? entry[1] : null });
});

module.exports = router;
