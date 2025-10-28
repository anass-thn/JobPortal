const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      index: true,
    },
    sessionId: { type: String, index: true },
    page: { type: String, trim: true },
    referrer: { type: String, trim: true },
    userAgent: { type: String },
    ip: { type: String },
    metadata: {
      type: Object,
      default: {},
    },
    occurredAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index to speed up common queries (events over time, by name)
analyticsEventSchema.index({ eventName: 1, occurredAt: -1 });

// Optional TTL (uncomment to auto-expire after N days)
// analyticsEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 }); // 90 days

module.exports = mongoose.model('AnalyticsEvent', analyticsEventSchema);


