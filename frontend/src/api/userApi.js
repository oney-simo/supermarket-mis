import api from './axios';

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const createUser = async (userData) => {
  // expects { username, password, role, fullName }
  const response = await api.post('/users', userData);
  return response.data;
};

export const resetPassword = async (id, newPassword) => {
  const response = await api.put(`/users/${id}/reset-password`, { newPassword });
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};