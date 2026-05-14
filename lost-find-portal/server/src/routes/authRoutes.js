import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { signToken } from '../utils/jwt.js';
import { compareDemoPassword, createDemoUser, findDemoUserByEmail, isDemoStore, toSafeDemoUser } from '../utils/demoStore.js';

const router = express.Router();

const managerCode = () => process.env.MANAGER_ACCESS_CODE || 'manager123';

const resolveRequestedRole = (body) => {
  if (body.role === 'manager' && body.managerCode === managerCode()) return 'manager';
  return 'user';
};

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const role = resolveRequestedRole(req.body);

    if (isDemoStore()) {
      const user = await createDemoUser({ name, email, password, phone, role });
      const token = signToken(user);
      return res.status(201).json({ token, user: toSafeDemoUser(user) });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({ name, email, password, phone, role });
    const token = signToken(user);

    res.status(201).json({ token, user: user.toSafeJSON() });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (isDemoStore()) {
      const user = await findDemoUserByEmail(email);
      if (!user || !(await compareDemoPassword(user, password))) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
      const token = signToken(user);
      return res.json({ token, user: toSafeDemoUser(user) });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user);
    res.json({ token, user: user.toSafeJSON() });
  } catch (error) {
    next(error);
  }
});

router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
});

export default router;
