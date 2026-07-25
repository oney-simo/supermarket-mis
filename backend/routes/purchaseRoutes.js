const express = require('express');

const {
    createPurchase,
    getPurchases,
    getPurchaseById,
    deletePurchase
} = require('../controllers/purchaseController');


const router = express.Router();


// Create purchase
router.post('/', createPurchase);


// Get all purchases
router.get('/', getPurchases);


// Get single purchase
router.get('/:id', getPurchaseById);


// Delete purchase
router.delete('/:id', deletePurchase);


module.exports = router;