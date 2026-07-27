const mongoose = require('mongoose');
const Sale = require('../models/sales');
const SaleItem = require('../models/salesItems');
const Inventory = require('../models/inventory');
const Product = require('../models/Product');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// CREATE SALE (CHECKOUT POS)
exports.createSale = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { receiptNumber, customerName, items, discount = 0, tax = 0, paymentMethod, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Sale must contain at least one item' });
    }

    let calculatedTotal = 0;
    const saleItemsToCreate = [];

    // STEP 1 & 2: Verify Stock and Apply FEFO Batch Selection
    for (const item of items) {
      if (!isValidObjectId(item.product)) {
        throw new Error(`Invalid product ID: ${item.product}`);
      }

      const product = await Product.findById(item.product).session(session);
      if (!product) {
        throw new Error(`Product not found: ${item.product}`);
      }

      let remainingQtyToDeduct = item.quantity;

      // Find available stock sorted by nearest expiry date (FEFO)
      const availableBatches = await Inventory.find({
        product: item.product,
        status: 'Available',
        quantity: { $gt: 0 }
      })
        .sort({ expiryDate: 1, createdAt: 1 }) // Oldest expiry first
        .session(session);

      const totalAvailableStock = availableBatches.reduce((acc, b) => acc + b.quantity, 0);

      if (totalAvailableStock < item.quantity) {
        throw new Error(`Insufficient stock for "${product.name}". Requested: ${item.quantity}, Available: ${totalAvailableStock}`);
      }

      // Deduct stock across multiple batches if necessary
      for (const batch of availableBatches) {
        if (remainingQtyToDeduct <= 0) break;

        const deductQty = Math.min(batch.quantity, remainingQtyToDeduct);
        batch.quantity -= deductQty;
        remainingQtyToDeduct -= deductQty;

        // If batch is empty, we can mark it out of stock
        if (batch.quantity === 0) {
          batch.status = 'Removed'; 
        }

        await batch.save({ session });

        // STEP 3: Price Calculation
        const unitPrice = item.unitPrice ?? product.sellingPrice;
        const subtotal = deductQty * unitPrice;
        calculatedTotal += subtotal;

        saleItemsToCreate.push({
          product: product._id,
          inventoryBatch: batch._id,
          quantity: deductQty,
          unitPrice,
          subtotal
        });
      }
    }

    const grandTotal = calculatedTotal - discount + tax;

    // STEP 4: The Database Transaction (Atomic Execution)
    // Create the Sale Header
    const sale = await Sale.create(
      [{
        receiptNumber,
        customerName,
        totalAmount: calculatedTotal,
        discount,
        tax,
        grandTotal,
        paymentMethod,
        notes
      }],
      { session }
    );

    // Attach sale ID to all line items and insert them
    const finalSaleItems = saleItemsToCreate.map((si) => ({
      ...si,
      sale: sale[0]._id
    }));

    const createdItems = await SaleItem.insertMany(finalSaleItems, { session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: 'Sale completed successfully',
      sale: sale[0],
      items: createdItems
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (error.code === 11000) {
      return res.status(400).json({ message: 'Receipt number already exists' });
    }

    return res.status(400).json({ message: error.message || 'Server error' });
  }
};


// GET ALL SALES
exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// GET SINGLE SALE WITH ITEMS
exports.getSaleById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid sale ID' });
    }

    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    const items = await SaleItem.find({ sale: req.params.id })
      .populate('product')
      .populate('inventoryBatch');

    res.status(200).json({ sale, items });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};