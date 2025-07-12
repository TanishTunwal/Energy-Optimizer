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
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Import and test auth routes one by one
console.log('Loading auth routes...');
try {
  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading auth routes:', error.message);
  process.exit(1);
}

console.log('Loading energy routes...');
try {
  const energyRoutes = require('./routes/energyRoutes');
  app.use('/api/energy', energyRoutes);
  console.log('✅ Energy routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading energy routes:', error.message);
  process.exit(1);
}

console.log('Loading recommendation routes...');
try {
  const recommendationRoutes = require('./routes/recommendationRoutes');
  app.use('/api/recommendations', recommendationRoutes);
  console.log('✅ Recommendation routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading recommendation routes:', error.message);
  process.exit(1);
}

console.log('Loading user routes...');
try {
  const userRoutes = require('./routes/userRoutes');
  app.use('/api/users', userRoutes);
  console.log('✅ User routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading user routes:', error.message);
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

// Database connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('✅ Connected to MongoDB');
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  });
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});
