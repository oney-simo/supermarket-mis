const ActivityLog = require('../models/ActivityLog');

const normalizeReferenceId = (value) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'object' && value._id) {
    return String(value._id);
  }

  return String(value);
};

const getClientIp = (req) => {
  if (!req) {
    return null;
  }

  const forwarded = req.headers?.['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  return req.ip || req.connection?.remoteAddress || null;
};

const resolveActivityUserId = (user) => {
  if (!user) {
    return null;
  }

  if (typeof user === 'string') {
    return user.trim() || null;
  }

  if (typeof user === 'object') {
    const candidate = user.userId ?? user.id ?? null;

    if (typeof candidate === 'string') {
      return candidate.trim() || null;
    }

    if (candidate && typeof candidate === 'object' && candidate.toString) {
      const value = candidate.toString();
      return value && value !== '[object Object]' ? value : null;
    }
  }

  return null;
};

exports.resolveActivityUserId = resolveActivityUserId;

exports.logActivity = async ({
  req,
  user,
  action,
  module,
  description,
  referenceId,
  referenceModel,
  metadata = {}
}) => {
  if (!action || !module || !description) {
    return null;
  }

  const resolvedUserId = resolveActivityUserId(user);

  const logEntry = await ActivityLog.create({
    user: resolvedUserId,
    action,
    module,
    description,
    referenceId: normalizeReferenceId(referenceId),
    referenceModel,
    ipAddress: getClientIp(req),
    metadata
  });

  return logEntry;
};

exports.buildFilterQuery = ({ user, action, module, referenceModel, startDate, endDate }) => {
  const query = {};

  if (user) {
    query.user = user;
  }

  if (action) {
    query.action = new RegExp(action, 'i');
  }

  if (module) {
    query.module = new RegExp(module, 'i');
  }

  if (referenceModel) {
    query.referenceModel = new RegExp(referenceModel, 'i');
  }

  if (startDate || endDate) {
    query.createdAt = {};

    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }

    if (endDate) {
      query.createdAt.$lte = new Date(endDate);
    }
  }

  return query;
};
