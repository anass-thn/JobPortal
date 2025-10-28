const User = require('../models/User');

// GET /api/users/:id
async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { getUserById };


