const express = require('express');
const { getStats, getAllUsers, deleteUser } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
