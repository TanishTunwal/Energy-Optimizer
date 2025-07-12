const express = require('express');
const router = express.Router();
const {
  generateRecommendations,
  getRecommendations,
  getRecommendationById,
  updateRecommendationStatus,
  getRecommendationStats,
  deleteRecommendation,
  cleanupExpiredRecommendations
} = require('../controllers/recommendationController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Recommendation routes
router.post('/generate', generateRecommendations);
router.get('/', getRecommendations);
router.get('/stats', getRecommendationStats);
router.get('/:recommendationId', getRecommendationById);
router.patch('/:recommendationId/status', updateRecommendationStatus);
router.delete('/:recommendationId', deleteRecommendation);

// Admin-only routes
router.delete('/cleanup/expired', authorize('admin'), cleanupExpiredRecommendations);

module.exports = router;
