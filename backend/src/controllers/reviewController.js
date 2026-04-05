const { Review, Request, User } = require('../models');

// Create a review after session completed
// Reputation formula: +10 (session done) + max(0, (rating - 3) * 2) bonus
const createReview = async (req, res) => {
  const { requestId, rating, feedback } = req.body;

  try {
    const request = await Request.findByPk(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Only the requester can leave a review
    if (request.requesterId !== req.user._id) {
      return res.status(403).json({ message: 'Only the requester can leave a review' });
    }

    if (request.status !== 'completed') {
      return res.status(400).json({ message: 'Session must be completed before reviewing' });
    }

    // Prevent duplicate reviews
    const existingReview = await Review.findOne({ where: { requestId } });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this session' });
    }

    const review = await Review.create({
      requestId,
      reviewerId: req.user._id,
      reviewedUserId: request.providerId,
      rating,
      feedback,
    });

    // Update provider's reputation
    const provider = await User.findByPk(request.providerId);
    if (provider) {
      const bonus = Math.max(0, (rating - 3) * 2);
      provider.reputationPoints += 10 + bonus;
      await provider.save(); // Hooks will recompute badges
    }

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews for a specific user
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { reviewedUserId: req.params.id },
      include: [
        { model: User, as: 'reviewer', attributes: ['name', 'profileImage', 'department', 'year'] },
        { model: Request, as: 'request', attributes: ['skillId'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Compute average rating
    const avg =
      reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    res.json({ reviews, averageRating: avg, totalReviews: reviews.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getUserReviews };
