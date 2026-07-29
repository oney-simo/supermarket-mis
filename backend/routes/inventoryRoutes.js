const express = require('express');

const {
    getInventory,
    getInventoryByProduct,
    getExpiringProducts,
    createInventory
} = require('../controllers/inventoryController');


const router = express.Router();


// Get all inventory
router.get('/', getInventory);


// Get inventory by product
router.get('/product/:productId', getInventoryByProduct);


// Get expiring products
router.get('/expiry', getExpiringProducts);

// Create inventory batch
router.post('/', createInventory);


module.exports = router;