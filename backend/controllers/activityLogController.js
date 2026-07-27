const ActivityLog = require('../models/ActivityLog');
const { buildFilterQuery } = require('../services/activityLogger');

exports.getActivityLogs = async (req, res) => {
  try {
    const {
      user,
      action,
      module,
      referenceModel,
      startDate,
      endDate,
      page = 1,
      limit = 20
    } = req.query;

    const query = buildFilterQuery({
      user,
      action,
      module,
      referenceModel,
      startDate,
      endDate
    });

    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(limit) || 20));

    const [logs, total] = await Promise.all([
      ActivityLog.find(query)
        .populate('user', '_id username fullName role')
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize),
      ActivityLog.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      message: 'Activity logs retrieved successfully',
      data: logs,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve activity logs',
      error: error.message
    });
  }
};

exports.getActivityLogById = async (req, res) => {
  try {
    const log = await ActivityLog.findById(req.params.id).populate('user', '_id username fullName role');

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Activity log not found'
      });
    }

    res.status(200).json({
      success: true,
      data: log
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve activity log',
      error: error.message
    });
  }
};
