const StockReceiving = require('../models/stockReceiving');
const Purchase = require('../models/purchase');
const PurchaseItem = require('../models/purchaseItems');
const Product = require('../models/Product');
const Supplier = require('../models/supplier');
const Category = require('../models/Category');

async function seedStockReceivingDemoData() {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  let category = await Category.findOne({ name: 'Demo Goods' });
  if (!category) {
    category = await Category.create({
      name: 'Demo Goods',
      description: 'Seeded demo category',
      status: 'Active'
    });
  }

  let supplier = await Supplier.findOne({ companyName: 'Demo Supplier' });
  if (!supplier) {
    supplier = await Supplier.create({
      name: 'Demo Supplier',
      phone: '0712345678',
      companyName: 'Demo Supplier',
      email: 'demo@supplier.test',
      address: 'Nairobi',
      contactPerson: 'Jane Doe',
      description: 'Seeded demo supplier'
    });
  }

  let product = await Product.findOne();
  if (!product) {
    product = await Product.create({
      name: 'Demo Product',
      sku: 'DEMO-001',
      category: category._id,
      buyingPrice: 100,
      sellingPrice: 140,
      unit: 'Piece',
      supplier: supplier._id,
      description: 'Seeded demo product'
    });
  }

  let purchase = await Purchase.findOne({ invoiceNumber: 'INV-DEMO-001' });
  if (!purchase) {
    purchase = await Purchase.create({
      supplier: supplier._id,
      invoiceNumber: 'INV-DEMO-001',
      purchaseDate: new Date(),
      totalAmount: 7000,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      notes: 'Seeded demo purchase'
    });
  }

  const existingPurchaseItem = await PurchaseItem.findOne({ purchase: purchase._id });
  if (!existingPurchaseItem) {
    await PurchaseItem.create({
      purchase: purchase._id,
      product: product._id,
      quantity: 50,
      buyingPrice: 100,
      subtotal: 5000
    });
  }

  const existingReceiving = await StockReceiving.findOne({ purchase: purchase._id });
  if (!existingReceiving) {
    await StockReceiving.create({
      purchase: purchase._id,
      product: product._id,
      quantityReceived: 50,
      batchNumber: 'BATCH-DEMO-001',
      manufacturingDate: new Date('2026-01-01'),
      expiryDate: new Date('2027-01-01'),
      condition: 'Good'
    });
  }

  console.log('Seeded demo purchase, purchase item, and stock receiving data for the frontend screen.');
}

module.exports = seedStockReceivingDemoData;
