import api from './axios';

export const getStockReceivings = async () => {
  const response = await api.get('/stock-receiving');
  return response.data;
};

export const receiveStock = async (data) => {
  const response = await api.post('/stock-receiving', data);
  return response.data;
};