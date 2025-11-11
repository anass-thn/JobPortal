const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validation');
const { protect, optionalProtect, authorize } = require('../middleware/auth');
const { createJob, getJobById, listJobs, updateJob, deleteJob } = require('../controllers/jobController');
const router = express.Router();

// @desc    Test route
// @route   GET /api/jobs/test
// @access  Public
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Job routes are working!'
  });
});

// @desc    Create a job
// @route   POST /api/jobs
// @access  Employer/Admin
router.post(
  '/',
  [
    protect,
    authorize('employer', 'admin'),
    body('title').trim().notEmpty().isLength({ max: 100 }),
    body('description').trim().notEmpty().isLength({ max: 5000 }),
    body('company').trim().notEmpty().isLength({ max: 100 }),
    body('location').trim().notEmpty(),
    body('type').isIn(['full-time', 'part-time', 'contract', 'internship', 'remote']),
    body('category').trim().notEmpty(),
    body('experience').isIn(['entry', 'mid', 'senior', 'executive']),
    body('salary').optional().isObject(),
    body('salary.min').optional().isNumeric(),
    body('salary.max').optional().isNumeric(),
    body('salary.currency').optional().isString(),
    body('salary.period').optional().isIn(['hourly', 'monthly', 'yearly']),
    body('requirements').optional().isArray(),
    body('skills').optional().isArray(),
    body('benefits').optional().isArray(),
    body('status').optional().isIn(['active', 'paused', 'closed']),
    body('featured').optional().isBoolean(),
    body('deadline').optional().isISO8601().toDate(),
    validate,
  ],
  createJob
);

// @desc    List jobs (public, but supports myJobs=true for authenticated employers)
// @route   GET /api/jobs
// @access  Public (optional auth for myJobs filter)
router.get('/', optionalProtect, listJobs);

// @desc    Get a job by id (public)
// @route   GET /api/jobs/:id
// @access  Public
router.get('/:id', getJobById);

// @desc    Update a job (owner or admin)
// @route   PUT /api/jobs/:id
// @access  Employer/Admin
router.put(
  '/:id',
  [
    protect,
    authorize('employer', 'admin'),
    body('title').optional().trim().isLength({ max: 100 }),
    body('description').optional().trim().isLength({ max: 5000 }),
    body('company').optional().trim().isLength({ max: 100 }),
    body('location').optional().trim(),
    body('type').optional().isIn(['full-time', 'part-time', 'contract', 'internship', 'remote']),
    body('category').optional().trim(),
    body('experience').optional().isIn(['entry', 'mid', 'senior', 'executive']),
    body('salary').optional().isObject(),
    body('salary.min').optional().isNumeric(),
    body('salary.max').optional().isNumeric(),
    body('salary.currency').optional().isString(),
    body('salary.period').optional().isIn(['hourly', 'monthly', 'yearly']),
    body('requirements').optional().isArray(),
    body('skills').optional().isArray(),
    body('benefits').optional().isArray(),
    body('status').optional().isIn(['active', 'paused', 'closed']),
    body('featured').optional().isBoolean(),
    body('deadline').optional().isISO8601().toDate(),
    validate,
  ],
  updateJob
);

// @desc    Delete a job (owner or admin)
// @route   DELETE /api/jobs/:id
// @access  Employer/Admin
router.delete('/:id', [protect, authorize('employer', 'admin')], deleteJob);

module.exports = router;
