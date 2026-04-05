const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const BADGE_THRESHOLDS = [
  { points: 500, name: 'Top Mentor' },
  { points: 200, name: 'Community Builder' },
  { points: 100, name: 'Skill Hero' },
  { points: 50, name: 'Campus Guide' },
  { points: 10, name: 'Rising Mentor' },
];

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  prn: { type: String, unique: true, sparse: true },
  passwordHash: { type: String, required: true },
  department: { type: String },
  year: { type: String },
  bio: { type: String },
  profileImage: { type: String, default: '' },
  availability: { type: String, default: '' },
  preferredMode: { type: String, enum: ['Online', 'Offline', 'Hybrid'] },
  clubAffiliations: [{ type: String }],
  badges: [{ type: String }],
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  reputationPoints: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Recompute badges based on current reputationPoints
userSchema.methods.recomputeBadges = function () {
  const earned = BADGE_THRESHOLDS
    .filter(b => this.reputationPoints >= b.points)
    .map(b => b.name);
  this.badges = earned;
};

// Middleware to hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
