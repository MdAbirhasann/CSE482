import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import xss from 'xss';

const csrfSecret = () => process.env.CSRF_SECRET || 'development-csrf-secret-change-me';

export const createCsrfToken = () => {
  const nonce = crypto.randomBytes(24).toString('hex');
  const signature = crypto.createHmac('sha256', csrfSecret()).update(nonce).digest('hex');
  return `${nonce}.${signature}`;
};

const isValidCsrfToken = (token) => {
  if (!token || typeof token !== 'string' || !token.includes('.')) return false;
  const [nonce, signature] = token.split('.');
  if (!nonce || !signature) return false;
  const expected = crypto.createHmac('sha256', csrfSecret()).update(nonce).digest('hex');
  if (signature.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
};

export const verifyCsrf = (req, res, next) => {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) return next();

  const token = req.header('x-csrf-token');
  if (!isValidCsrfToken(token)) {
    return res.status(403).json({ message: 'CSRF token verification failed.' });
  }

  next();
};

const sanitizeValue = (value) => {
  if (typeof value === 'string') return xss(value.trim());
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === 'object') {
    const cleaned = {};
    Object.entries(value).forEach(([key, val]) => {
      const safeKey = key.replace(/[$.]/g, '');
      if (safeKey) cleaned[safeKey] = sanitizeValue(val);
    });
    return cleaned;
  }
  return value;
};

export const sanitizeBody = (req, _res, next) => {
  if (req.body) req.body = sanitizeValue(req.body);
  next();
};

export const securityMiddleware = (app) => {
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
    })
  );
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
      message: { message: 'Too many requests. Please try again later.' }
    })
  );
  app.use(hpp());
};
