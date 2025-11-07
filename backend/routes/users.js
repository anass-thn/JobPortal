const express = require('express');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { body } = require('express-validator');
const { getUserById, updateMyProfile, deleteMyResume, getPublicProfile } = require('../controllers/userController');

const router = express.Router();

// GET /api/users/:id (protected, detailed)
router.get('/:id', protect, getUserById);

// GET /api/users/public/:id (public profile)
router.get('/public/:id', getPublicProfile);

// PUT /api/users/me (update my profile)
router.put(
  '/me',
  [
    protect,
    body('firstName').optional().trim().isLength({ max: 50 }),
    body('lastName').optional().trim().isLength({ max: 50 }),
    body('phone').optional().trim(),
    body('location').optional().trim(),
    body('bio').optional().trim().isLength({ max: 500 }),
    body('skills').optional().isArray(),
    body('avatar').optional().isString(),
    body('resumeUrl').optional().isString(),
    validate,
  ],
  updateMyProfile
);

// DELETE /api/users/me/resume (clear resume)
router.delete('/me/resume', protect, deleteMyResume);

module.exports = router;
