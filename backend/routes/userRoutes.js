const express = require('express');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const { createUser, resetPassword, deleteUser, getUsers, getUserById } = require('../controllers/userController');

const router = express.Router();

router.get('/', verifyToken, authorizeRoles(['manager', 'admin']), getUsers);
router.get('/:id', verifyToken, authorizeRoles(['manager', 'admin']), getUserById);
router.post('/', verifyToken, authorizeRoles(['manager', 'admin']), createUser);
router.put('/:id/reset-password', verifyToken, authorizeRoles(['manager', 'admin']), resetPassword);
router.delete('/:id', verifyToken, authorizeRoles(['admin']), deleteUser);

module.exports = router;
