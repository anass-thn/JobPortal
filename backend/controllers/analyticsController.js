const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const AnalyticsEvent = require('../models/AnalyticsEvent');

function parseRangeDays(range) {
	if (!range) return 7;
	if (typeof range === 'string' && range.endsWith('d')) {
		const n = parseInt(range.slice(0, -1), 10);
		return Number.isFinite(n) && n > 0 ? n : 7;
	}
	const n = parseInt(range, 10);
	return Number.isFinite(n) && n > 0 ? n : 7;
}

async function getEmployerJobIds(user) {
	if (!user || user.userType !== 'employer') return null;
	const jobs = await Job.find({ employer: user._id }).select('_id');
	return jobs.map(j => j._id);
}

// GET /api/analytics/overview
async function overview(req, res) {
	try {
		const rangeDays = parseRangeDays(req.query.range || '7d');
		const since = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000);

		const employerJobIds = await getEmployerJobIds(req.user);
		const jobFilter = employerJobIds ? { _id: { $in: employerJobIds } } : {};
		const appFilter = employerJobIds ? { job: { $in: employerJobIds } } : {};
		const eventFilter = {};

		const [
			totalUsers, // admin only meaningful
			totalJobs,
			totalApplications,
			applicationsByStatus,
			jobsCreatedInRange,
			applicationsInRange,
			eventsInRange
		] = await Promise.all([
			req.user && req.user.userType === 'admin' ? User.countDocuments({ createdAt: { $gte: since } }) : Promise.resolve(0),
			Job.countDocuments({ ...jobFilter, createdAt: { $gte: since } }),
			Application.countDocuments({ ...appFilter, createdAt: { $gte: since } }),
			Application.aggregate([
				{ $match: { ...appFilter, createdAt: { $gte: since } } },
				{ $group: { _id: '$status', count: { $sum: 1 } } }
			]),
			Job.countDocuments({ ...jobFilter, createdAt: { $gte: since } }),
			Application.countDocuments({ ...appFilter, createdAt: { $gte: since } }),
			AnalyticsEvent.countDocuments({ ...eventFilter, occurredAt: { $gte: since } })
		]);

		const statusCounts = applicationsByStatus.reduce((acc, it) => {
			acc[it._id] = it.count;
			return acc;
		}, { pending: 0, reviewed: 0, shortlisted: 0, rejected: 0, hired: 0 });

		return res.json({
			success: true,
			metrics: {
				totalUsers,
				totalJobs,
				totalApplications,
				applicationsByStatus: statusCounts,
				jobsCreatedInRange,
				applicationsInRange,
				eventsInRange
			}
		});
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Server error' });
	}
}

// GET /api/analytics/timeseries?metric=applications|jobs|users|events&range=30d
async function timeseries(req, res) {
	try {
		const metric = (req.query.metric || 'applications').toString();
		const rangeDays = parseRangeDays(req.query.range || '30d');
		const since = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000);
		const employerJobIds = await getEmployerJobIds(req.user);

		let Model;
		let match = {};
		if (metric === 'applications') {
			Model = Application;
			if (employerJobIds) match.job = { $in: employerJobIds };
			match.createdAt = { $gte: since };
		} else if (metric === 'jobs') {
			Model = Job;
			match = { createdAt: { $gte: since } };
			if (employerJobIds) match.employer = req.user._id;
		} else if (metric === 'users') {
			Model = User;
			match = { createdAt: { $gte: since } };
		} else if (metric === 'events') {
			Model = AnalyticsEvent;
			match = { occurredAt: { $gte: since } };
		} else {
			return res.status(400).json({ success: false, message: 'Invalid metric' });
		}

		// Use dateTrunc if available; fallback to manual day extraction
		const pipeline = [];
		pipeline.push({ $match: match });
		pipeline.push({
			$group: {
				_id: {
					year: { $year: metric === 'events' ? '$occurredAt' : '$createdAt' },
					month: { $month: metric === 'events' ? '$occurredAt' : '$createdAt' },
					day: { $dayOfMonth: metric === 'events' ? '$occurredAt' : '$createdAt' }
				},
				count: { $sum: 1 }
			}
		});
		pipeline.push({ $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } });

		const rows = await Model.aggregate(pipeline);
		const data = rows.map(r => ({
			date: new Date(r._id.year, r._id.month - 1, r._id.day).toISOString().slice(0, 10),
			count: r.count
		}));

		return res.json({ success: true, metric, rangeDays, data });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Server error' });
	}
}

// GET /api/analytics/top-jobs?limit=5
async function topJobs(req, res) {
	try {
		const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 5, 1), 50);
		const employerJobIds = await getEmployerJobIds(req.user);
		const match = employerJobIds ? { job: { $in: employerJobIds } } : {};

		const rows = await Application.aggregate([
			{ $match: match },
			{ $group: { _id: '$job', applications: { $sum: 1 } } },
			{ $sort: { applications: -1 } },
			{ $limit: limit },
			{ $lookup: { from: 'jobs', localField: '_id', foreignField: '_id', as: 'job' } },
			{ $unwind: '$job' }
		]);

		return res.json({ success: true, items: rows });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Server error' });
	}
}

// POST /api/analytics/event (public)
async function trackEvent(req, res) {
	try {
		const { eventName, sessionId, page, referrer, userAgent, ip, metadata = {}, job } = req.body;
		if (!eventName) return res.status(400).json({ success: false, message: 'eventName is required' });
		const doc = await AnalyticsEvent.create({
			eventName,
			user: req.user ? req.user._id : undefined,
			job,
			sessionId,
			page,
			referrer,
			userAgent: userAgent || req.headers['user-agent'],
			ip: ip || req.ip,
			metadata
		});
		return res.status(201).json({ success: true, event: doc });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Server error' });
	}
}

module.exports = { overview, timeseries, topJobs, trackEvent };
