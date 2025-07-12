const EnergyUsage = require('../models/EnergyUsage');
const mongoose = require('mongoose');

// Create new energy usage record
const createEnergyUsage = async (req, res) => {
  try {
    const energyData = {
      ...req.body,
      userId: req.user._id
    };

    // Validate required fields
    if (!energyData.date) {
      return res.status(400).json({
        status: 'error',
        message: 'Date is required'
      });
    }

    // Check if record already exists for this user and date
    const existingRecord = await EnergyUsage.findOne({
      userId: req.user._id,
      date: new Date(energyData.date)
    });

    if (existingRecord) {
      return res.status(400).json({
        status: 'error',
        message: 'Energy usage record already exists for this date'
      });
    }

    const energyUsage = await EnergyUsage.create(energyData);

    res.status(201).json({
      status: 'success',
      message: 'Energy usage record created successfully',
      data: {
        energyUsage
      }
    });

  } catch (error) {
    console.error('Create energy usage error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create energy usage record',
      error: error.message
    });
  }
};

// Get energy usage records for current user
const getEnergyUsage = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const filter = { userId: req.user._id };

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) {
        filter.date.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.date.$lte = new Date(req.query.endDate);
      }
    }

    const energyUsage = await EnergyUsage.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await EnergyUsage.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        energyUsage,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalRecords: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPreviousPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get energy usage error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get energy usage records',
      error: error.message
    });
  }
};

// Get single energy usage record
const getEnergyUsageById = async (req, res) => {
  try {
    const { recordId } = req.params;

    const energyUsage = await EnergyUsage.findOne({
      _id: recordId,
      userId: req.user._id
    });

    if (!energyUsage) {
      return res.status(404).json({
        status: 'error',
        message: 'Energy usage record not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        energyUsage
      }
    });

  } catch (error) {
    console.error('Get energy usage by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get energy usage record',
      error: error.message
    });
  }
};

// Update energy usage record
const updateEnergyUsage = async (req, res) => {
  try {
    const { recordId } = req.params;

    const energyUsage = await EnergyUsage.findOneAndUpdate(
      { _id: recordId, userId: req.user._id },
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!energyUsage) {
      return res.status(404).json({
        status: 'error',
        message: 'Energy usage record not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Energy usage record updated successfully',
      data: {
        energyUsage
      }
    });

  } catch (error) {
    console.error('Update energy usage error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update energy usage record',
      error: error.message
    });
  }
};

// Delete energy usage record
const deleteEnergyUsage = async (req, res) => {
  try {
    const { recordId } = req.params;

    const energyUsage = await EnergyUsage.findOneAndDelete({
      _id: recordId,
      userId: req.user._id
    });

    if (!energyUsage) {
      return res.status(404).json({
        status: 'error',
        message: 'Energy usage record not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Energy usage record deleted successfully'
    });

  } catch (error) {
    console.error('Delete energy usage error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete energy usage record',
      error: error.message
    });
  }
};

// Get energy usage statistics
const getEnergyStats = async (req, res) => {
  try {
    const { period = '30' } = req.query; // Default to 30 days
    const daysBack = parseInt(period);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // Get user statistics
    const stats = await EnergyUsage.getUserStats(req.user._id, startDate, new Date());

    // Get daily trends
    const dailyTrends = await EnergyUsage.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user._id),
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          date: { $first: '$date' },
          totalConsumption: { $sum: '$totalConsumption' },
          totalCost: { $sum: '$totalCost' },
          renewablePercentage: { $avg: '$renewablePercentage' },
          carbonFootprint: { $sum: '$carbonFootprint' }
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    // Get energy source breakdown
    const sourceBreakdown = await EnergyUsage.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user._id),
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          solarConsumption: { $sum: '$energyData.renewable.solar.consumption' },
          windConsumption: { $sum: '$energyData.renewable.wind.consumption' },
          hydroConsumption: { $sum: '$energyData.renewable.hydro.consumption' },
          otherRenewableConsumption: { $sum: '$energyData.renewable.other.consumption' },
          gridConsumption: { $sum: '$energyData.nonRenewable.grid.consumption' },
          generatorConsumption: { $sum: '$energyData.nonRenewable.generator.consumption' }
        }
      }
    ]);

    const breakdown = sourceBreakdown.length > 0 ? sourceBreakdown[0] : {
      solarConsumption: 0,
      windConsumption: 0,
      hydroConsumption: 0,
      otherRenewableConsumption: 0,
      gridConsumption: 0,
      generatorConsumption: 0
    };

    res.status(200).json({
      status: 'success',
      data: {
        period: `${daysBack} days`,
        summary: stats || {
          totalConsumption: 0,
          totalCost: 0,
          avgRenewablePercentage: 0,
          totalCarbonFootprint: 0,
          recordCount: 0
        },
        dailyTrends,
        sourceBreakdown: breakdown
      }
    });

  } catch (error) {
    console.error('Get energy stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get energy statistics',
      error: error.message
    });
  }
};

