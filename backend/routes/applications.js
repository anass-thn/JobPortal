const express = require('express');
const { body, param, query } = require('express-validator');
const validate = require('../middleware/validation');
const { protect, authorize } = require('../middleware/auth');
const { applyToJob, listMyApplications, listApplicationsForJob, updateApplicationStatus } = require('../controllers/applicationController');
const router = express.Router();

// @desc    Test route
// @route   GET /api/applications/test
// @access  Public
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Application routes are working!'
  });
});

// @desc    Apply to a job
// @route   POST /api/applications/:jobId/apply
// @access  Jobseeker
router.post(
  '/:jobId/apply',
  [
    protect,
    authorize('jobseeker', 'admin'),
    param('jobId').isMongoId(),
    body('resumeUrl').trim().notEmpty(),
    body('coverLetter').optional().trim().isLength({ max: 2000 }),
    body('additionalDocuments').optional().isArray(),
    validate,
  ],
  applyToJob
);

// @desc    List my applications
// @route   GET /api/applications/my
// @access  Authenticated
router.get(
  '/my',
  [
    protect,
    query('status').optional().isIn(['pending', 'reviewed', 'shortlisted', 'rejected', 'hired']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    validate,
  ],
  listMyApplications
);

// @desc    List applications for a job (employer/admin)
// @route   GET /api/applications/job/:jobId
// @access  Employer/Admin
router.get(
  '/job/:jobId',
  [
    protect,
    authorize('employer', 'admin'),
    param('jobId').isMongoId(),
    query('status').optional().isIn(['pending', 'reviewed', 'shortlisted', 'rejected', 'hired']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    validate,
  ],
  listApplicationsForJob
);

// @desc    Update application status
// @route   PATCH /api/applications/:id/status
// @access  Employer/Admin
router.patch(
  '/:id/status',
  [
    protect,
    authorize('employer', 'admin'),
    param('id').isMongoId(),
    body('status').isIn(['pending', 'reviewed', 'shortlisted', 'rejected', 'hired']),
    body('notes').optional().trim().isLength({ max: 1000 }),
    validate,
  ],
  updateApplicationStatus
);

module.exports = router;
