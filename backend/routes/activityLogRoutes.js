const express = require('express');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const { getActivityLogs, getActivityLogById } = require('../controllers/activityLogController');

const router = express.Router();

router.get('/', verifyToken, authorizeRoles(['manager', 'admin']), getActivityLogs);
router.get('/:id', verifyToken, authorizeRoles(['manager', 'admin']), getActivityLogById);

module.exports = router;
