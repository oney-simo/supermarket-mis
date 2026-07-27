const express = require('express');

const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');


const router = express.Router();


// Create customer
router.post('/', createCustomer);


// Get all customers
router.get('/', getCustomers);


// Get single customer
router.get('/:id', getCustomerById);


// Update customer
router.put('/:id', updateCustomer);


// Delete customer
router.delete('/:id', deleteCustomer);


module.exports = router;