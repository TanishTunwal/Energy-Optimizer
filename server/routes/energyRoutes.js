const express = require('express');
const router = express.Router();
const {
  createEnergyUsage,
  getEnergyUsage,
  getEnergyUsageById,
  updateEnergyUsage,
  deleteEnergyUsage,
  getEnergyStats,
  exportEnergyData,
  bulkImportEnergyUsage
} = require('../controllers/energyController');
const { authenticate, authorizeOwnerOrAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Energy usage routes
router.post('/', createEnergyUsage);
router.post('/bulk-import', bulkImportEnergyUsage);
router.get('/', getEnergyUsage);
router.get('/stats', getEnergyStats);
router.get('/export', exportEnergyData);
router.get('/:recordId', getEnergyUsageById);
router.patch('/:recordId', updateEnergyUsage);
router.delete('/:recordId', deleteEnergyUsage);

module.exports = router;