// Bulk import energy usage data
const bulkImportEnergyUsage = async (req, res) => {
  try {
    const { energyRecords } = req.body;

    if (!Array.isArray(energyRecords) || energyRecords.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Energy records array is required'
      });
    }

    // Add userId to each record and validate
    const recordsWithUserId = energyRecords.map(record => ({
      ...record,
      userId: req.user._id
    }));

    // Check for duplicate dates
    const dates = recordsWithUserId.map(record => new Date(record.date));
    const existingRecords = await EnergyUsage.find({
      userId: req.user._id,
      date: { $in: dates }
    });

    if (existingRecords.length > 0) {
      const existingDates = existingRecords.map(record => 
        record.date.toISOString().split('T')[0]
      );
      return res.status(400).json({
        status: 'error',
        message: 'Records already exist for the following dates',
        existingDates
      });
    }

    // Insert records
    const createdRecords = await EnergyUsage.insertMany(recordsWithUserId);

    res.status(201).json({
      status: 'success',
      message: `${createdRecords.length} energy usage records imported successfully`,
      data: {
        importedCount: createdRecords.length,
        energyUsage: createdRecords
      }
    });

  } catch (error) {
    console.error('Bulk import energy usage error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to import energy usage records',
      error: error.message
    });
  }
};

// Export energy usage data as CSV
const exportEnergyData = async (req, res) => {
  try {
    const userId = req.user.userId;
    const isAdmin = req.user.role === 'admin';
    
    // Build query
    const query = isAdmin ? {} : { userId };
    
    // Get energy usage records
    const energyRecords = await EnergyUsage.find(query)
      .populate('userId', 'name businessName')
      .sort({ date: -1 });

    // Create CSV content
    const csvHeaders = [
      'Date',
      'User',
      'Business',
      'Solar (kWh)',
      'Solar Cost',
      'Wind (kWh)',
      'Wind Cost',
      'Hydro (kWh)',
      'Hydro Cost',
      'Grid (kWh)',
      'Grid Cost',
      'Generator (kWh)',
      'Generator Cost',
      'Total Consumption',
      'Total Cost',
      'Renewable %',
      'Peak Start',
      'Peak End',
      'Notes'
    ].join(',');

    const csvRows = energyRecords.map(record => [
      record.date,
      record.userId?.name || 'N/A',
      record.userId?.businessName || 'N/A',
      record.energyData.renewable.solar.consumption,
      record.energyData.renewable.solar.cost,
      record.energyData.renewable.wind.consumption,
      record.energyData.renewable.wind.cost,
      record.energyData.renewable.hydro.consumption,
      record.energyData.renewable.hydro.cost,
      record.energyData.nonRenewable.grid.consumption,
      record.energyData.nonRenewable.grid.cost,
      record.energyData.nonRenewable.generator.consumption,
      record.energyData.nonRenewable.generator.cost,
      record.totalConsumption,
      record.totalCost,
      record.renewablePercentage,
      record.peakHours?.start || 'N/A',
      record.peakHours?.end || 'N/A',
      `"${record.notes || ''}"`
    ].join(','));

    const csvContent = [csvHeaders, ...csvRows].join('\n');

    // Set response headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=energy-data.csv');
    
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('Export energy data error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to export energy data',
      error: error.message
    });
  }
};

module.exports = {
  createEnergyUsage,
  getEnergyUsage,
  getEnergyUsageById,
  updateEnergyUsage,
  deleteEnergyUsage,
  getEnergyStats,
  bulkImportEnergyUsage,
  exportEnergyData
};
