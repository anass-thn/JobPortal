const Job = require('../models/Job');

// POST /api/jobs (employer or admin)
async function createJob(req, res) {
	try {
		const allowed = [
			'title',
			'description',
			'company',
			'location',
			'type',
			'category',
			'salary',
			'requirements',
			'skills',
			'benefits',
			'status',
			'featured',
			'deadline',
			'experience'
		];
		const data = {};
		for (const key of allowed) {
			if (Object.prototype.hasOwnProperty.call(req.body, key)) {
				data[key] = req.body[key];
			}
		}
		data.employer = req.user._id;

		const job = await Job.create(data);
		return res.status(201).json({ success: true, job });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Server error' });
	}
}

// GET /api/jobs/:id (public)
async function getJobById(req, res) {
	try {
		const job = await Job.findById(req.params.id);
		if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
		
		// Increment views only if viewer is not the job owner
		// This prevents employers from inflating their own job view counts
		const isOwner = req.user && job.employer && job.employer.toString() === req.user._id.toString();
		if (!isOwner) {
			// Increment views (non-blocking) - only for non-owners
			Job.findByIdAndUpdate(job._id, { $inc: { views: 1 } }).exec();
		}
		
		return res.json({ success: true, job });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Server error' });
	}
}

// GET /api/jobs (public list with filters, or employer's jobs if authenticated as employer)
async function listJobs(req, res) {
	try {
		const {
			q,
			type,
			category,
			location,
			experience,
			status,
			page = 1,
			limit = 10,
			sort = '-createdAt',
			myJobs // if true and user is employer, return only their jobs
		} = req.query;

		const query = {};
		
		// If authenticated as employer and myJobs=true, filter by employer
		if (req.user && req.user.userType === 'employer' && myJobs === 'true') {
			query.employer = req.user._id;
		}
		
		// Status filter (default to 'active' only for public, no default for employer's own jobs)
		if (status) {
			query.status = status;
		} else if (!req.user || req.user.userType !== 'employer' || myJobs !== 'true') {
			// Default to active for public listings
			query.status = 'active';
		}
		
		if (type) query.type = type;
		if (category) query.category = category;
		if (location) query.location = new RegExp(location, 'i');
		if (experience) query.experience = experience;
		if (q) {
			query.$text = { $search: q };
		}

		const pageNum = Math.max(parseInt(page, 10) || 1, 1);
		const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
		const skip = (pageNum - 1) * limitNum;

		const [items, total] = await Promise.all([
			Job.find(query).sort(sort).skip(skip).limit(limitNum),
			Job.countDocuments(query)
		]);

		return res.json({ success: true, items, total, page: pageNum, pageSize: limitNum, pages: Math.ceil(total / limitNum) });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Server error' });
	}
}

// PUT /api/jobs/:id (employer owns or admin)
async function updateJob(req, res) {
	try {
		const job = await Job.findById(req.params.id);
		if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

		const isOwner = job.employer && job.employer.toString() === req.user._id.toString();
		const isAdmin = req.user && req.user.userType === 'admin';
		if (!isOwner && !isAdmin) return res.status(403).json({ success: false, message: 'Forbidden' });

		const allowed = [
			'title', 'description', 'company', 'location', 'type', 'category', 'salary', 'requirements', 'skills', 'benefits', 'status', 'featured', 'deadline', 'experience'
		];
		for (const key of Object.keys(req.body)) {
			if (!allowed.includes(key)) delete req.body[key];
		}

		const updated = await Job.findByIdAndUpdate(job._id, req.body, { new: true, runValidators: true });
		return res.json({ success: true, job: updated });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Server error' });
	}
}

// DELETE /api/jobs/:id (employer owns or admin)
async function deleteJob(req, res) {
	try {
		const job = await Job.findById(req.params.id);
		if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

		const isOwner = job.employer && job.employer.toString() === req.user._id.toString();
		const isAdmin = req.user && req.user.userType === 'admin';
		if (!isOwner && !isAdmin) return res.status(403).json({ success: false, message: 'Forbidden' });

		await Job.findByIdAndDelete(job._id);
		return res.json({ success: true, message: 'Job deleted' });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Server error' });
	}
}

module.exports = { createJob, getJobById, listJobs, updateJob, deleteJob };
