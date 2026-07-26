const express = require('express');
const {
  createSale,
  getSales,
  getSaleById
} = require('../controllers/salesController');

const router = express.Router();

router.get('/', getSales);
router.post('/', createSale);
router.get('/:id', getSaleById);

module.exports = router;