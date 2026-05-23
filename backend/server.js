require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./logger');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
// security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", "https://res.cloudinary.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "https://*.google-analytics.com", "https://*.analytics.google.com"],
    },
  },
  // Allow resources (like images) to be used cross-origin
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cookieParser());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later.' },
});
// Set CORS headers for uploads BEFORE static middleware (no duplicates)
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CSRF not required: JWT is sent via Authorization header (not cookies),
// so browsers cannot auto-submit credentials from cross-origin pages.

const authRoutes = require('./routes/authRoutes');
const commentRoutes = require('./routes/commentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const evidenceRoutes = require('./routes/evidenceRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const rightsRoutes = require('./routes/rightsRoutes');

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api', commentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api', evidenceRoutes);
app.use('/api/users', userRoutes);
app.use('/api', contactRoutes);
app.use('/api', rightsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'undefined' });
});

const pool = require('./db/db');

app.get('/api/db-health', async (req, res) => {
  try {
    const r = await pool.query('SELECT current_database() AS db, current_user AS usr');
    res.json({ ok: true, ...r.rows[0] });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

if (process.env.NODE_ENV === 'production') {
  const frontendRoot = path.resolve(__dirname, '../frontend');

  const buildPath = path.join(frontendRoot, 'build');
  const distPath = path.join(frontendRoot, 'dist');

  const fs = require('fs');
  const usePath = fs.existsSync(path.join(distPath, 'index.html'))
    ? distPath
    : buildPath;

  app.use(express.static(usePath));

  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(usePath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('StreetLens running!');
  });
}

const PORT = process.env.PORT || 8000;

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(
      `Server running on port ${PORT} (NODE_ENV=${process.env.NODE_ENV || 'undefined'})`
    );
  });
}

module.exports = { app, logger };

// Global error handler middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});
