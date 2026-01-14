require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const winston = require('winston');

const app = express();

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

module.exports = app;
