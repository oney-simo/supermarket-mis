import test from 'node:test';
import assert from 'node:assert/strict';

import { buildProductPayload, getCategoryId, getProductId, normalizeCategoriesResponse } from './productFormUtils.js';

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

test('buildProductPayload removes empty barcode values and normalizes SKU casing', () => {
  const payload = buildProductPayload({
    name: '  Test Product  ',
    sku: ' sku1 ',
    category: '507f1f77bcf86cd799439011',
    buyingPrice: '10',
    sellingPrice: '15',
    barcode: '   ',
    unit: ' Piece ',
    reorderLevel: 10,
    description: '  A test product  '
  });

  assert.equal(payload.name, 'Test Product');
  assert.equal(payload.sku, 'SKU1');
  assert.equal(payload.barcode, undefined);
  assert.equal(payload.unit, 'Piece');
  assert.equal(payload.description, 'A test product');
});

test('getCategoryId accepts a plain string category id', () => {
  assert.equal(getCategoryId('507f1f77bcf86cd799439011'), '507f1f77bcf86cd799439011');
});

test('getProductId resolves either _id or id values', () => {
  assert.equal(getProductId({ _id: '507f1f77bcf86cd799439011' }), '507f1f77bcf86cd799439011');
  assert.equal(getProductId({ id: '507f1f77bcf86cd799439012' }), '507f1f77bcf86cd799439012');
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
