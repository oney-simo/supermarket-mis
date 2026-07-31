const Settings = require('../models/settings');

const buildSettingsPayload = (payload = {}) => ({
  businessName: 'Default Business',
  phone: 'Not set',
  address: 'Not set',
  email: '',
  logo: '',
  receiptHeader: '',
  receiptFooter: '',
  currencySymbol: 'TZS',
  taxRate: 0,
  lowStockThreshold: 5,
  allowNegativeStock: false,
  enableDiscount: true,
  maxDiscountPercent: 100,
  sessionTimeoutMinutes: 60,
  requireAdminForVoid: true,
  autoBackupFrequency: 'disabled',
  enableEmailAlerts: false,
  notificationEmail: '',
  logRetentionDays: 30,
  theme: 'light',
  ...payload
});

// @desc    Get system settings
// @route   GET /api/settings
// @access  Private
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(buildSettingsPayload());
    }

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update system settings
// @route   PUT /api/settings
// @access  Private / Admin
const updateSettings = async (req, res) => {
  try {
    const payload = buildSettingsPayload(req.body);
    const existingSettings = await Settings.findOne();

    const updatedSettings = existingSettings
      ? await Settings.findByIdAndUpdate(
          existingSettings._id,
          { $set: payload },
          { new: true, runValidators: true }
        )
      : await Settings.create(payload);

    res.status(200).json({
      message: 'Settings updated successfully',
      settings: updatedSettings
    });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update settings', error: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};