import express from 'express';
import Item from '../models/Item.js';
import User from '../models/User.js';
import { managerOnly, protect } from '../middleware/auth.js';
import { deleteDemoItem, getDemoOverview, getDemoRawItemById, isDemoStore, updateDemoItem } from '../utils/demoStore.js';

const router = express.Router();

router.use(protect, managerOnly);

router.get('/overview', async (_req, res, next) => {
  try {
    if (isDemoStore()) {
      const overview = await getDemoOverview();
      return res.json(overview);
    }

    const [users, items] = await Promise.all([
      User.find().select('name email phone role createdAt').sort({ createdAt: -1 }).limit(50),
      Item.find()
        .populate('owner', 'name email phone role')
        .populate('claims.user', 'name email phone role')
        .sort({ createdAt: -1 })
        .limit(100)
    ]);

    const claims = items.flatMap((item) =>
      (item.claims || []).map((claim) => ({
        ...claim.toObject(),
        itemTitle: item.title,
        itemId: item._id
      }))
    );

    res.json({
      stats: {
        users: users.length,
        totalItems: items.length,
        lost: items.filter((item) => item.itemType === 'lost').length,
        found: items.filter((item) => item.itemType === 'found').length,
        open: items.filter((item) => item.status === 'open').length,
        matched: items.filter((item) => item.status === 'matched').length,
        closed: items.filter((item) => item.status === 'closed').length,
        claims: claims.length
      },
      users,
      items,
      claims
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/items/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['open', 'matched', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    if (isDemoStore()) {
      const item = await getDemoRawItemById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Item not found.' });
      const updated = await updateDemoItem(req.params.id, { status });
      req.io?.emit('item:updated', updated);
      return res.json({ item: updated, message: `Item status changed to ${status}.` });
    }

    const item = await Item.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('owner', 'name email phone role');
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    req.io?.emit('item:updated', item);
    res.json({ item, message: `Item status changed to ${status}.` });
  } catch (error) {
    next(error);
  }
});

router.delete('/items/:id', async (req, res, next) => {
  try {
    if (isDemoStore()) {
      const deleted = await deleteDemoItem(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Item not found.' });
      req.io?.emit('item:deleted', { id: req.params.id });
      return res.json({ message: 'Manager deleted the item.' });
    }

    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    await item.deleteOne();
    req.io?.emit('item:deleted', { id: req.params.id });
    res.json({ message: 'Manager deleted the item.' });
  } catch (error) {
    next(error);
  }
});

export default router;
