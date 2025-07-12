const mongoose = require('mongoose');
const User = require('../models/User');
const EnergyUsage = require('../models/EnergyUsage');
const Recommendation = require('../models/Recommendation');
require('dotenv').config();

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await EnergyUsage.deleteMany({});
    await Recommendation.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@renewableoptimizer.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('👑 Created admin user');

    // Create retailer users
    const retailerUsers = await User.insertMany([
      {
        name: 'John Smith',
        email: 'john@grocerystore.com',
        password: 'password123',
        role: 'retailer',
        businessName: 'Green Valley Grocery',
        businessType: 'grocery',
        location: {
          address: '123 Main St',
          city: 'Green Valley',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        }
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@fashionboutique.com',
        password: 'password123',
        role: 'retailer',
        businessName: 'Eco Fashion Boutique',
        businessType: 'clothing',
        location: {
          address: '456 Oak Ave',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102',
          country: 'USA'
        }
      },
      {
        name: 'Mike Chen',
        email: 'mike@techstore.com',
        password: 'password123',
        role: 'retailer',
        businessName: 'Tech Solutions Store',
        businessType: 'electronics',
        location: {
          address: '789 Pine St',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90028',
          country: 'USA'
        }
      },
      {
        name: 'Lisa Davis',
        email: 'lisa@greenpharmacy.com',
        password: 'password123',
        role: 'retailer',
        businessName: 'Green Health Pharmacy',
        businessType: 'pharmacy',
        location: {
          address: '321 Cedar Blvd',
          city: 'Sacramento',
          state: 'CA',
          zipCode: '95814',
          country: 'USA'
        }
      }
    ]);

    console.log('🏪 Created retailer users');

    // Create energy usage data for the last 30 days
    const energyDataPromises = [];
    
    for (const user of retailerUsers) {
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        // Generate random but realistic energy data
        const solarConsumption = Math.random() * 50 + 10; // 10-60 kWh
        const windConsumption = Math.random() * 20 + 5;   // 5-25 kWh
        const hydroConsumption = Math.random() * 15 + 3;  // 3-18 kWh
        const gridConsumption = Math.random() * 80 + 20;  // 20-100 kWh
        const generatorConsumption = Math.random() * 10;  // 0-10 kWh

        const energyData = {
          userId: user._id,
          date: date,
          energyData: {
            renewable: {
              solar: {
                consumption: solarConsumption,
                cost: 0.12, // $0.12 per kWh
                source: 'solar_panels'
              },
              wind: {
                consumption: windConsumption,
                cost: 0.10, // $0.10 per kWh
                source: 'wind_turbine'
              },
              hydro: {
                consumption: hydroConsumption,
                cost: 0.08, // $0.08 per kWh
                source: 'hydroelectric'
              },
              other: {
                consumption: 0,
                cost: 0,
                source: 'other_renewable'
              }
            },
            nonRenewable: {
              grid: {
                consumption: gridConsumption,
                cost: 0.18, // $0.18 per kWh
                source: 'electrical_grid'
              },
              generator: {
                consumption: generatorConsumption,
                cost: 0.25, // $0.25 per kWh
                source: 'diesel_generator'
              }
            }
          },
          peakHours: {
            start: '09:00',
            end: '17:00',
            consumption: (solarConsumption + windConsumption + hydroConsumption + gridConsumption + generatorConsumption) * 0.6
          },
          offPeakHours: {
            consumption: (solarConsumption + windConsumption + hydroConsumption + gridConsumption + generatorConsumption) * 0.4
          },
          notes: i === 0 ? 'Latest energy usage data' : ''
        };

        energyDataPromises.push(EnergyUsage.create(energyData));
      }
    }

    await Promise.all(energyDataPromises);
    console.log('⚡ Created energy usage data');

    // Create sample recommendations
    const sampleRecommendations = [];

    for (const user of retailerUsers) {
      sampleRecommendations.push(
        {
          userId: user._id,
          type: 'energy_mix',
          title: 'Increase Solar Energy Usage',
          description: 'Your current renewable energy usage is 35%. Increasing solar capacity could reduce costs by 15%.',
          priority: 'high',
          status: 'pending',
          recommendations: {
            currentEnergyMix: {
              renewablePercentage: 35,
              nonRenewablePercentage: 65
            },
            suggestedEnergyMix: {
              renewablePercentage: 55,
              nonRenewablePercentage: 45
            },
            potentialSavings: {
              costSavings: 250,
              carbonReduction: 500,
              energyEfficiency: 100
            },
            actionItems: [
              {
                action: 'Install additional solar panels',
                impact: 'high',
                effort: 'high',
                timeframe: 'long_term'
              },
              {
                action: 'Optimize energy usage during peak solar hours',
                impact: 'medium',
                effort: 'low',
                timeframe: 'immediate'
              }
            ]
          },
          mlConfidence: 0.85
        },
        {
          userId: user._id,
          type: 'cost_optimization',
          title: 'Reduce Peak Hour Usage',
          description: 'You consume 65% of your energy during peak hours. Shifting usage could save $150/month.',
          priority: 'medium',
          status: 'pending',
          recommendations: {
            potentialSavings: {
              costSavings: 150,
              energyEfficiency: 50
            },
            actionItems: [
              {
                action: 'Schedule high-energy tasks during off-peak hours',
                impact: 'high',
                effort: 'low',
                timeframe: 'immediate'
              },
              {
                action: 'Install smart timers for appliances',
                impact: 'medium',
                effort: 'medium',
                timeframe: 'short_term'
              }
            ]
          },
          mlConfidence: 0.75
        }
      );
    }

    await Recommendation.insertMany(sampleRecommendations);
    console.log('💡 Created sample recommendations');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👤 Users created: ${1 + retailerUsers.length}`);
    console.log(`⚡ Energy records created: ${retailerUsers.length * 30}`);
    console.log(`💡 Recommendations created: ${sampleRecommendations.length}`);
    console.log('\n🔐 Test Credentials:');
    console.log('Admin: admin@renewableoptimizer.com / admin123');
    console.log('Retailer: john@grocerystore.com / password123');
    console.log('Retailer: sarah@fashionboutique.com / password123');
    console.log('Retailer: mike@techstore.com / password123');
    console.log('Retailer: lisa@greenpharmacy.com / password123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;
