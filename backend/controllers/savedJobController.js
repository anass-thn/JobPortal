const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');

// POST /api/saved/:jobId (jobseeker)
async function saveJob(req, res) {
	try {
		const { jobId } = req.params;
		const { note = '' } = req.body;
		const job = await Job.findById(jobId);
		if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

		const doc = await SavedJob.findOneAndUpdate(
			{ user: req.user._id, job: job._id },
			{ $setOnInsert: { user: req.user._id, job: job._id }, $set: { note } },
			{ upsert: true, new: true }
		);
		return res.status(201).json({ success: true, saved: doc });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Server error' });
	}
}

// GET /api/saved (auth)
async function listSavedJobs(req, res) {
	try {
		const { page = 1, limit = 10 } = req.query;
		const pageNum = Math.max(parseInt(page, 10) || 1, 1);
		const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
		const skip = (pageNum - 1) * limitNum;

		const [items, total] = await Promise.all([
			SavedJob.find({ user: req.user._id }).populate('job').sort('-createdAt').skip(skip).limit(limitNum),
			SavedJob.countDocuments({ user: req.user._id })
		]);
		return res.json({ success: true, items, total, page: pageNum, pageSize: limitNum, pages: Math.ceil(total / limitNum) });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Server error' });
	}
}

// DELETE /api/saved/:jobId (auth)
async function removeSavedJob(req, res) {
	try {
		const { jobId } = req.params;
		const deleted = await SavedJob.findOneAndDelete({ user: req.user._id, job: jobId });
		if (!deleted) return res.status(404).json({ success: false, message: 'Saved job not found' });
		return res.json({ success: true, message: 'Removed from saved' });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Server error' });
	}
}

module.exports = { saveJob, listSavedJobs, removeSavedJob };
