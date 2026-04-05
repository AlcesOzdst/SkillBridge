const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  feedback: { type: String }
}, {
  timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
