const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    company: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    salary: {
      min: { type: Number, min: 0 },
      max: { type: Number, min: 0 },
      currency: { type: String, default: 'USD' },
      period: { type: String, enum: ['hourly', 'monthly', 'yearly'], default: 'yearly' },
    },
    requirements: [{ type: String, trim: true }],
    skills: [{ type: String, trim: true }],
    benefits: [{ type: String, trim: true }],
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'closed'],
      default: 'active',
    },
    featured: { type: Boolean, default: false },
    deadline: { type: Date },
    experience: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'executive'],
      required: true,
    },
    views: { type: Number, default: 0 },
    applicationsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index for search
jobSchema.index({ title: 'text', description: 'text', company: 'text', location: 'text', skills: 'text' });

// Derived count (if applications array used later)
jobSchema.virtual('applicationCount').get(function () {
  return this.applicationsCount;
});

module.exports = mongoose.model('Job', jobSchema);


