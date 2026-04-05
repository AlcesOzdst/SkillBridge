const { Op } = require('sequelize');
const { User } = require('../models');
const generateToken = require('../utils/generateToken');

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, prn, password, department, year } = req.body;

  try {
    const userExists = await User.findOne({
      where: {
        [Op.or]: [{ email }, { prn }]
      }
    });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      prn,
      passwordHash: password, // Hashed in beforeSave hook
      department,
      year
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { registerUser, loginUser, getMe };
