const express = require('express');

const {receiveStock, getReceiving, getReceivingById, } = require('../controllers/stockReceivingController');
const router = express.Router();


// Receive stock
router.post('/', receiveStock);


// Get all receiving records
router.get('/', getReceiving);


// Get single receiving record
router.get('/:id', getReceivingById);


module.exports = router;