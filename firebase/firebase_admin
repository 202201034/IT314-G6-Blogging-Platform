// firebase_admin.js
import admin from 'firebase-admin';

const serviceAccount = require('../secret/it314_servicekey.json'); // Update the path to your service account key

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://it314-blogme-default-rtdb.firebaseio.com'
  });
}

const auth = admin.auth();
const db = admin.firestore();

export { auth, db };
