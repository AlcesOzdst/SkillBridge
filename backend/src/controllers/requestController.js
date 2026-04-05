const { Request, User, Skill } = require('../models');

// Send a session request
const sendRequest = async (req, res) => {
  const { providerId, skillId, message, preferredTime } = req.body;

  try {
    // Can't request yourself
    if (req.user._id === providerId) {
      return res.status(400).json({ message: 'You cannot send a request to yourself' });
    }

    // Check provider + skill exist
    const provider = await User.findByPk(providerId);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });

    const skill = await Skill.findByPk(skillId);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    // Check for already pending request for same skill
    const existing = await Request.findOne({
      where: {
        requesterId: req.user._id,
        providerId,
        skillId,
        status: 'pending',
      }
    });

    if (existing) {
      return res.status(400).json({ message: 'You already have a pending request for this skill' });
    }

    const request = await Request.create({
      requesterId: req.user._id,
      providerId,
      skillId,
      message,
      preferredTime,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all requests for the current user (sent + received)
const getMyRequests = async (req, res) => {
  try {
    const sent = await Request.findAll({
      where: { requesterId: req.user._id },
      include: [
        { model: User, as: 'provider', attributes: ['name', 'email', 'department', 'year', 'profileImage', 'reputationPoints', 'badges'] },
        { model: Skill, as: 'skill', attributes: ['skillName', 'category', 'level', 'mode'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    const received = await Request.findAll({
      where: { providerId: req.user._id },
      include: [
        { model: User, as: 'requester', attributes: ['name', 'email', 'department', 'year', 'profileImage', 'reputationPoints', 'badges'] },
        { model: Skill, as: 'skill', attributes: ['skillName', 'category', 'level', 'mode'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ sent, received });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept / reject a request (provider only)
const respondToRequest = async (req, res) => {
  const { status } = req.body; // 'accepted' | 'rejected'

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Status must be accepted or rejected' });
  }

  try {
    const request = await Request.findByPk(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.providerId !== req.user._id) {
      return res.status(403).json({ message: 'Not authorised to respond to this request' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: `Request is already ${request.status}` });
    }

    request.status = status;
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark request as completed (requester confirms session happened)
const completeRequest = async (req, res) => {
  try {
    const request = await Request.findByPk(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.requesterId !== req.user._id) {
      return res.status(403).json({ message: 'Only the requester can mark a session as completed' });
    }

    if (request.status !== 'accepted') {
      return res.status(400).json({ message: 'Only accepted requests can be marked as completed' });
    }

    request.status = 'completed';
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel a request (requester only, while still pending)
const cancelRequest = async (req, res) => {
  try {
    const request = await Request.findByPk(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.requesterId !== req.user._id) {
      return res.status(403).json({ message: 'Only the requester can cancel this request' });
    }

    if (!['pending', 'accepted'].includes(request.status)) {
      return res.status(400).json({ message: `Cannot cancel a ${request.status} request` });
    }

    request.status = 'cancelled';
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendRequest, getMyRequests, respondToRequest, completeRequest, cancelRequest };
