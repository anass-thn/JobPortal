const { validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
};

// POST /api/auth/register
async function register(req, res) {
  const err = handleValidation(req, res);
  if (err) return;
  try {
    const { firstName, lastName, email, password, userType = 'jobseeker' } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already in use' });

    const user = await User.create({ firstName, lastName, email, password, userType });
    const token = generateToken(user._id);
    res.status(201).json({ success: true, token, user });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// POST /api/auth/login
async function login(req, res) {
  const err = handleValidation(req, res);
  if (err) return;
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    user.lastLogin = new Date();
    await user.save();
    const token = generateToken(user._id);
    const safeUser = await User.findById(user._id);
    res.json({ success: true, token, user: safeUser });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// GET /api/auth/me
async function getMe(req, res) {
  res.json({ success: true, user: req.user });
}

// PUT /api/auth/profile
async function updateProfile(req, res) {
  const err = handleValidation(req, res);
  if (err) return;
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { register, login, getMe, updateProfile };


