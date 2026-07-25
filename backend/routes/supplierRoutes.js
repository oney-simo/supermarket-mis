const express = require('express');

const {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController');


const router = express.Router();


router.get('/', getSuppliers);

router.post('/', createSupplier);

router.get('/:id', getSupplierById);

router.put('/:id', updateSupplier);

router.delete('/:id', deleteSupplier);


module.exports = router;