import express from 'express';
import { createCsrfToken } from '../middleware/security.js';

const router = express.Router();

router.get('/csrf-token', (_req, res) => {
  res.json({ csrfToken: createCsrfToken() });
});

export default router;
