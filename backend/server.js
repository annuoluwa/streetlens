require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./logger');
const rateLimit = require('express-rate-limit');
// const cookieParser = require('cookie-parser');
const csurf = require('csurf');
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
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles if needed
      // Add other directives as necessary
    },
  },
}));
app.use(cookieParser());
// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CSRF protection middleware
// const csrfProtection = csurf({ cookie: true });
// app.use(csrfProtection);

// Removed CSRF token endpoint since CSRF is disabled
// app.get('/api/csrf-token', (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });

// CSRF protection disabled - app is secured with other measures
// app.use('/api', (req, res, next) => {
//   if (req.path === '/csrf-token') return next();
//   csrfProtection(req, res, next);
// });

const authRoutes = require('./routes/authRoutes');
const commentRoutes = require('./routes/commentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const evidenceRoutes = require('./routes/evidenceRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api', commentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api', evidenceRoutes);
app.use('/api/users', userRoutes);

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
