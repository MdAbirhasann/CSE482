import crypto from 'crypto';
import bcrypt from 'bcryptjs';

let seeded = false;
let users = [];
let items = [];
let payments = [];

export const isDemoStore = () => globalThis.lostFindDemoMode === true || process.env.STORAGE_MODE === 'demo';

const id = () => crypto.randomBytes(12).toString('hex');

const now = () => new Date().toISOString();

const safeUser = (user) => ({
  _id: user._id,
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || '',
  role: user.role || 'user',
  createdAt: user.createdAt
});

const normalizeGeo = (geo = {}) => ({
  lat: geo.lat === '' || geo.lat === null || geo.lat === undefined ? null : Number(geo.lat),
  lng: geo.lng === '' || geo.lng === null || geo.lng === undefined ? null : Number(geo.lng)
});

const decorateItem = (item) => {
  const owner = users.find((user) => user._id === item.owner);
  return {
    ...item,
    owner: owner ? safeUser(owner) : { _id: item.owner, id: item.owner, name: 'Unknown User' },
    claims: (item.claims || []).map((claim) => {
      const claimant = users.find((user) => user._id === claim.user);
      return {
        ...claim,
        user: claimant ? safeUser(claimant) : { _id: claim.user, id: claim.user, name: 'Unknown User' }
      };
    })
  };
};

const makeItem = (payload) => ({
  _id: id(),
  title: payload.title,
  description: payload.description,
  itemType: payload.itemType,
  category: payload.category || 'Other',
  imageUrl: payload.imageUrl || '',
  city: payload.city,
  area: payload.area,
  locationText: payload.locationText,
  contactPhone: payload.contactPhone,
  dateHappened: payload.dateHappened || now(),
  reward: Number(payload.reward || 0),
  status: payload.status || 'open',
  geo: normalizeGeo(payload.geo),
  owner: payload.owner,
  claims: payload.claims || [],
  createdAt: now(),
  updatedAt: now()
});

export const ensureDemoSeeded = async () => {
  if (seeded) return;
  const demoUserId = id();
  const managerId = id();
  const finderId = id();

  users = [
    {
      _id: demoUserId,
      name: 'Demo Student',
      email: 'demo@student.com',
      password: await bcrypt.hash('password123', 12),
      phone: '+8801700000000',
      role: 'user',
      createdAt: now(),
      updatedAt: now()
    },
    {
      _id: managerId,
      name: 'Project Manager',
      email: 'manager@lostfind.com',
      password: await bcrypt.hash('manager123', 12),
      phone: '+8801711111111',
      role: 'manager',
      createdAt: now(),
      updatedAt: now()
    },
    {
      _id: finderId,
      name: 'Campus Finder',
      email: 'finder@student.com',
      password: await bcrypt.hash('password123', 12),
      phone: '+8801722222222',
      role: 'user',
      createdAt: now(),
      updatedAt: now()
    }
  ];

  items = [
    makeItem({
      title: 'Lost black wallet near campus gate',
      description: 'A black leather wallet containing student ID, debit card, and a few notes was lost near the main campus gate.',
      itemType: 'lost',
      category: 'Wallet',
      city: 'Dhaka',
      area: 'Dhanmondi',
      locationText: 'Main campus gate, Dhanmondi, Dhaka',
      contactPhone: '+8801700000000',
      reward: 500,
      geo: { lat: 23.7465, lng: 90.3763 },
      owner: demoUserId
    }),
    makeItem({
      title: 'Found student ID card',
      description: 'Found a university student ID card near the library stairs. The owner can verify name, department, and ID number.',
      itemType: 'found',
      category: 'ID Card',
      city: 'Dhaka',
      area: 'Dhanmondi',
      locationText: 'Central library stairs, Dhanmondi, Dhaka',
      contactPhone: '+8801722222222',
      geo: { lat: 23.7477, lng: 90.3778 },
      owner: finderId
    }),
    makeItem({
      title: 'Found laptop bag in cafeteria',
      description: 'A dark blue laptop bag was found in the cafeteria seating area. It contains a charger and notebook.',
      itemType: 'found',
      category: 'Bag',
      city: 'Dhaka',
      area: 'Campus Cafeteria',
      locationText: 'Cafeteria south table area',
      contactPhone: '+8801711111111',
      status: 'matched',
      geo: { lat: 23.7484, lng: 90.3785 },
      owner: managerId
    })
  ];

  seeded = true;
};

export const createDemoUser = async ({ name, email, password, phone, role = 'user' }) => {
  await ensureDemoSeeded();
  const normalizedEmail = email.toLowerCase();
  if (users.some((user) => user.email === normalizedEmail)) {
    const error = new Error('An account with this email already exists.');
    error.statusCode = 409;
    throw error;
  }

  const user = {
    _id: id(),
    name,
    email: normalizedEmail,
    password: await bcrypt.hash(password, 12),
    phone: phone || '',
    role,
    createdAt: now(),
    updatedAt: now()
  };
  users.push(user);
  return user;
};

export const findDemoUserByEmail = async (email) => {
  await ensureDemoSeeded();
  return users.find((user) => user.email === String(email).toLowerCase()) || null;
};

