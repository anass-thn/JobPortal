const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validation');
const { protect } = require('../middleware/auth');
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { upload, uploadAvatar } = require('../controllers/uploadController');

const router = express.Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    body('firstName').trim().notEmpty().isLength({ max: 50 }),
    body('lastName').trim().notEmpty().isLength({ max: 50 }),
    body('email').isEmail().normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    body('userType').isIn(['jobseeker', 'employer']).optional(),
    validate,
  ],
  register
);

// POST /api/auth/login
router.post('/login', [body('email').isEmail(), body('password').notEmpty(), validate], login);

// GET /api/auth/me
router.get('/me', protect, getMe);

// PUT /api/auth/profile
router.put(
  '/profile',
  [
    protect,
    body('firstName').optional().trim().isLength({ max: 50 }),
    body('lastName').optional().trim().isLength({ max: 50 }),
    body('phone').optional().trim(),
    body('location').optional().trim(),
    body('bio').optional().trim().isLength({ max: 500 }),
    body('skills').optional().isArray(),
    validate,
  ],
  updateProfile
);

// PUT /api/auth/avatar
router.put('/avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;
