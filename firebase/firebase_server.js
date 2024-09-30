// lib/firebaseAdmin.js
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Path to your service account key
const serviceAccount = require('../secrets/serviceAccountKey.json');

// Initialize Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount),
});

// Initialize Firestore and Auth
const db = getFirestore();
const auth = getAuth();

export { db, auth };
