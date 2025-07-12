const User = require('../models/User');
const EnergyUsage = require('../models/EnergyUsage');

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filter = {};
    
    // Filter by role if specified
    if (req.query.role) {
      filter.role = req.query.role;
    }
    
    // Filter by active status if specified
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }

    // Search by name or email
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { businessName: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPreviousPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get users',
      error: error.message
    });
  }
};

// Get user by ID (Admin only)
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Get user's energy usage statistics
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const energyStats = await EnergyUsage.getUserStats(userId, thirtyDaysAgo, new Date());

    res.status(200).json({
      status: 'success',
      data: {
        user: user.toJSON(),
        energyStats: energyStats || {
          totalConsumption: 0,
          totalCost: 0,
          avgRenewablePercentage: 0,
          totalCarbonFootprint: 0,
          recordCount: 0
        }
      }
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get user',
      error: error.message
    });
  }
};

// Toggle user active status (Admin only)
const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        status: 'error',
        message: 'You cannot deactivate your own account'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        user: user.toJSON()
      }
    });

  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update user status',
      error: error.message
    });
  }
};

// Get dashboard statistics (Admin only)
const getDashboardStats = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get user statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalRetailers = await User.countDocuments({ role: 'retailer' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    // Get recent registrations
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get energy usage statistics
    const totalEnergyRecords = await EnergyUsage.countDocuments();
    const recentEnergyRecords = await EnergyUsage.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get aggregated energy data
    const energyAggregation = await EnergyUsage.aggregate([
      {
        $group: {
          _id: null,
          totalConsumption: { $sum: '$totalConsumption' },
          totalCost: { $sum: '$totalCost' },
          avgRenewablePercentage: { $avg: '$renewablePercentage' },
          totalCarbonFootprint: { $sum: '$carbonFootprint' }
        }
      }
    ]);

    const energyStats = energyAggregation.length > 0 ? energyAggregation[0] : {
      totalConsumption: 0,
      totalCost: 0,
      avgRenewablePercentage: 0,
      totalCarbonFootprint: 0
    };

    // Get monthly energy trends
    const monthlyTrends = await EnergyUsage.aggregate([
      {
        $match: {
          date: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          dailyConsumption: { $sum: '$totalConsumption' },
          dailyCost: { $sum: '$totalCost' },
          avgRenewablePercentage: { $avg: '$renewablePercentage' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      },
      {
        $limit: 30
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        userStats: {
          totalUsers,
          activeUsers,
          totalRetailers,
          totalAdmins,
          recentRegistrations
        },
        energyStats: {
          ...energyStats,
          totalEnergyRecords,
          recentEnergyRecords,
          avgRenewablePercentage: Math.round(energyStats.avgRenewablePercentage || 0)
        },
        monthlyTrends
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get dashboard statistics',
      error: error.message
    });
  }
};

// Update user role (Admin only)
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role || !['admin', 'retailer'].includes(role)) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid role is required (admin or retailer)'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Prevent admin from changing their own role
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        status: 'error',
        message: 'You cannot change your own role'
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'User role updated successfully',
      data: {
        user: user.toJSON()
      }
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update user role',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  toggleUserStatus,
  getDashboardStats,
  updateUserRole
};
