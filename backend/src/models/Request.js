const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Request = sequelize.define('Request', {
  _id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  requesterId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  providerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  skillId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
  },
  preferredTime: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'completed', 'cancelled'),
    defaultValue: 'pending',
  }
}, {
  timestamps: true
});

module.exports = Request;
