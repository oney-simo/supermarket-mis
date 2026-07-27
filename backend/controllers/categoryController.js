const mongoose = require('mongoose');
const Category = require('../models/Category');
const { logActivity } = require('../services/activityLogger');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


// GET ALL CATEGORIES
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json(categories);

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


// GET SINGLE CATEGORY
exports.getCategoryById = async (req, res) => {
  try {

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid category ID'
      });
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: 'Category not found'
      });
    }

    res.status(200).json(category);

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


// CREATE CATEGORY
exports.createCategory = async (req, res) => {
  try {

    const category = new Category(req.body);

    const savedCategory = await category.save();

    await logActivity({
      req,
      user: { userId: req.user?.userId },
      action: 'create',
      module: 'Categories',
      description: `Created category ${savedCategory.name}`,
      referenceId: savedCategory._id.toString(),
      referenceModel: 'Category'
    });

    res.status(201).json(savedCategory);

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Category already exists'
      });
    }

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


// UPDATE CATEGORY
exports.updateCategory = async (req, res) => {
  try {

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid category ID'
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );


    if (!updatedCategory) {
      return res.status(404).json({
        message: 'Category not found'
      });
    }

    await logActivity({
      req,
      user: { userId: req.user?.userId },
      action: 'update',
      module: 'Categories',
      description: `Updated category ${updatedCategory.name}`,
      referenceId: updatedCategory._id.toString(),
      referenceModel: 'Category'
    });

    res.status(200).json(updatedCategory);


  } catch (error) {

    res.status(500).json({
      message: 'Server error',
      error: error.message
    });

  }
};


// DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
  try {

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid category ID'
      });
    }


    const deletedCategory = await Category.findByIdAndDelete(req.params.id);


    if (!deletedCategory) {
      return res.status(404).json({
        message: 'Category not found'
      });
    }

    await logActivity({
      req,
      user: { userId: req.user?.userId },
      action: 'delete',
      module: 'Categories',
      description: `Deleted category ${deletedCategory.name}`,
      referenceId: deletedCategory._id.toString(),
      referenceModel: 'Category'
    });

    res.status(200).json({
      message: 'Category deleted successfully'
    });


  } catch (error) {

    res.status(500).json({
      message: 'Server error',
      error: error.message
    });

  }
};