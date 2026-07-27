const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { logActivity } = require('../services/activityLogger');

const JWT_SECRET = process.env.JWT_SECRET || 'supermarket-secret';

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    await logActivity({
      req,
      user: { userId: user._id, role: user.role },
      action: 'login',
      module: 'Authentication',
      description: `${user.username} logged in successfully`,
      referenceId: user._id.toString(),
      referenceModel: 'User'
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    await logActivity({
      req,
      user: { userId: req.user?.userId },
      action: 'logout',
      module: 'Authentication',
      description: 'User logged out successfully',
      referenceId: req.user?.userId?.toString() || null,
      referenceModel: 'User'
    });

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
