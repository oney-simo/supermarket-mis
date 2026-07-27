const mongoose = require('mongoose');
const Supplier = require('../models/supplier');
const { logActivity } = require('../services/activityLogger');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


// GET ALL SUPPLIERS
exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });

    res.status(200).json(suppliers);

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


// GET SINGLE SUPPLIER
exports.getSupplierById = async (req, res) => {
  try {

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid supplier ID'
      });
    }

    const supplier = await Supplier.findById(req.params.id);


    if (!supplier) {
      return res.status(404).json({
        message: 'Supplier not found'
      });
    }


    res.status(200).json(supplier);


  } catch (error) {

    res.status(500).json({
      message: 'Server error',
      error: error.message
    });

  }
};


// CREATE SUPPLIER
exports.createSupplier = async (req, res) => {

  try {

    const supplier = new Supplier(req.body);

    const savedSupplier = await supplier.save();


    await logActivity({
      req,
      user: { userId: req.user?.userId },
      action: 'create',
      module: 'Suppliers',
      description: `Created supplier ${savedSupplier.name}`,
      referenceId: savedSupplier._id.toString(),
      referenceModel: 'Supplier'
    });

    res.status(201).json(savedSupplier);


  } catch (error) {

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.errors
      });
    }


    res.status(500).json({
      message: 'Server error',
      error: error.message
    });

  }

};


// UPDATE SUPPLIER
exports.updateSupplier = async (req, res) => {

  try {

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid supplier ID'
      });
    }


    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );


    if (!updatedSupplier) {
      return res.status(404).json({
        message: 'Supplier not found'
      });
    }


    await logActivity({
      req,
      user: { userId: req.user?.userId },
      action: 'update',
      module: 'Suppliers',
      description: `Updated supplier ${updatedSupplier.name}`,
      referenceId: updatedSupplier._id.toString(),
      referenceModel: 'Supplier'
    });

    res.status(200).json(updatedSupplier);


  } catch (error) {

    res.status(500).json({
      message: 'Server error',
      error: error.message
    });

  }

};


// DELETE SUPPLIER
exports.deleteSupplier = async (req, res) => {

  try {

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid supplier ID'
      });
    }


    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);


    if (!deletedSupplier) {
      return res.status(404).json({
        message: 'Supplier not found'
      });
    }


    await logActivity({
      req,
      user: { userId: req.user?.userId },
      action: 'delete',
      module: 'Suppliers',
      description: `Deleted supplier ${deletedSupplier.name}`,
      referenceId: deletedSupplier._id.toString(),
      referenceModel: 'Supplier'
    });

    res.status(200).json({
      message: 'Supplier deleted successfully'
    });


  } catch (error) {

    res.status(500).json({
      message: 'Server error',
      error: error.message
    });

  }

};