const test = require('node:test');
const assert = require('node:assert/strict');
const { buildFilterQuery } = require('../services/activityLogger');

test('buildFilterQuery returns a Mongo-compatible filter object', () => {
  const query = buildFilterQuery({
    user: '64d4d2d9f2a824b0d1a2b3c4',
    action: 'create',
    module: 'Products',
    referenceModel: 'Product',
    startDate: '2026-01-01',
    endDate: '2026-01-31'
  });

  assert.equal(query.user.toString(), '64d4d2d9f2a824b0d1a2b3c4');
  assert.ok(query.action.test('create'));
  assert.ok(query.module.test('Products'));
  assert.ok(query.referenceModel.test('Product'));
  assert.ok(query.createdAt.$gte instanceof Date);
  assert.ok(query.createdAt.$lte instanceof Date);
});
