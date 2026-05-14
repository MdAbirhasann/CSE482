import User from '../models/User.js';
import { verifyToken } from '../utils/jwt.js';
import { findDemoUserById, isDemoStore, toSafeDemoUser } from '../utils/demoStore.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const decoded = verifyToken(token);

    if (isDemoStore()) {
      const user = await findDemoUserById(decoded.id);
      if (!user) return res.status(401).json({ message: 'User no longer exists.' });
      req.user = {
        ...user,
        id: user._id,
        toSafeJSON: () => toSafeDemoUser(user)
      };
      return next();
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }

    req.user = user;
    next();
  } catch (_error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export const managerOnly = (req, res, next) => {
  if (!['manager', 'admin'].includes(req.user?.role)) {
    return res.status(403).json({ message: 'Manager permission required.' });
  }
  next();
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin permission required.' });
  }
  next();
};
