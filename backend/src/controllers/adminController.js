const User = require('../models/User');
const Skill = require('../models/Skill');
const Request = require('../models/Request');
const Review = require('../models/Review');

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalSkills, totalRequests, totalReviews] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Skill.countDocuments(),
      Request.countDocuments(),
      Review.countDocuments(),
    ]);

    // Most popular skills (by request count)
    const popularSkills = await Request.aggregate([
      { $group: { _id: '$skillId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'skills',
          localField: '_id',
          foreignField: '_id',
          as: 'skill',
        },
      },
      { $unwind: '$skill' },
      { $project: { skillName: '$skill.skillName', category: '$skill.category', count: 1 } },
    ]);

    // Request status breakdown
    const statusBreakdown = await Request.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      totalUsers,
      totalSkills,
      totalRequests,
      totalReviews,
      popularSkills,
      statusBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-passwordHash')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent deleting another admin
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete an admin account' });
    }

    await user.deleteOne();
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats, getAllUsers, deleteUser };
