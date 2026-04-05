const express = require('express');
const { createReview, getUserReviews } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').post(protect, createReview);
router.route('/user/:id').get(getUserReviews);

module.exports = router;
