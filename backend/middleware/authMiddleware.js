const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supermarket-secret';

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const headerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
  const token = headerMatch ? headerMatch[1].trim() : '';

  if (!token) {
    return res.status(401).json({ message: 'Access token is required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };
    next();
  } catch (error) {
    console.error('JWT Error:', error.message);
    return res.status(403).json({ message: 'Invalid or expired token', details: error.message });
  }
};

exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!allowedRoles.flat().includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to access this resource' });
    }

    next();
  };
};
