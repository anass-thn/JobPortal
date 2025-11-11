const Application = require('../models/Application');
const Job = require('../models/Job');

// POST /api/applications/:jobId/apply (jobseeker)
async function applyToJob(req, res) {
	try {
		const { jobId } = req.params;
		const { coverLetter = '', resumeUrl, additionalDocuments = [] } = req.body;
		if (!resumeUrl) return res.status(400).json({ success: false, message: 'resumeUrl is required' });

		const job = await Job.findById(jobId);
		if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
		if (job.status !== 'active') return res.status(400).json({ success: false, message: 'Job is not active' });

		const payload = {
			job: job._id,
			applicant: req.user._id,
			employer: job.employer,
			coverLetter,
			resumeUrl,
			additionalDocuments,
		};

		// Enforce one application per applicant per job (unique index will also enforce)
		const exists = await Application.findOne({ job: job._id, applicant: req.user._id });
		if (exists) return res.status(409).json({ success: false, message: 'Already applied to this job' });

		const application = await Application.create(payload);
		// increment job applications count (non-blocking)
		Job.updateOne({ _id: job._id }, { $inc: { applicationsCount: 1 } }).exec();

		return res.status(201).json({ success: true, application });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Server error' });
	}
}

// GET /api/applications/my (authenticated applicant)
async function listMyApplications(req, res) {
	try {
		const { status, page = 1, limit = 10 } = req.query;
		const query = { applicant: req.user._id };
		if (status) query.status = status;
		const pageNum = Math.max(parseInt(page, 10) || 1, 1);
		const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
		const skip = (pageNum - 1) * limitNum;

		const [items, total] = await Promise.all([
			Application.find(query).populate('job').sort('-createdAt').skip(skip).limit(limitNum),
			Application.countDocuments(query)
		]);
		return res.json({ success: true, items, total, page: pageNum, pageSize: limitNum, pages: Math.ceil(total / limitNum) });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Server error' });
	}
}

// GET /api/applications/job/:jobId (employer/admin)
async function listApplicationsForJob(req, res) {
	try {
		const { jobId } = req.params;
		const { status, page = 1, limit = 10 } = req.query;
		const job = await Job.findById(jobId);
		if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
		const isOwner = job.employer && job.employer.toString() === req.user._id.toString();
		const isAdmin = req.user && req.user.userType === 'admin';
		if (!isOwner && !isAdmin) return res.status(403).json({ success: false, message: 'Forbidden' });

		const query = { job: job._id };
		if (status) query.status = status;
		const pageNum = Math.max(parseInt(page, 10) || 1, 1);
		const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
		const skip = (pageNum - 1) * limitNum;

		const [items, total] = await Promise.all([
			Application.find(query).populate('applicant').sort('-createdAt').skip(skip).limit(limitNum),
			Application.countDocuments(query)
		]);
		return res.json({ success: true, items, total, page: pageNum, pageSize: limitNum, pages: Math.ceil(total / limitNum) });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Server error' });
	}
}

// GET /api/applications/employer (employer/admin - all applications for employer's jobs)
async function listEmployerApplications(req, res) {
	try {
		const { status, page = 1, limit = 10 } = req.query;
		const query = { employer: req.user._id };
		if (status) query.status = status;
		const pageNum = Math.max(parseInt(page, 10) || 1, 1);
		const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
		const skip = (pageNum - 1) * limitNum;

		const [items, total] = await Promise.all([
			Application.find(query).populate('applicant', 'firstName lastName email avatar').populate('job', 'title company').sort('-createdAt').skip(skip).limit(limitNum),
			Application.countDocuments(query)
		]);
		return res.json({ success: true, items, total, page: pageNum, pageSize: limitNum, pages: Math.ceil(total / limitNum) });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Server error' });
	}
}

// PATCH /api/applications/:id/status (employer/admin)
async function updateApplicationStatus(req, res) {
	try {
		const { id } = req.params;
		const { status, notes } = req.body;
		const allowed = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];
		if (!allowed.includes(status)) {
			return res.status(400).json({ success: false, message: 'Invalid status' });
		}

		const application = await Application.findById(id);
		if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

		const job = await Job.findById(application.job);
		const isOwner = job && job.employer && job.employer.toString() === req.user._id.toString();
		const isAdmin = req.user && req.user.userType === 'admin';
		if (!isOwner && !isAdmin) return res.status(403).json({ success: false, message: 'Forbidden' });

		const update = { status };
		if (notes !== undefined) update.notes = notes;
		if (['reviewed', 'shortlisted', 'rejected', 'hired'].includes(status)) {
			update.reviewedAt = new Date();
		}

		const updated = await Application.findByIdAndUpdate(id, update, { new: true, runValidators: true });
		return res.json({ success: true, application: updated });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Server error' });
	}
}

module.exports = { applyToJob, listMyApplications, listApplicationsForJob, listEmployerApplications, updateApplicationStatus };
