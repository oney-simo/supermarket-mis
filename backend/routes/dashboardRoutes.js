const express = require('express');
console.log("Dashboard routes loaded");

const {
  getDashboardSummary,
  getRecentSales,
  getRecentPurchases,
  getDashboardAlerts,
  getSalesChart,
  getTopProducts,
  getPaymentSummary,
  getSalesPerformance
} = require('../controllers/dashboardController');

const router = express.Router();

// Dashboard Summary
router.get('/summary', getDashboardSummary);

// Recent Sales
router.get('/recent-sales', getRecentSales);

// Recent Purchases
router.get('/recent-purchases', getRecentPurchases);

// Dashboard Alerts
router.get('/alerts', getDashboardAlerts);

// sales chart
router.get('/sales-chart', getSalesChart);

// Top products
router.get('/top-products', getTopProducts);
// payment summary
router.get('/payment-summary', getPaymentSummary);
// sales performance
router.get('/sales-performance', getSalesPerformance);

router.get('/test', (req, res) => {
  res.json({
    message: 'Dashboard route is working'
  });
});

module.exports = router;