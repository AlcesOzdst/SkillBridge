const express = require('express');
const { getUserProfile, updateUserProfile, searchUsers } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// IMPORTANT: /search must come before /:id so Express doesn't treat "search" as an ID
router.route('/search').get(searchUsers);
router.route('/profile').put(protect, updateUserProfile);
router.route('/:id').get(getUserProfile);

module.exports = router;
