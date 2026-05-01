import 'dotenv/config';
import http from 'node:http';
import admin from 'firebase-admin';
import { handleOrderRoute } from './routes/order.js';

// Initialize Firebase Admin entirely from .env — no JSON file needed
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      // .env stores \n as literal \\n — this converts them back
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    }),
  });
}

export const db = admin.firestore();
export const auth = admin.auth();

const port = process.env.PORT || 5000;

const server = http.createServer(async (request, response) => {
  const chunks = [];
  request.on('data', (chunk) => chunks.push(chunk));
  request.on('end', async () => {
    try {
      const body = Buffer.concat(chunks).toString();
      const handled = await handleOrderRoute(request, response, body);
      if (!handled) {
        response.writeHead(404, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ success: false, message: 'Route not found' }));
      }
    } catch (error) {
      response.writeHead(500, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ success: false, message: error.message }));
    }
  });
});

server.listen(port, () => {
  console.log(`Cravella server running on http://localhost:${port}`);
});