export const findDemoUserById = async (userId) => {
  await ensureDemoSeeded();
  return users.find((user) => user._id === String(userId)) || null;
};

export const compareDemoPassword = async (user, password) => bcrypt.compare(password, user.password);
export const toSafeDemoUser = safeUser;

const matchesFilters = (item, filters = {}) => {
  const search = String(filters.search || '').toLowerCase();
  if (search) {
    const haystack = `${item.title} ${item.description} ${item.city} ${item.area} ${item.locationText}`.toLowerCase();
    if (!haystack.includes(search)) return false;
  }
  if (filters.itemType && item.itemType !== filters.itemType) return false;
  if (filters.category && item.category !== filters.category) return false;
  if (filters.status && item.status !== filters.status) return false;
  if (filters.city && !item.city.toLowerCase().includes(String(filters.city).toLowerCase())) return false;
  return true;
};

export const listDemoItems = async (filters = {}, { page = 1, limit = 12 } = {}) => {
  await ensureDemoSeeded();
  const filtered = items
    .filter((item) => matchesFilters(item, filters))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const start = (page - 1) * limit;
  return {
    items: filtered.slice(start, start + limit).map(decorateItem),
    total: filtered.length,
    page,
    totalPages: Math.ceil(filtered.length / limit) || 1
  };
};

export const getDemoItemById = async (itemId) => {
  await ensureDemoSeeded();
  const item = items.find((entry) => entry._id === String(itemId));
  return item ? decorateItem(item) : null;
};

export const getDemoRawItemById = async (itemId) => {
  await ensureDemoSeeded();
  return items.find((entry) => entry._id === String(itemId)) || null;
};

export const getDemoUserItems = async (userId) => {
  await ensureDemoSeeded();
  return items
    .filter((item) => item.owner === String(userId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(decorateItem);
};

export const createDemoItem = async (payload) => {
  await ensureDemoSeeded();
  const item = makeItem(payload);
  items.push(item);
  return decorateItem(item);
};

export const findDemoPossibleMatches = async (createdItem) => {
  await ensureDemoSeeded();
  const oppositeType = createdItem.itemType === 'lost' ? 'found' : 'lost';
  return items
    .filter((item) => item._id !== createdItem._id)
    .filter((item) => item.itemType === oppositeType)
    .filter((item) => item.category === createdItem.category)
    .filter((item) => item.status === 'open')
    .filter((item) => item.city.toLowerCase().includes(createdItem.city.toLowerCase()))
    .slice(0, 6)
    .map(decorateItem);
};

export const updateDemoItem = async (itemId, payload) => {
  await ensureDemoSeeded();
  const item = items.find((entry) => entry._id === String(itemId));
  if (!item) return null;

  const allowed = ['title', 'description', 'itemType', 'category', 'imageUrl', 'city', 'area', 'locationText', 'contactPhone', 'dateHappened', 'reward', 'status'];
  allowed.forEach((field) => {
    if (payload[field] !== undefined) item[field] = field === 'reward' ? Number(payload[field] || 0) : payload[field];
  });
  if (payload.geo !== undefined) item.geo = normalizeGeo(payload.geo);
  item.updatedAt = now();
  return decorateItem(item);
};

export const deleteDemoItem = async (itemId) => {
  await ensureDemoSeeded();
  const before = items.length;
  items = items.filter((item) => item._id !== String(itemId));
  return items.length !== before;
};

export const addDemoClaim = async (itemId, { userId, message, contact }) => {
  await ensureDemoSeeded();
  const item = items.find((entry) => entry._id === String(itemId));
  if (!item) return null;
  const claim = {
    _id: id(),
    user: String(userId),
    message,
    contact,
    status: 'pending',
    createdAt: now(),
    updatedAt: now()
  };
  item.claims.push(claim);
  item.status = 'matched';
  item.updatedAt = now();
  return decorateItem(item);
};

export const getDemoOverview = async () => {
  await ensureDemoSeeded();
  const decoratedItems = items.map(decorateItem).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const allClaims = decoratedItems.flatMap((item) => (item.claims || []).map((claim) => ({ ...claim, itemTitle: item.title, itemId: item._id })));
  return {
    stats: {
      users: users.length,
      totalItems: items.length,
      lost: items.filter((item) => item.itemType === 'lost').length,
      found: items.filter((item) => item.itemType === 'found').length,
      open: items.filter((item) => item.status === 'open').length,
      matched: items.filter((item) => item.status === 'matched').length,
      closed: items.filter((item) => item.status === 'closed').length,
      claims: allClaims.length
    },
    users: users.map(safeUser),
    items: decoratedItems,
    claims: allClaims
  };
};

export const createDemoPayment = async ({ itemId, provider, amount, userId }) => {
  await ensureDemoSeeded();
  const payment = {
    _id: id(),
    transactionId: `LF-${provider.toUpperCase()}-${Date.now()}`,
    itemId: itemId || null,
    userId,
    provider,
    amount: Number(amount || 0),
    currency: 'BDT',
    status: 'sandbox_created',
    createdAt: now()
  };
  payments.push(payment);
  return payment;
};

export const listDemoPayments = async () => {
  await ensureDemoSeeded();
  return payments;
};
