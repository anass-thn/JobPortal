const express = require('express');
const { body, param, query } = require('express-validator');
const validate = require('../middleware/validation');
const { protect, authorize } = require('../middleware/auth');
const { saveJob, listSavedJobs, removeSavedJob } = require('../controllers/savedJobController');

const router = express.Router();

// @desc    Save a job
// @route   POST /api/saved/:jobId
// @access  Jobseeker
router.post(
	'/:jobId',
	[
		protect,
		authorize('jobseeker', 'admin'),
		param('jobId').isMongoId(),
		body('note').optional().trim().isLength({ max: 500 }),
		validate,
	],
	saveJob
);

// @desc    List saved jobs
// @route   GET /api/saved
// @access  Authenticated
router.get(
	'/',
	[
		protect,
		query('page').optional().isInt({ min: 1 }),
		query('limit').optional().isInt({ min: 1, max: 100 }),
		validate,
	],
	listSavedJobs
);

// @desc    Remove saved job
// @route   DELETE /api/saved/:jobId
// @access  Authenticated
router.delete(
	'/:jobId',
	[
		protect,
		param('jobId').isMongoId(),
		validate,
	],
	removeSavedJob
);

module.exports = router;
