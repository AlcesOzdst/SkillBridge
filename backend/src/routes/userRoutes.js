const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/profile').put(protect, updateUserProfile);
router.route('/:id').get(getUserProfile);

module.exports = router;
