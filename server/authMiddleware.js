// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1]; // Expecting 'Bearer token'

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }

    // Store user info in request for access in protected routes
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;

