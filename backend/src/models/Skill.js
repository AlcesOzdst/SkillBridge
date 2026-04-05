const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skillName: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ['offered', 'wanted'], required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  description: { type: String },
  mode: { type: String, enum: ['Online', 'Offline', 'Hybrid'] }
}, {
  timestamps: true
});

const Skill = mongoose.model('Skill', skillSchema);
module.exports = Skill;
