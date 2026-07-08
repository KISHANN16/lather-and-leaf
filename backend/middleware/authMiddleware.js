import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { fallbackDB } from '../config/fallbackDb.js';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const JWT_SECRET = process.env.JWT_SECRET || 'latherleafsecretkey12345';
      const decoded = jwt.verify(token, JWT_SECRET);

      // Robust check: if MongoDB connection is not active, use JSON DB
      if (global.isUsingFallback || mongoose.connection.readyState !== 1) {
        req.user = fallbackDB.users.findById(decoded.id);
      } else if (mongoose.Types.ObjectId.isValid(decoded.id)) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        req.user = null;
      }

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

export { protect, admin };
