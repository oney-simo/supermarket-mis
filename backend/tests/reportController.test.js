const test = require('node:test');
const assert = require('node:assert/strict');
const reportController = require('../controllers/reportController');
const Sale = require('../models/sales');
const SaleItem = require('../models/salesItems');
const Inventory = require('../models/inventory');

function createRes() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
}

test('getSalesSummary returns aggregate totals for the selected period', async () => {
  Sale.aggregate = async () => [
    { totalSales: 2, totalRevenue: 120, totalTax: 10, totalDiscount: 5 }
  ];

  const req = { query: { startDate: '2026-07-01', endDate: '2026-07-31' } };
  const res = createRes();

  await reportController.getSalesSummary(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, {
    totalSales: 2,
    totalRevenue: 120,
    totalTax: 10,
    totalDiscount: 5,
    period: {
      startDate: '2026-07-01',
      endDate: '2026-07-31'
    }
  });
});

test('getTopSellingProducts returns products sorted by quantity', async () => {
  SaleItem.aggregate = async () => [
    {
      product: 'product-1',
      name: 'Milk',
      sku: 'MILK-001',
      unit: 'Bottle',
      quantity: 12
    }
  ];

  const req = {};
  const res = createRes();

  await reportController.getTopSellingProducts(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, [
    {
      product: 'product-1',
      name: 'Milk',
      sku: 'MILK-001',
      unit: 'Bottle',
      quantity: 12
    }
  ]);
});

test('getInventoryValuation calculates asset and retail values', async () => {
  Inventory.aggregate = async () => [
    {
      totalUnits: 10,
      totalAssetCost: 300,
      totalRetailValue: 500
    }
  ];

  const req = {};
  const res = createRes();

  await reportController.getInventoryValuation(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, {
    totalUnits: 10,
    totalAssetCost: 300,
    totalRetailValue: 500
  });
});

test('getDailySalesChart returns seven-day trend data', async () => {
  Sale.aggregate = async () => [
    { date: '2026-07-22', revenue: 120, transactions: 2 }
  ];

  const req = {};
  const res = createRes();

  await reportController.getDailySalesChart(req, res);

  assert.equal(res.statusCode, 200);
  assert.ok(Array.isArray(res.body));
  assert.equal(res.body.length, 7);
  const matchingEntry = res.body.find((entry) => entry.date === '2026-07-22');
  assert.ok(matchingEntry);
  assert.equal(matchingEntry.revenue, 120);
  assert.equal(matchingEntry.transactions, 2);
});
