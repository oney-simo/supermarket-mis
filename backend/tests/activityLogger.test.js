const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveActivityUserId } = require('../services/activityLogger');

test('resolveActivityUserId returns null for an empty user object', () => {
  assert.equal(resolveActivityUserId({ userId: undefined }), null);
});

test('resolveActivityUserId returns the user id from a user object', () => {
  assert.equal(resolveActivityUserId({ userId: '507f1f77bcf86cd799439011' }), '507f1f77bcf86cd799439011');
});
