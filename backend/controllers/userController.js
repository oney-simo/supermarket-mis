const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { logActivity } = require('../services/activityLogger');

const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

exports.createUser = async (req, res) => {
  try {
    const { username, password, role, fullName } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      role: role || 'cashier',
      fullName
    });

    await logActivity({
      req,
      user: { userId: req.user?.userId },
      action: 'create',
      module: 'Users',
      description: `Created user ${username}`,
      referenceId: user._id.toString(),
      referenceModel: 'User'
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      fullName: user.fullName,
      isActive: user.isActive
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (!newPassword) {
      return res.status(400).json({ message: 'newPassword is required' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await logActivity({
      req,
      user: { userId: req.user?.userId },
      action: 'reset_password',
      module: 'Users',
      description: `Reset password for user ${user.username}`,
      referenceId: user._id.toString(),
      referenceModel: 'User'
    });

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await logActivity({
      req,
      user: { userId: req.user?.userId },
      action: 'delete',
      module: 'Users',
      description: `Deleted user ${user.username}`,
      referenceId: user._id.toString(),
      referenceModel: 'User'
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(id, '-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
