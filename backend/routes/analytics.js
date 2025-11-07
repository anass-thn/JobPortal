const express = require('express');
const { query, body } = require('express-validator');
const validate = require('../middleware/validation');
const { protect } = require('../middleware/auth');
const { overview, timeseries, topJobs, trackEvent } = require('../controllers/analyticsController');

const router = express.Router();

// Overview metrics (auth)
router.get(
	'/overview',
	[
		protect,
		query('range').optional().isString(),
		validate,
	],
	overview
);

// Timeseries metrics (auth)
router.get(
	'/timeseries',
	[
		protect,
		query('metric').optional().isIn(['applications', 'jobs', 'users', 'events']),
		query('range').optional().isString(),
		validate,
	],
	timeseries
);

// Top jobs by applications (auth)
router.get(
	'/top-jobs',
	[
		protect,
		query('limit').optional().isInt({ min: 1, max: 50 }),
		validate,
	],
	topJobs
);

// Track event (public)
router.post(
	'/event',
	[
		body('eventName').trim().notEmpty(),
		body('sessionId').optional().isString(),
		body('page').optional().isString(),
		body('referrer').optional().isString(),
		body('userAgent').optional().isString(),
		body('ip').optional().isString(),
		body('metadata').optional().isObject(),
		body('job').optional().isString(),
		validate,
	],
	trackEvent
);

module.exports = router;
