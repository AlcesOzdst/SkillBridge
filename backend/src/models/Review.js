const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Review = sequelize.define('Review', {
  _id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  requestId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  reviewerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  reviewedUserId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 },
    allowNull: false,
  },
  feedback: {
    type: DataTypes.TEXT,
  }
}, {
  timestamps: true
});

module.exports = Review;
