const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  toggleUserStatus,
  getDashboardStats,
  updateUserRole
} = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Admin-only routes
router.use(authorize('admin'));

router.get('/', getAllUsers);
router.get('/dashboard-stats', getDashboardStats);
router.get('/:userId', getUserById);
router.patch('/:userId/toggle-status', toggleUserStatus);
router.patch('/:userId/role', updateUserRole);

module.exports = router;
