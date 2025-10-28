const express = require('express');
const { protect } = require('../middleware/auth');
const { getUserById } = require('../controllers/userController');

const router = express.Router();

// GET /api/users/:id
router.get('/:id', protect, getUserById);

module.exports = router;
