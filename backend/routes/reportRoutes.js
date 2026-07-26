const express = require('express');
const {
  getSalesSummary,
  getTopSellingProducts,
  getInventoryValuation,
  getDailySalesChart
} = require('../controllers/reportController');

const router = express.Router();

router.get('/sales-summary', getSalesSummary);
router.get('/top-selling-products', getTopSellingProducts);
router.get('/inventory-valuation', getInventoryValuation);
router.get('/daily-sales-chart', getDailySalesChart);

module.exports = router;
