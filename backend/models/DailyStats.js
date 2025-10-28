const mongoose = require('mongoose');

const dailyStatsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
      index: true,
    },
    // Aggregated counters
    usersRegistered: { type: Number, default: 0 },
    jobsPosted: { type: Number, default: 0 },
    applicationsSubmitted: { type: Number, default: 0 },
    pageViews: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    // Breakdown per event type (optional flexible map)
    eventCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DailyStats', dailyStatsSchema);


