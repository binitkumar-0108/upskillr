require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'UpSkillr API running' });
});

app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/courses', require('./routes/courseVideoRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
