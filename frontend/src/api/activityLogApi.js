import api from './axios';

export const getActivityLogs = async (filters = {}) => {
  // filters can include: { page, limit, module, action, user, startDate, endDate }
  const response = await api.get('/activity-logs', { params: filters });
  return response.data; // Returns { success, message, data: [...], pagination: { page, limit, total } }
};

export const getActivityLogById = async (id) => {
  const response = await api.get(`/activity-logs/${id}`);
  return response.data; // Returns { success, data: { ... } }
};
