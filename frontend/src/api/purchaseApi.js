import api from './axios';

export const getPurchases = async () => {
  const response = await api.get('/purchases');
  return response.data;
};

export const createPurchase = async (purchaseData) => {
  const response = await api.post('/purchases', purchaseData);
  return response.data;
};
