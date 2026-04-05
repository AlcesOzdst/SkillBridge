const express = require('express');
const {
  sendRequest,
  getMyRequests,
  respondToRequest,
  completeRequest,
  cancelRequest,
} = require('../controllers/requestController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').post(protect, sendRequest);
router.route('/my').get(protect, getMyRequests);
router.route('/:id/respond').put(protect, respondToRequest);
router.route('/:id/complete').put(protect, completeRequest);
router.route('/:id/cancel').put(protect, cancelRequest);

module.exports = router;
