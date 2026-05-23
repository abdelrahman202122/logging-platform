const mongoose = require('mongoose');
const { LOG_LEVELS } = require('../constants/logLevels');

const logSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      required: true,
      enum: LOG_LEVELS,
      uppercase: true,
    },
    count: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  { timestamps: true },
);

logSchema.index({ application: 1, message: 1, level: 1 }, { unique: true });
logSchema.index({ application: 1, createdAt: -1 });
logSchema.index({ application: 1, level: 1 });

module.exports = mongoose.model('Log', logSchema);
