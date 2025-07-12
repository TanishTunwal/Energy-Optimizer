const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Renewable Energy Optimizer API is running',
    timestamp: new Date().toISOString()
  });
});

// Load routes one by one to isolate the error
try {
  console.log('Loading auth routes...');
  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);
  console.log('Auth routes loaded successfully');
} catch (error) {
  console.error('Error loading auth routes:', error);
}

try {
  console.log('Loading energy routes...');
  const energyRoutes = require('./routes/energyRoutes');
  app.use('/api/energy', energyRoutes);
  console.log('Energy routes loaded successfully');
} catch (error) {
  console.error('Error loading energy routes:', error);
}

try {
  console.log('Loading recommendation routes...');
  const recommendationRoutes = require('./routes/recommendationRoutes');
  app.use('/api/recommendations', recommendationRoutes);
  console.log('Recommendation routes loaded successfully');
} catch (error) {
  console.error('Error loading recommendation routes:', error);
}

try {
  console.log('Loading user routes...');
  const userRoutes = require('./routes/userRoutes');
  app.use('/api/users', userRoutes);
  console.log('User routes loaded successfully');
} catch (error) {
  console.error('Error loading user routes:', error);
}

// Catch-all route for undefined endpoints
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 5000;

// Database connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
