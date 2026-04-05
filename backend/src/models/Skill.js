const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Skill = sequelize.define('Skill', {
  _id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  skillName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('offered', 'wanted'),
    allowNull: false,
  },
  level: {
    type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
  },
  description: {
    type: DataTypes.TEXT,
  },
  mode: {
    type: DataTypes.ENUM('Online', 'Offline', 'Hybrid'),
  }
}, {
  timestamps: true
});

module.exports = Skill;
