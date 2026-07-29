import api from './axios';

export const getSettings = async () => {
  const response = await api.get('/settings');
  return response.data; // Returns the settings object
};

export const updateSettings = async (settingsData) => {
  const response = await api.put('/settings', settingsData);
  return response.data; // Returns { message, settings }
};