require('dotenv').config();

const express = require('express');
const app = express();

// Winston logger setup
const winston = require('winston');
const transports = [];
// Log to Console in all environments; production logs appear in Render dashboard
transports.push(new winston.transports.Console());

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports,
});

const path = require('path');
const cors = require('cors');


app.use(cors());
app.use(express.json());

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);


const commentRoutes = require('./routes/commentRoutes');
app.use('/api', commentRoutes);

const reportRoutes = require('./routes/reportRoutes');
app.use('/api/reports', reportRoutes);

const evidenceRoutes = require('./routes/evidenceRoutes');
app.use('/api', evidenceRoutes);


const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);


app.get('/', (req, res) => {
  res.send('StreetLens running!');
});

// Serve React build in production (single host)
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '../frontend/build');
  app.use(express.static(frontendBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 8000;
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

module.exports = app;