const { Op } = require('sequelize');
const { User, Skill } = require('../models');

// Get user profile by ID
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['passwordHash'] }
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.department = req.body.department || user.department;
      user.year = req.body.year || user.year;
      user.bio = req.body.bio || user.bio;
      user.preferredMode = req.body.preferredMode || user.preferredMode;
      user.availability = req.body.availability || user.availability;
      user.clubAffiliations = req.body.clubAffiliations || user.clubAffiliations;

      if (req.body.password) {
        user.passwordHash = req.body.password;
      }

      await user.save();

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        year: user.year,
        bio: user.bio,
        preferredMode: user.preferredMode,
        availability: user.availability,
        clubAffiliations: user.clubAffiliations,
        reputationPoints: user.reputationPoints,
        badges: user.badges,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search users by skill, department, year
// Finds skills matching keyword, then returns unique user profiles
const searchUsers = async (req, res) => {
  try {
    const { keyword, department, year, mode } = req.query;

    const skillFilter = { type: 'offered' };
    if (keyword) {
      skillFilter[Op.or] = [
        { skillName: { [Op.substring]: keyword } },
        { category: { [Op.substring]: keyword } },
        { description: { [Op.substring]: keyword } },
      ];
    }
    if (mode) skillFilter.mode = mode;

    const matchingSkills = await Skill.findAll({
      where: skillFilter,
      attributes: ['_id', 'userId', 'skillName', 'category', 'level', 'mode']
    });

    // Get unique user IDs from matching skills
    const userIds = [...new Set(matchingSkills.map(s => s.userId))];

    // Build user filter
    const userFilter = { _id: { [Op.in]: userIds }, role: 'student' };
    if (department) userFilter.department = { [Op.substring]: department };
    if (year) userFilter.year = year;

    const users = await User.findAll({
      where: userFilter,
      attributes: { exclude: ['passwordHash'] },
      order: [['reputationPoints', 'DESC']]
    });

    // Attach their offered skills to each user object
    const usersWithSkills = users.map(u => {
      const skills = matchingSkills.filter(s => s.userId === u._id);
      return { ...u.toJSON(), offeredSkills: skills };
    });

    res.json(usersWithSkills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile, searchUsers };

