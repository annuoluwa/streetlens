require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');




app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const postRoutes = require('./routes/postRoutes');
app.use('/api/posts', postRoutes);

const commentRoutes = require('./routes/commentRoutes');
app.use('/api/comments', commentRoutes);

app.get('/', (req, res) => {
  res.send('StreetLens running!');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});