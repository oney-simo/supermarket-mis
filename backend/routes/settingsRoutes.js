const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');

// Import your existing auth and role middlewares
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// Route: GET /api/settings and PUT /api/settings
router.route('/')
  .get(verifyToken, getSettings)
  .put(verifyToken, authorizeRoles('admin'), updateSettings);

module.exports = router;