const mongoose = require('mongoose');

const energyUsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    index: true
  },
  energyData: {
    renewable: {
      solar: {
        consumption: { type: Number, default: 0, min: 0 }, // kWh
        cost: { type: Number, default: 0, min: 0 }, // $ per kWh
        source: { type: String, default: 'solar_panels' }
      },
      wind: {
        consumption: { type: Number, default: 0, min: 0 },
        cost: { type: Number, default: 0, min: 0 },
        source: { type: String, default: 'wind_turbine' }
      },
      hydro: {
        consumption: { type: Number, default: 0, min: 0 },
        cost: { type: Number, default: 0, min: 0 },
        source: { type: String, default: 'hydroelectric' }
      },
      other: {
        consumption: { type: Number, default: 0, min: 0 },
        cost: { type: Number, default: 0, min: 0 },
        source: { type: String, default: 'other_renewable' }
      }
    },
    nonRenewable: {
      grid: {
        consumption: { type: Number, default: 0, min: 0 },
        cost: { type: Number, default: 0, min: 0 },
        source: { type: String, default: 'electrical_grid' }
      },
      generator: {
        consumption: { type: Number, default: 0, min: 0 },
        cost: { type: Number, default: 0, min: 0 },
        source: { type: String, default: 'diesel_generator' }
      }
    }
  },
  peakHours: {
    start: { type: String, default: '09:00' }, // HH:MM format
    end: { type: String, default: '17:00' },
    consumption: { type: Number, default: 0, min: 0 }
  },
  offPeakHours: {
    consumption: { type: Number, default: 0, min: 0 }
  },
  totalConsumption: {
    type: Number,
    required: true,
    min: 0
  },
  totalCost: {
    type: Number,
    required: true,
    min: 0
  },
  renewablePercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  carbonFootprint: {
    type: Number, // kg CO2 equivalent
    default: 0,
    min: 0
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
energyUsageSchema.index({ userId: 1, date: -1 });
energyUsageSchema.index({ userId: 1, createdAt: -1 });
energyUsageSchema.index({ renewablePercentage: -1 });

// Pre-save middleware to calculate totals and percentages
energyUsageSchema.pre('save', function(next) {
  // Calculate total renewable consumption
  const renewableTotal = 
    this.energyData.renewable.solar.consumption +
    this.energyData.renewable.wind.consumption +
    this.energyData.renewable.hydro.consumption +
    this.energyData.renewable.other.consumption;

  // Calculate total non-renewable consumption
  const nonRenewableTotal = 
    this.energyData.nonRenewable.grid.consumption +
    this.energyData.nonRenewable.generator.consumption;

  // Update total consumption
  this.totalConsumption = renewableTotal + nonRenewableTotal;

  // Calculate total cost
  this.totalCost = 
    (this.energyData.renewable.solar.consumption * this.energyData.renewable.solar.cost) +
    (this.energyData.renewable.wind.consumption * this.energyData.renewable.wind.cost) +
    (this.energyData.renewable.hydro.consumption * this.energyData.renewable.hydro.cost) +
    (this.energyData.renewable.other.consumption * this.energyData.renewable.other.cost) +
    (this.energyData.nonRenewable.grid.consumption * this.energyData.nonRenewable.grid.cost) +
    (this.energyData.nonRenewable.generator.consumption * this.energyData.nonRenewable.generator.cost);

  // Calculate renewable percentage
  this.renewablePercentage = this.totalConsumption > 0 
    ? Math.round((renewableTotal / this.totalConsumption) * 100) 
    : 0;

  // Calculate carbon footprint (simplified calculation)
  // Assuming: Solar = 0.04, Wind = 0.01, Hydro = 0.02, Grid = 0.5, Generator = 0.8 kg CO2/kWh
  this.carbonFootprint = 
    (this.energyData.renewable.solar.consumption * 0.04) +
    (this.energyData.renewable.wind.consumption * 0.01) +
    (this.energyData.renewable.hydro.consumption * 0.02) +
    (this.energyData.renewable.other.consumption * 0.03) +
    (this.energyData.nonRenewable.grid.consumption * 0.5) +
    (this.energyData.nonRenewable.generator.consumption * 0.8);

  this.updatedAt = Date.now();
  next();
});

// Static method to get usage statistics for a user
energyUsageSchema.statics.getUserStats = async function(userId, startDate, endDate) {
  const stats = await this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalConsumption: { $sum: '$totalConsumption' },
        totalCost: { $sum: '$totalCost' },
        avgRenewablePercentage: { $avg: '$renewablePercentage' },
        totalCarbonFootprint: { $sum: '$carbonFootprint' },
        recordCount: { $sum: 1 }
      }
    }
  ]);

  return stats.length > 0 ? stats[0] : null;
};

module.exports = mongoose.model('EnergyUsage', energyUsageSchema);
