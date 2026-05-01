import { buildUpiString } from '../utils/upi.js';
import { db, auth } from '../index.js';

const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

const json = (res, status, payload) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': CORS_ORIGIN,
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  });
  res.end(JSON.stringify(payload));
};

export const handleOrderRoute = async (req, res, body) => {
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': CORS_ORIGIN,
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    });
    res.end();
    return true;
  }

  const url = req.url;
  const method = req.method;

  // Health check
  if (url === '/api/health' && method === 'GET') {
    json(res, 200, { success: true, service: 'cravella-server', timestamp: new Date().toISOString() });
    return true;
  }

  // UPI link generator
  if (url === '/api/order/upi-link' && method === 'POST') {
    const payload = JSON.parse(body || '{}');
    const upiUrl = buildUpiString({
      upiId: payload.upiId || process.env.UPI_ID,
      upiName: payload.upiName || process.env.UPI_NAME,
      amount: payload.amount || 0,
      note: payload.note || 'CravellaCookies Order',
    });
    json(res, 200, { success: true, upiUrl, amount: Number(payload.amount || 0) });
    return true;
  }

  // Set admin custom claim — run this ONCE to make your user an admin
  if (url === '/api/admin/set-claim' && method === 'POST') {
    const payload = JSON.parse(body || '{}');
    const { uid, secret } = payload;
    // Simple secret guard — add ADMIN_SECRET to your .env
    if (secret !== process.env.ADMIN_SECRET) {
      json(res, 403, { success: false, message: 'Forbidden' });
      return true;
    }
    await auth.setCustomUserClaims(uid, { admin: true });
    json(res, 200, { success: true, message: `User ${uid} is now an admin` });
    return true;
  }

  // Get all orders (server-side, bypasses Firestore rules)
  if (url === '/api/orders' && method === 'GET') {
    const snap = await db.collection('orders').orderBy('placedAt', 'desc').get();
    const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    json(res, 200, { success: true, orders });
    return true;
  }

  return false;
};