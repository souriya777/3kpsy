/**
 * firebase configuration and initialization
 * @module stores/firebase
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase project configuration
// Get this from Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_AUTH_DOMAIN',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '3kpsy',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'YOUR_STORAGE_BUCKET',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_MESSAGING_SENDER_ID',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'YOUR_APP_ID'
};

// initialize firebase
const app = initializeApp(firebaseConfig);

// initialize auth with google provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// initialize firestore with offline persistence (new API)
export const db = getFirestore(app);

// note: offline persistence is enabled by default in modern Firebase
// no need for enableIndexedDbPersistence() anymore

export default app;
