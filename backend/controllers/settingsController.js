const Settings = require('../models/settings');

// @desc    Get system settings
// @route   GET /api/settings
// @access  Private
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // If no settings document exists yet, create default settings
    if (!settings) {
      settings = await Settings.create({});
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
    const updatedSettings = await Settings.findOneAndUpdate(
      {}, // empty filter matches the single document
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );

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