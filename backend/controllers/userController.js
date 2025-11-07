const User = require('../models/User');

// GET /api/users/:id (protected)
async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// PUT /api/users/me (protected)
async function updateMyProfile(req, res) {
  try {
    const allowed = ['firstName', 'lastName', 'phone', 'location', 'bio', 'skills', 'avatar', 'resumeUrl'];
    const updates = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updates[key] = req.body[key];
      }
    }
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// DELETE /api/users/me/resume (protected)
async function deleteMyResume(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { resumeUrl: '' }, { new: true });
    res.json({ success: true, user });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// GET /api/users/public/:id (public)
async function getPublicProfile(req, res) {
  try {
    const user = await User.findById(req.params.id).select(
      'firstName lastName avatar bio skills location userType createdAt resumeUrl'
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { getUserById, updateMyProfile, deleteMyResume, getPublicProfile };


