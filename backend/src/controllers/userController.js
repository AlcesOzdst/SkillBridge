const User = require('../models/User');
const Skill = require('../models/Skill');

// Get user profile by ID
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
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
    const user = await User.findById(req.user._id);

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

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        department: updatedUser.department,
        year: updatedUser.year,
        bio: updatedUser.bio,
        preferredMode: updatedUser.preferredMode,
        availability: updatedUser.availability,
        clubAffiliations: updatedUser.clubAffiliations,
        reputationPoints: updatedUser.reputationPoints,
        badges: updatedUser.badges,
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
      skillFilter.$or = [
        { skillName: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }
    if (mode) skillFilter.mode = mode;

    const matchingSkills = await Skill.find(skillFilter).select('userId skillName category level mode');

    // Get unique user IDs from matching skills
    const userIds = [...new Set(matchingSkills.map(s => s.userId.toString()))];

    // Build user filter
    const userFilter = { _id: { $in: userIds }, role: 'student' };
    if (department) userFilter.department = { $regex: department, $options: 'i' };
    if (year) userFilter.year = year;

    const users = await User.find(userFilter)
      .select('-passwordHash')
      .sort({ reputationPoints: -1 });

    // Attach their offered skills to each user object
    const usersWithSkills = users.map(u => {
      const skills = matchingSkills.filter(s => s.userId.toString() === u._id.toString());
      return { ...u.toObject(), offeredSkills: skills };
    });

    res.json(usersWithSkills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile, searchUsers };

