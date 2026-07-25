const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../server');

let server;
let baseUrl;

const productPayload = {
  name: 'Milk',
  sku: 'MILK-001',
  category: 'Dairy',
  price: 45,
  buyingPrice: 30,
  sellingPrice: 45,
  discount: 5,
  stock: 20,
  stockQuantity: 20,
  reorderLevel: 10,
  description: 'Fresh whole milk',
  status: 'Active'
};

test.before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

test.after(async () => {
  await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
});

test('creates, reads, updates and deletes a product', async () => {
  const createResponse = await fetch(`${baseUrl}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productPayload)
  });

  assert.equal(createResponse.status, 201);
  const createdProduct = await createResponse.json();
  assert.equal(createdProduct.name, productPayload.name);
  assert.equal(createdProduct.sku, 'MILK-001');

  const getResponse = await fetch(`${baseUrl}/api/products/${createdProduct._id}`);
  assert.equal(getResponse.status, 200);
  const fetchedProduct = await getResponse.json();
  assert.equal(fetchedProduct._id, createdProduct._id);

  const updateResponse = await fetch(`${baseUrl}/api/products/${createdProduct._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ price: 50, stock: 25 })
  });
  assert.equal(updateResponse.status, 200);
  const updatedProduct = await updateResponse.json();
  assert.equal(updatedProduct.price, 50);
  assert.equal(updatedProduct.stock, 25);

  const deleteResponse = await fetch(`${baseUrl}/api/products/${createdProduct._id}`, {
    method: 'DELETE'
  });
  assert.equal(deleteResponse.status, 200);
  const deletedPayload = await deleteResponse.json();
  assert.equal(deletedPayload.message, 'Product deleted successfully');
});
