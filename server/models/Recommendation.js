const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  type: {
    type: String,
    enum: ['energy_mix', 'cost_optimization', 'carbon_reduction', 'peak_hour_shift'],
    required: [true, 'Recommendation type is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'viewed', 'implemented', 'dismissed'],
    default: 'pending'
  },
  recommendations: {
    currentEnergyMix: {
      renewablePercentage: { type: Number, min: 0, max: 100 },
      nonRenewablePercentage: { type: Number, min: 0, max: 100 }
    },
    suggestedEnergyMix: {
      renewablePercentage: { type: Number, min: 0, max: 100 },
      nonRenewablePercentage: { type: Number, min: 0, max: 100 }
    },
    potentialSavings: {
      costSavings: { type: Number, min: 0 }, // Monthly savings in $
      carbonReduction: { type: Number, min: 0 }, // kg CO2 reduction per month
      energyEfficiency: { type: Number, min: 0 } // kWh savings per month
    },
    actionItems: [{
      action: { type: String, required: true },
      impact: { type: String, enum: ['low', 'medium', 'high'] },
      effort: { type: String, enum: ['low', 'medium', 'high'] },
      timeframe: { type: String, enum: ['immediate', 'short_term', 'long_term'] }
    }]
  },
  mlConfidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.5
  },
  basedOnData: {
    dataPoints: { type: Number, default: 0 },
    dateRange: {
      start: Date,
      end: Date
    },
    patterns: [String]
  },
  implementationDate: Date,
  expiryDate: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    }
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

// Indexes for efficient queries
recommendationSchema.index({ userId: 1, status: 1, priority: -1 });
recommendationSchema.index({ userId: 1, createdAt: -1 });
recommendationSchema.index({ expiryDate: 1 });
recommendationSchema.index({ type: 1, priority: -1 });

// Pre-save middleware to update timestamps
recommendationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to mark recommendation as implemented
recommendationSchema.methods.markAsImplemented = async function() {
  this.status = 'implemented';
  this.implementationDate = new Date();
  await this.save();
};

// Method to check if recommendation is expired
recommendationSchema.methods.isExpired = function() {
  return new Date() > this.expiryDate;
};

// Static method to get active recommendations for a user
recommendationSchema.statics.getActiveRecommendations = async function(userId) {
  return await this.find({
    userId,
    status: { $in: ['pending', 'viewed'] },
    expiryDate: { $gt: new Date() }
  }).sort({ priority: -1, createdAt: -1 });
};

// Static method to clean up expired recommendations
recommendationSchema.statics.cleanupExpired = async function() {
  const result = await this.deleteMany({
    expiryDate: { $lt: new Date() },
    status: { $in: ['pending', 'viewed'] }
  });
  return result.deletedCount;
};

// Virtual for calculating days until expiry
recommendationSchema.virtual('daysUntilExpiry').get(function() {
  const now = new Date();
  const expiry = this.expiryDate;
  const diffTime = expiry - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
