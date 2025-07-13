const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createTestUsers() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/renewable-energy-optimizer');
    console.log('✅ Connected to MongoDB');
    
    // First, let's check what users exist
    const allUsers = await User.find({});
    console.log(`📊 Found ${allUsers.length} existing users in database`);
    
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'demo@test.com' });
    if (existingUser) {
      console.log('✅ Demo user already exists: demo@test.com');
      console.log('📧 Email: demo@test.com');
      console.log('🔑 Password: demo123');
      await mongoose.disconnect();
      return;
    }
    
    // Create demo user
    console.log('👤 Creating demo user...');
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@test.com',
      password: 'demo123',
      role: 'retailer',
      businessName: 'Demo Business',
      businessType: 'retail'
    });
    
    console.log('✅ Demo user created successfully!');
    console.log('📧 Email: demo@test.com');
    console.log('🔑 Password: demo123');
    console.log('👤 User ID:', demoUser._id);
    
    await mongoose.disconnect();
    console.log('🏁 Script completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

console.log('🚀 Starting test user creation script...');
createTestUsers();
