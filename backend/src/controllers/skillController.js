const Skill = require('../models/Skill');

// Create new skill
const createSkill = async (req, res) => {
  const { skillName, category, type, level, description, mode } = req.body;

  try {
    const skill = new Skill({
      userId: req.user._id,
      skillName,
      category,
      type,
      level,
      description,
      mode
    });

    const createdSkill = await skill.save();
    res.status(201).json(createdSkill);
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
      filters.skillName = { $regex: req.query.keyword, $options: 'i' };
    }

    const skills = await Skill.find(filters).populate('userId', 'name department year bio');
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user specific skills
const getUserSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.params.userId });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update skill
const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (skill) {
      // Check if this skill belongs to the user
      if (skill.userId.toString() !== req.user._id.toString()) {
         return res.status(401).json({ message: 'Not authorized to update this skill' });
      }

      skill.skillName = req.body.skillName || skill.skillName;
      skill.category = req.body.category || skill.category;
      skill.type = req.body.type || skill.type;
      skill.level = req.body.level || skill.level;
      skill.description = req.body.description || skill.description;
      skill.mode = req.body.mode || skill.mode;

      const updatedSkill = await skill.save();
      res.json(updatedSkill);
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
    const skill = await Skill.findById(req.params.id);

    if (skill) {
      if (skill.userId.toString() !== req.user._id.toString()) {
         return res.status(401).json({ message: 'Not authorized to delete this skill' });
      }
      
      await skill.deleteOne();
      res.json({ message: 'Skill removed' });
    } else {
      res.status(404).json({ message: 'Skill not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSkill, getSkills, getUserSkills, updateSkill, deleteSkill };
