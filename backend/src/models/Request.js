const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
  message: { type: String },
  preferredTime: { type: String },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'], default: 'pending' }
}, {
  timestamps: true
});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;
