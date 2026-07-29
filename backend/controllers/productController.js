const mongoose = require('mongoose');
const Product = require('../models/Product');
const { logActivity } = require('../services/activityLogger');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.getProducts = async (req, res) => {
  try {
  const products = await Product.find()
  .populate('category')
  .populate('supplier')
  .sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findById(req.params.id)
  .populate('category')
  .populate('supplier');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    if (req.body.barcode === "") {
  delete req.body.barcode;
}
    const product = new Product(req.body);
    const savedProduct = await product.save();

    await logActivity({
      req,
      user: { userId: req.user?.userId },
      action: 'create',
      module: 'Products',
      description: `Created product ${savedProduct.name}`,
      referenceId: savedProduct._id.toString(),
      referenceModel: 'Product'
    });

    res.status(201).json(savedProduct);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }

   if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];

    return res.status(400).json({
        message: `${field} already exists`
    });
}

    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await logActivity({
      req,
      user: { userId: req.user?.userId },
      action: 'update',
      module: 'Products',
      description: `Updated product ${updatedProduct.name}`,
      referenceId: updatedProduct._id.toString(),
      referenceModel: 'Product'
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }

    if (error.code === 11000) {
      return res.status(400).json({ message: 'SKU already exists' });
    }

    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await logActivity({
      req,
      user: { userId: req.user?.userId },
      action: 'delete',
      module: 'Products',
      description: `Deleted product ${deletedProduct.name}`,
      referenceId: deletedProduct._id.toString(),
      referenceModel: 'Product'
    });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
