const Recommendation = require('../models/Recommendation');
const MLRecommendationEngine = require('../utils/mlEngine');
const mongoose = require('mongoose');

// Generate new recommendations for user
const generateRecommendations = async (req, res) => {
  try {
    // Generate recommendations using ML engine
    const newRecommendations = await MLRecommendationEngine.generateRecommendations(req.user._id);

    if (newRecommendations.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'No new recommendations available at this time',
        data: {
          recommendations: []
        }
      });
    }

    // Create recommendation documents
    const recommendationDocuments = newRecommendations.map(rec => ({
      ...rec,
      userId: req.user._id
    }));

    const createdRecommendations = await Recommendation.insertMany(recommendationDocuments);

    res.status(201).json({
      status: 'success',
      message: `${createdRecommendations.length} new recommendations generated`,
      data: {
        recommendations: createdRecommendations
      }
    });

  } catch (error) {
    console.error('Generate recommendations error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate recommendations',
      error: error.message
    });
  }
};

// Get user's recommendations
const getRecommendations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { userId: req.user._id };

    // Filter by status
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Filter by type
    if (req.query.type) {
      filter.type = req.query.type;
    }

    // Filter by priority
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    // Filter active recommendations (not expired)
    if (req.query.active === 'true') {
      filter.expiryDate = { $gt: new Date() };
      filter.status = { $in: ['pending', 'viewed'] };
    }

    const recommendations = await Recommendation.find(filter)
      .sort({ priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Recommendation.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        recommendations,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalRecommendations: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPreviousPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get recommendations',
      error: error.message
    });
  }
};

// Get single recommendation
const getRecommendationById = async (req, res) => {
  try {
    const { recommendationId } = req.params;

    const recommendation = await Recommendation.findOne({
      _id: recommendationId,
      userId: req.user._id
    });

    if (!recommendation) {
      return res.status(404).json({
        status: 'error',
        message: 'Recommendation not found'
      });
    }

    // Mark as viewed if it was pending
    if (recommendation.status === 'pending') {
      recommendation.status = 'viewed';
      await recommendation.save();
    }

    res.status(200).json({
      status: 'success',
      data: {
        recommendation
      }
    });

  } catch (error) {
    console.error('Get recommendation by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get recommendation',
      error: error.message
    });
  }
};

// Update recommendation status
const updateRecommendationStatus = async (req, res) => {
  try {
    const { recommendationId } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'viewed', 'implemented', 'dismissed'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid status is required (pending, viewed, implemented, dismissed)'
      });
    }

    const recommendation = await Recommendation.findOne({
      _id: recommendationId,
      userId: req.user._id
    });

    if (!recommendation) {
      return res.status(404).json({
        status: 'error',
        message: 'Recommendation not found'
      });
    }

    recommendation.status = status;
    
    if (status === 'implemented') {
      recommendation.implementationDate = new Date();
    }

    await recommendation.save();

    res.status(200).json({
      status: 'success',
      message: 'Recommendation status updated successfully',
      data: {
        recommendation
      }
    });

  } catch (error) {
    console.error('Update recommendation status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update recommendation status',
      error: error.message
    });
  }
};

// Get recommendation statistics
const getRecommendationStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get counts by status
    const statusStats = await Recommendation.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get counts by type
    const typeStats = await Recommendation.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get counts by priority
    const priorityStats = await Recommendation.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) }
      },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get implementation rate
    const totalRecommendations = await Recommendation.countDocuments({ userId });
    const implementedRecommendations = await Recommendation.countDocuments({ 
      userId, 
      status: 'implemented' 
    });

    const implementationRate = totalRecommendations > 0 
      ? Math.round((implementedRecommendations / totalRecommendations) * 100)
      : 0;

    // Get potential savings from implemented recommendations
    const implementedRecs = await Recommendation.find({
      userId,
      status: 'implemented'
    });

    const totalPotentialSavings = implementedRecs.reduce((total, rec) => {
      const savings = rec.recommendations?.potentialSavings?.costSavings || 0;
      return total + savings;
    }, 0);

    const totalCarbonReduction = implementedRecs.reduce((total, rec) => {
      const reduction = rec.recommendations?.potentialSavings?.carbonReduction || 0;
      return total + reduction;
    }, 0);

    // Get recent recommendations
    const recentRecommendations = await Recommendation.find({
      userId,
      status: { $in: ['pending', 'viewed'] },
      expiryDate: { $gt: new Date() }
    })
    .sort({ priority: -1, createdAt: -1 })
    .limit(5);

    res.status(200).json({
      status: 'success',
      data: {
        summary: {
          totalRecommendations,
          implementedRecommendations,
          implementationRate,
          totalPotentialSavings: Math.round(totalPotentialSavings),
          totalCarbonReduction: Math.round(totalCarbonReduction)
        },
        statusBreakdown: statusStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        typeBreakdown: typeStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        priorityBreakdown: priorityStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        recentRecommendations
      }
    });

  } catch (error) {
    console.error('Get recommendation stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get recommendation statistics',
      error: error.message
    });
  }
};

// Delete recommendation
const deleteRecommendation = async (req, res) => {
  try {
    const { recommendationId } = req.params;

    const recommendation = await Recommendation.findOneAndDelete({
      _id: recommendationId,
      userId: req.user._id
    });

    if (!recommendation) {
      return res.status(404).json({
        status: 'error',
        message: 'Recommendation not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Recommendation deleted successfully'
    });

  } catch (error) {
    console.error('Delete recommendation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete recommendation',
      error: error.message
    });
  }
};

// Clean up expired recommendations
const cleanupExpiredRecommendations = async (req, res) => {
  try {
    const deletedCount = await Recommendation.cleanupExpired();

    res.status(200).json({
      status: 'success',
      message: `${deletedCount} expired recommendations cleaned up`,
      data: {
        deletedCount
      }
    });

  } catch (error) {
    console.error('Cleanup expired recommendations error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to cleanup expired recommendations',
      error: error.message
    });
  }
};

module.exports = {
  generateRecommendations,
  getRecommendations,
  getRecommendationById,
  updateRecommendationStatus,
  getRecommendationStats,
  deleteRecommendation,
  cleanupExpiredRecommendations
};
