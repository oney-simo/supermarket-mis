import test from 'node:test';
import assert from 'node:assert/strict';

import { buildProductPayload, normalizeCategoriesResponse } from './productFormUtils.js';

test('buildProductPayload preserves the selected category ObjectId', () => {
  const payload = buildProductPayload({
    name: 'Test Product',
    sku: 'SKU1',
    category: '507f1f77bcf86cd799439011',
    buyingPrice: '10',
    sellingPrice: '15',
    barcode: '',
    unit: 'Piece',
    reorderLevel: 10,
    description: 'A test product'
  });

  assert.equal(payload.category, '507f1f77bcf86cd799439011');
});

test('normalizeCategoriesResponse handles the API envelope and category id fields', () => {
  const categories = normalizeCategoriesResponse({
    data: {
      categories: [
        { _id: '507f1f77bcf86cd799439011', name: 'Drinks' },
        { id: '507f1f77bcf86cd799439012', name: 'Food' }
      ]
    }
  });

  assert.equal(categories[0]._id, '507f1f77bcf86cd799439011');
  assert.equal(categories[1]._id, '507f1f77bcf86cd799439012');
});
