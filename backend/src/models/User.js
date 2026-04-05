const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');

const BADGE_THRESHOLDS = [
  { points: 500, name: 'Top Mentor' },
  { points: 200, name: 'Community Builder' },
  { points: 100, name: 'Skill Hero' },
  { points: 50, name: 'Campus Guide' },
  { points: 10, name: 'Rising Mentor' },
];

const User = sequelize.define('User', {
  _id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  prn: {
    type: DataTypes.STRING,
    unique: true,
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  department: { type: DataTypes.STRING },
  year: { type: DataTypes.STRING },
  bio: { type: DataTypes.TEXT },
  profileImage: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  availability: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  preferredMode: {
    type: DataTypes.ENUM('Online', 'Offline', 'Hybrid'),
  },
  clubAffiliations: {
    type: DataTypes.JSON, // Arrays aren't native in generic SQL, store as JSON array
    defaultValue: [],
  },
  badges: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  role: {
    type: DataTypes.ENUM('student', 'admin'),
    defaultValue: 'student',
  },
  reputationPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
  hooks: {
    beforeSave: async (user) => {
      // Recompute badges every time we save if reputation Points changed
      if (user.changed('reputationPoints') || user.isNewRecord) {
        const earned = BADGE_THRESHOLDS
          .filter(b => user.reputationPoints >= b.points)
          .map(b => b.name);
        user.badges = earned;
      }

      // Hash password if modified
      if (user.changed('passwordHash')) {
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
      }
    }
  }
});

// Method to compare passwords
User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Expose a custom instance method to update badges manually if needed
User.prototype.recomputeBadges = function () {
  const earned = BADGE_THRESHOLDS
    .filter(b => this.reputationPoints >= b.points)
    .map(b => b.name);
  this.badges = earned;
};

module.exports = User;
