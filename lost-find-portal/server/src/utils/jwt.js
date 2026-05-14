import jwt from 'jsonwebtoken';

const jwtSecret = () => process.env.JWT_SECRET || 'development-jwt-secret-change-before-deployment';

export const signToken = (user) => {
  const id = user._id?.toString?.() || user.id?.toString?.() || String(user._id || user.id);
  return jwt.sign(
    { id, role: user.role || 'user' },
    jwtSecret(),
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token) => jwt.verify(token, jwtSecret());
