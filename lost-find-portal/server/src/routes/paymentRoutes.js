import express from 'express';
import { protect } from '../middleware/auth.js';
import { createDemoPayment, isDemoStore } from '../utils/demoStore.js';

const router = express.Router();

const providers = [
  {
    id: 'bkash',
    name: 'bKash',
    type: 'mobile_financial_service',
    status: 'sandbox_ready',
    useCase: 'Reward transfer, verified return fee, service charge'
  },
  {
    id: 'nagad',
    name: 'Nagad',
    type: 'mobile_financial_service',
    status: 'sandbox_ready',
    useCase: 'Reward transfer, finder appreciation, optional platform fee'
  }
];

router.get('/providers', (_req, res) => {
  res.json({
    providers,
    note: 'This project includes a professional sandbox/mock payment API layer. Real bKash/Nagad checkout requires merchant credentials from the providers.'
  });
});

router.post('/create', protect, async (req, res, next) => {
  try {
    const { provider, amount, itemId } = req.body;
    if (!['bkash', 'nagad'].includes(provider)) {
      return res.status(400).json({ message: 'Provider must be bkash or nagad.' });
    }
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0.' });
    }

    let payment;
    if (isDemoStore()) {
      payment = await createDemoPayment({ itemId, provider, amount, userId: req.user._id || req.user.id });
    } else {
      payment = {
        _id: `sandbox-${Date.now()}`,
        transactionId: `LF-${provider.toUpperCase()}-${Date.now()}`,
        itemId: itemId || null,
        userId: req.user._id,
        provider,
        amount: Number(amount),
        currency: 'BDT',
        status: 'sandbox_created',
        createdAt: new Date().toISOString()
      };
    }

    res.status(201).json({
      payment,
      checkoutUrl: `${req.protocol}://${req.get('host')}/api/payments/sandbox/${payment.transactionId}`, 
      message: `${provider === 'bkash' ? 'bKash' : 'Nagad'} sandbox payment initialized successfully.`
    });
  } catch (error) {
    next(error);
  }
});

router.get('/sandbox/:transactionId', (req, res) => {
  res.type('html').send(`<!doctype html>
<html><head><title>Sandbox Payment</title><style>body{font-family:Arial,sans-serif;background:#f5f7fb;padding:40px}.card{max-width:520px;margin:auto;background:#fff;border-radius:18px;padding:28px;box-shadow:0 20px 45px rgba(0,0,0,.08)}.ok{color:#0f8a3b}</style></head>
<body><div class="card"><h1>Sandbox Payment</h1><p>Transaction ID:</p><h3>${req.params.transactionId}</h3><p class="ok">Payment simulation completed. Use real provider credentials for production checkout.</p></div></body></html>`);
});

export default router;
