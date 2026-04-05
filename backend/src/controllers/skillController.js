const { Op } = require('sequelize');
const { Skill, User } = require('../models');

// Create new skill
const createSkill = async (req, res) => {
  const { skillName, category, type, level, description, mode } = req.body;

  try {
    const skill = await Skill.create({
      userId: req.user._id,
      skillName,
      category,
      type,
      level,
      description,
      mode
    });

    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all skills with optional filters
const getSkills = async (req, res) => {
  try {
    const filters = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.type) filters.type = req.query.type;
    if (req.query.mode) filters.mode = req.query.mode;
    
    // Simple text search on skillName
    if (req.query.keyword) {
      filters.skillName = { [Op.substring]: req.query.keyword };
    }

    const skills = await Skill.findAll({
      where: Object.keys(filters).length ? filters : undefined,
      include: [{
        model: User,
        as: 'user', // Match the alias defined in index.js
        attributes: ['name', 'department', 'year', 'bio']
      }]
    });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user specific skills
const getUserSkills = async (req, res) => {
  try {
    const skills = await Skill.findAll({ where: { userId: req.params.userId } });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update skill
const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id);

    if (skill) {
      // Check if this skill belongs to the user
      if (skill.userId !== req.user._id) {
         return res.status(401).json({ message: 'Not authorized to update this skill' });
      }

      skill.skillName = req.body.skillName || skill.skillName;
      skill.category = req.body.category || skill.category;
      skill.type = req.body.type || skill.type;
      skill.level = req.body.level || skill.level;
      skill.description = req.body.description || skill.description;
      skill.mode = req.body.mode || skill.mode;

      await skill.save();
      res.json(skill);
    } else {
      res.status(404).json({ message: 'Skill not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete skill
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id);

    if (skill) {
      if (skill.userId !== req.user._id) {
         return res.status(401).json({ message: 'Not authorized to delete this skill' });
      }
      
      await skill.destroy();
      res.json({ message: 'Skill removed' });
    } else {
      res.status(404).json({ message: 'Skill not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSkill, getSkills, getUserSkills, updateSkill, deleteSkill };
