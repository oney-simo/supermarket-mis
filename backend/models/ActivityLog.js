const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      trim: true
    },
    module: {
      type: String,
      required: [true, 'Module is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    referenceId: {
      type: String,
      default: null,
      trim: true
    },
    referenceModel: {
      type: String,
      default: null,
      trim: true
    },
    ipAddress: {
      type: String,
      default: null,
      trim: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
