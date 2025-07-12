const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Simple server working' });
});

// Try to import auth routes only
try {
  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded');
} catch (error) {
  console.error('❌ Auth routes error:', error.message);
}

// Try to import energy routes
try {
  const energyRoutes = require('./routes/energyRoutes');
  app.use('/api/energy', energyRoutes);
  console.log('✅ Energy routes loaded');
} catch (error) {
  console.error('❌ Energy routes error:', error.message);
}

// Try to import user routes
try {
  const userRoutes = require('./routes/userRoutes');
  app.use('/api/users', userRoutes);
  console.log('✅ User routes loaded');
} catch (error) {
  console.error('❌ User routes error:', error.message);
}

// Try to import recommendation routes
try {
  const recommendationRoutes = require('./routes/recommendationRoutes');
  app.use('/api/recommendations', recommendationRoutes);
  console.log('✅ Recommendation routes loaded');
} catch (error) {
  console.error('❌ Recommendation routes error:', error.message);
}

const PORT = process.env.PORT || 5001;

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  
  app.listen(PORT, () => {
    console.log(`🚀 Test server running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});
