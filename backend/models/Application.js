const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
      default: 'pending',
      index: true,
    },
    coverLetter: { type: String, maxlength: 2000 },
    resumeUrl: { type: String, required: true },
    additionalDocuments: [
      {
        name: String,
        url: String,
      },
    ],
    notes: { type: String, maxlength: 1000 },
    appliedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
    interviewScheduled: { type: Boolean, default: false },
    interviewDate: { type: Date },
    interviewNotes: { type: String },
  },
  { timestamps: true }
);

// One application per applicant per job
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

// Convenience virtual
applicationSchema.virtual('daysSinceApplication').get(function () {
  const now = new Date();
  const applied = this.appliedAt || this.createdAt;
  const diffMs = Math.abs(now - applied);
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('Application', applicationSchema);


