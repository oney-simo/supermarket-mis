const test = require('node:test');
const assert = require('node:assert/strict');
const { getInventoryStockStatus } = require('../utils/stockStatus');

test('returns expired before low or out of stock', () => {
  const item = {
    quantity: 3,
    expiryDate: new Date('2020-01-01'),
    product: { reorderLevel: 10 }
  };

  assert.equal(getInventoryStockStatus(item, new Date('2024-01-01')), 'Expired');
});

test('returns out of stock when quantity is zero', () => {
  const item = {
    quantity: 0,
    product: { reorderLevel: 10 }
  };

  assert.equal(getInventoryStockStatus(item), 'Out of Stock');
});

test('returns low stock when quantity is below the configured threshold', () => {
  const item = {
    quantity: 3,
    product: { reorderLevel: 10 }
  };

  assert.equal(getInventoryStockStatus(item, new Date(), 5), 'Low Stock');
});

test('returns in stock when quantity is above the threshold', () => {
  const item = {
    quantity: 10,
    product: { reorderLevel: 10 }
  };

  assert.equal(getInventoryStockStatus(item, new Date(), 5), 'In Stock');
});
