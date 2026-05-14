import express from 'express';
import mongoose from 'mongoose';
import Item from '../models/Item.js';
import { protect } from '../middleware/auth.js';
import {
  addDemoClaim,
  createDemoItem,
  deleteDemoItem,
  findDemoPossibleMatches,
  getDemoItemById,
  getDemoRawItemById,
  getDemoUserItems,
  isDemoStore,
  listDemoItems,
  updateDemoItem
} from '../utils/demoStore.js';

const router = express.Router();

const validCategories = ['Documents', 'Electronics', 'Wallet', 'Bag', 'Keys', 'ID Card', 'Pet', 'Other'];
const managerRoles = ['manager', 'admin'];

const buildQuery = (req) => {
  const { search, itemType, category, city, status } = req.query;
  const query = {};

  if (search) query.$text = { $search: search };
  if (itemType && ['lost', 'found'].includes(itemType)) query.itemType = itemType;
  if (category && validCategories.includes(category)) query.category = category;
  if (city) query.city = new RegExp(city, 'i');
  if (status && ['open', 'matched', 'closed'].includes(status)) query.status = status;

  return query;
};

const isOwner = (item, userId) => {
  const ownerId = item.owner?._id?.toString?.() || item.owner?.id?.toString?.() || item.owner?.toString?.() || item.owner;
  return ownerId === userId?.toString?.();
};

const canManageItem = (item, user) => isOwner(item, user._id || user.id) || managerRoles.includes(user.role);

const normalizePayload = (body, ownerId) => ({
  ...body,
  owner: ownerId,
  reward: Number(body.reward || 0),
  geo: {
    lat: body.geo?.lat === '' || body.geo?.lat === null || body.geo?.lat === undefined ? null : Number(body.geo?.lat),
    lng: body.geo?.lng === '' || body.geo?.lng === null || body.geo?.lng === undefined ? null : Number(body.geo?.lng)
  }
});

router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 12), 1), 50);

    if (isDemoStore()) {
      const result = await listDemoItems(req.query, { page, limit });
      return res.json(result);
    }

    const skip = (page - 1) * limit;
    const query = buildQuery(req);

    const [items, total] = await Promise.all([
      Item.find(query)
        .populate('owner', 'name email phone role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Item.countDocuments(query)
    ]);

    res.json({
      items,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      total
    });
  } catch (error) {
    next(error);
  }
});

