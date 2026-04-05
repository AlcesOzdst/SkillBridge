const { sequelize } = require('../config/db');
const { User, Skill, Request, Review } = require('../models');

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalSkills, totalRequests, totalReviews] = await Promise.all([
      User.count({ where: { role: 'student' } }),
      Skill.count(),
      Request.count(),
      Review.count(),
    ]);

    // Most popular skills (by request count)
    const rawPopular = await Request.findAll({
      attributes: ['skillId', [sequelize.fn('COUNT', sequelize.col('Request._id')), 'count']],
      group: ['skillId', 'skill._id', 'skill.skillName', 'skill.category'],
      order: [[sequelize.literal('count'), 'DESC']],
      limit: 5,
      include: [{
        model: Skill,
        as: 'skill',
        attributes: ['skillName', 'category']
      }]
    });

    const popularSkills = rawPopular.map(r => ({
      _id: r.skillId,
      skillName: r.skill ? r.skill.skillName : 'Unknown',
      category: r.skill ? r.skill.category : 'Unknown',
      count: parseInt(r.getDataValue('count'), 10)
    }));

    // Request status breakdown
    const rawStatus = await Request.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('_id')), 'count']],
      group: ['status']
    });

    const statusBreakdown = rawStatus.map(r => ({
      _id: r.status,
      count: parseInt(r.getDataValue('count'), 10)
    }));

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
    const users = await User.findAll({
      attributes: { exclude: ['passwordHash'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent deleting another admin
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete an admin account' });
    }

    await user.destroy();
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/database
const getDatabaseTables = async (req, res) => {
  try {
    const [tables] = await sequelize.query('SHOW TABLES');
    
    if (!tables || tables.length === 0) return res.json([]);

    const dbData = [];

    for (let tableObj of tables) {
      const tableName = Object.values(tableObj)[0];
      const [rows] = await sequelize.query(`SELECT * FROM ${tableName} LIMIT 10`);
      
      dbData.push({
        tableName,
        rows
      });
    }

    res.json(dbData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats, getAllUsers, deleteUser, getDatabaseTables };
