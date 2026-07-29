import api from './axios';

export const getSalesSummary = async (startDate, endDate) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  const response = await api.get('/reports/sales-summary', { params });
  return response.data; // Returns { totalSales, totalRevenue, totalTax, totalDiscount, period }
};

export const getTopSellingProducts = async () => {
  const response = await api.get('/reports/top-selling-products');
  return response.data; // Returns [{ name, sku, unit, quantity, revenue }]
};

export const getInventoryValuation = async () => {
  const response = await api.get('/reports/inventory-valuation');
  return response.data; // Returns { totalUnits, totalAssetCost, totalRetailValue }
};

export const getDailySalesChart = async () => {
  const response = await api.get('/reports/daily-sales-chart');
  return response.data; // Returns 7-day array [{ date, revenue, transactions }]
};