router.get('/user/mine', protect, async (req, res, next) => {
  try {
    if (isDemoStore()) {
      const items = await getDemoUserItems(req.user._id || req.user.id);
      return res.json({ items });
    }

    const items = await Item.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ items });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (isDemoStore()) {
      const item = await getDemoItemById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Item not found.' });
      return res.json({ item });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    const item = await Item.findById(req.params.id)
      .populate('owner', 'name email phone role')
      .populate('claims.user', 'name email phone role');

    if (!item) return res.status(404).json({ message: 'Item not found.' });

    res.json({ item });
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const payload = normalizePayload(req.body, req.user._id || req.user.id);

    if (isDemoStore()) {
      const item = await createDemoItem(payload);
      const possibleMatches = await findDemoPossibleMatches(item);
      req.io?.emit('item:created', item);
      return res.status(201).json({ item, possibleMatches });
    }

    const item = await Item.create(payload);
    const populatedItem = await item.populate('owner', 'name email phone role');

    const oppositeType = populatedItem.itemType === 'lost' ? 'found' : 'lost';
    const matches = await Item.find({
      _id: { $ne: populatedItem._id },
      itemType: oppositeType,
      category: populatedItem.category,
      city: new RegExp(populatedItem.city, 'i'),
      status: 'open'
    })
      .populate('owner', 'name email phone role')
      .sort({ createdAt: -1 })
      .limit(6);

    req.io?.emit('item:created', populatedItem);

    res.status(201).json({ item: populatedItem, possibleMatches: matches });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', protect, async (req, res, next) => {
  try {
    if (isDemoStore()) {
      const raw = await getDemoRawItemById(req.params.id);
      if (!raw) return res.status(404).json({ message: 'Item not found.' });
      if (!canManageItem(raw, req.user)) {
        return res.status(403).json({ message: 'You can update only your own post.' });
      }
      const item = await updateDemoItem(req.params.id, req.body);
      req.io?.emit('item:updated', item);
      return res.json({ item });
    }

    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found.' });

    if (!canManageItem(item, req.user)) {
      return res.status(403).json({ message: 'You can update only your own post.' });
    }

    const allowedFields = [
      'title',
      'description',
      'itemType',
      'category',
      'imageUrl',
      'city',
      'area',
      'locationText',
      'contactPhone',
      'dateHappened',
      'reward',
      'status',
      'geo'
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) item[field] = req.body[field];
    });

    if (req.body.reward !== undefined) item.reward = Number(req.body.reward || 0);
    if (req.body.geo) {
      item.geo = {
        lat: req.body.geo.lat === '' || req.body.geo.lat === null ? null : Number(req.body.geo.lat),
        lng: req.body.geo.lng === '' || req.body.geo.lng === null ? null : Number(req.body.geo.lng)
      };
    }

    await item.save();
    const updated = await item.populate('owner', 'name email phone role');
    req.io?.emit('item:updated', updated);

    res.json({ item: updated });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, async (req, res, next) => {
  try {
    if (isDemoStore()) {
      const raw = await getDemoRawItemById(req.params.id);
      if (!raw) return res.status(404).json({ message: 'Item not found.' });
      if (!canManageItem(raw, req.user)) {
        return res.status(403).json({ message: 'You can delete only your own post.' });
      }
      await deleteDemoItem(req.params.id);
      req.io?.emit('item:deleted', { id: req.params.id });
      return res.json({ message: 'Item deleted successfully.' });
    }

    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found.' });

    if (!canManageItem(item, req.user)) {
      return res.status(403).json({ message: 'You can delete only your own post.' });
    }

    await item.deleteOne();
    req.io?.emit('item:deleted', { id: req.params.id });

    res.json({ message: 'Item deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/claim', protect, async (req, res, next) => {
  try {
    const { message, contact } = req.body;
    if (!message || !contact) {
      return res.status(400).json({ message: 'Claim message and contact are required.' });
    }

    if (isDemoStore()) {
      const raw = await getDemoRawItemById(req.params.id);
      if (!raw) return res.status(404).json({ message: 'Item not found.' });
      if (isOwner(raw, req.user._id || req.user.id)) {
        return res.status(400).json({ message: 'You cannot claim your own post.' });
      }
      const updatedItem = await addDemoClaim(req.params.id, { userId: req.user._id || req.user.id, message, contact });
      req.io?.to(raw.owner).emit('claim:received', {
        itemId: raw._id,
        title: raw.title,
        claimant: req.user.toSafeJSON(),
        message,
        contact
      });
      req.io?.emit('item:updated', updatedItem);
      return res.status(201).json({ item: updatedItem, message: 'Claim request submitted.' });
    }

    const item = await Item.findById(req.params.id).populate('owner', 'name email phone role');
    if (!item) return res.status(404).json({ message: 'Item not found.' });

    if (isOwner(item, req.user._id)) {
      return res.status(400).json({ message: 'You cannot claim your own post.' });
    }

    item.claims.push({ user: req.user._id, message, contact });
    item.status = 'matched';
    await item.save();

    const updatedItem = await Item.findById(item._id)
      .populate('owner', 'name email phone role')
      .populate('claims.user', 'name email phone role');

    req.io?.to(item.owner._id.toString()).emit('claim:received', {
      itemId: item._id,
      title: item.title,
      claimant: req.user.toSafeJSON(),
      message,
      contact
    });
    req.io?.emit('item:updated', updatedItem);

    res.status(201).json({ item: updatedItem, message: 'Claim request submitted.' });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/resolve', protect, async (req, res, next) => {
  try {
    if (isDemoStore()) {
      const raw = await getDemoRawItemById(req.params.id);
      if (!raw) return res.status(404).json({ message: 'Item not found.' });
      if (!canManageItem(raw, req.user)) {
        return res.status(403).json({ message: 'You can resolve only your own post.' });
      }
      const item = await updateDemoItem(req.params.id, { status: 'closed' });
      req.io?.emit('item:updated', item);
      return res.json({ item, message: 'Item marked as resolved.' });
    }

    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found.' });

    if (!canManageItem(item, req.user)) {
      return res.status(403).json({ message: 'You can resolve only your own post.' });
    }

    item.status = 'closed';
    await item.save();

    const updated = await item.populate('owner', 'name email phone role');
    req.io?.emit('item:updated', updated);

    res.json({ item: updated, message: 'Item marked as resolved.' });
  } catch (error) {
    next(error);
  }
});

export default router;
