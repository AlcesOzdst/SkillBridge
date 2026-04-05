const { sequelize } = require('../config/db');
const User = require('./User');
const Skill = require('./Skill');
const Request = require('./Request');
const Review = require('./Review');

// Define associations

// User <-> Skill
User.hasMany(Skill, { foreignKey: 'userId', as: 'offeredSkills' });
Skill.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Request associations
User.hasMany(Request, { foreignKey: 'requesterId', as: 'sentRequests' });
User.hasMany(Request, { foreignKey: 'providerId', as: 'receivedRequests' });

Request.belongsTo(User, { foreignKey: 'requesterId', as: 'requester' });
Request.belongsTo(User, { foreignKey: 'providerId', as: 'provider' });

Skill.hasMany(Request, { foreignKey: 'skillId', as: 'requests' });
Request.belongsTo(Skill, { foreignKey: 'skillId', as: 'skill' });

// Review associations
Request.hasOne(Review, { foreignKey: 'requestId', as: 'review' });
Review.belongsTo(Request, { foreignKey: 'requestId', as: 'request' });

User.hasMany(Review, { foreignKey: 'reviewerId', as: 'givenReviews' });
User.hasMany(Review, { foreignKey: 'reviewedUserId', as: 'receivedReviews' });

Review.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' });
Review.belongsTo(User, { foreignKey: 'reviewedUserId', as: 'reviewedUser' });

module.exports = {
  sequelize,
  User,
  Skill,
  Request,
  Review
};
