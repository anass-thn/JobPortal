const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized, no token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    if (!user.isActive) return res.status(401).json({ success: false, message: 'Account deactivated' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

// Optional protect - sets req.user if token is valid, but doesn't fail if no token
const optionalProtect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user && user.isActive) {
      req.user = user;
    } else {
      req.user = null;
    }
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};

// Restrict to roles: authorize('admin'), authorize('employer','admin'), etc.
const authorize = (...roles) => (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized' });
    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({ success: false, message: 'Forbidden for role' });
    }
    next();
  } catch (_) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
};

module.exports = { generateToken, protect, optionalProtect, authorize };


