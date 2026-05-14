import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import { verifyToken } from './utils/jwt.js';
import { securityMiddleware, sanitizeBody, verifyCsrf } from './middleware/security.js';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import managerRoutes from './routes/managerRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import securityRoutes from './routes/securityRoutes.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

securityMiddleware(app);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeBody);

app.use((req, _res, next) => {
  req.io = io;
  next();
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (token) {
      const decoded = verifyToken(token);
      socket.user = decoded;
    }
    next();
  } catch (_error) {
    next();
  }
});

io.on('connection', (socket) => {
  if (socket.user?.id) {
    socket.join(socket.user.id);
  }

  socket.emit('connected', {
    message: 'Connected to Lost & Find real-time server.',
    socketId: socket.id
  });
});

app.get('/', (_req, res) => {
  res.json({
    status: 'success',
    message: 'Lost & Find Portal API is running.',
    storageMode: globalThis.lostFindDemoMode ? 'demo' : 'mongodb',
    modules: ['auth', 'items', 'manager', 'payments', 'live-location']
  });
});

app.use('/api/security', securityRoutes);
app.use(verifyCsrf);
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/payments', paymentRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  console.error(error);

  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({ message: messages.join(' ') });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: 'Duplicate value found.' });
  }

  res.status(error.statusCode || 500).json({
    message: error.message || 'Server error. Please try again.'
  });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  });
