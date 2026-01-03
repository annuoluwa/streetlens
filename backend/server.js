require('dotenv').config();
const express = require('express');
const app = express();

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

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});