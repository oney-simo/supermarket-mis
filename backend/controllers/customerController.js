const Customer = require('../models/Customer');
const Sale = require('../models/sales');
const { logActivity } = require('../services/activityLogger');


// CREATE CUSTOMER
exports.createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);

    await logActivity({
      req,
      user: { userId: req.user?.userId },
      action: 'create',
      module: 'Customers',
      description: `Created customer ${customer.name || customer.phone || customer._id}`,
      referenceId: customer._id.toString(),
      referenceModel: 'Customer'
    });

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create customer',
      error: error.message
    });
  }
};


// GET ALL CUSTOMERS
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Customers retrieved successfully',
      data: customers
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve customers',
      error: error.message
    });
  }
};


// GET SINGLE CUSTOMER
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: customer
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve customer',
      error: error.message
    });
  }
};


// UPDATE CUSTOMER
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    await logActivity({
      req,
      user: { userId: req.user?.userId },
      action: 'update',
      module: 'Customers',
      description: `Updated customer ${customer.name || customer.phone || customer._id}`,
      referenceId: customer._id.toString(),
      referenceModel: 'Customer'
    });

    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      data: customer
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update customer',
      error: error.message
    });
  }
};


// DELETE CUSTOMER
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    await logActivity({
      req,
      user: { userId: req.user?.userId },
      action: 'delete',
      module: 'Customers',
      description: `Deleted customer ${customer.name || customer.phone || customer._id}`,
      referenceId: customer._id.toString(),
      referenceModel: 'Customer'
    });

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete customer',
      error: error.message
    });
  }
};

exports.getCustomerPurchases = async (req, res) => {
  try {
    const customerId = req.params.id;

    const purchases = await Sale.find({
      customer: customerId
    })
    .sort({ createdAt: -1 })
    .select(
      'receiptNumber grandTotal paymentMethod paymentStatus createdAt'
    );

    const totalSpent = purchases.reduce(
      (sum, sale) => sum + sale.grandTotal,
      0
    );

    res.status(200).json({
      success: true,
      message: 'Customer purchase history retrieved successfully',
      data: {
        totalOrders: purchases.length,
        totalSpent,
        purchases
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve customer purchases',
      error: error.message
    });
  }
};