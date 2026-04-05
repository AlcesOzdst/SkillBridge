const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  prn: { type: String, unique: true },
  passwordHash: { type: String, required: true },
  department: { type: String },
  year: { type: String },
  bio: { type: String },
  preferredMode: { type: String, enum: ['Online', 'Offline', 'Hybrid'] },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  reputationPoints: { type: Number, default: 0 }
}, {
  timestamps: true
});

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
