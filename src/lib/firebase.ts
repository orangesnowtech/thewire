// Firebase configuration for Next.js with environment and emulator support
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { logEnvironmentInfo } from './environment';

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NEXT_PUBLIC_ENVIRONMENT === 'test';
const useEmulator = process.env.NEXT_PUBLIC_USE_EMULATOR === 'true';

// Production Firebase config
const productionConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Test Firebase config
const testConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_TEST_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_TEST_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_TEST_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_TEST_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_TEST_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_TEST_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_TEST_MEASUREMENT_ID
};

// Emulator config (uses your actual project ID)
const emulatorConfig = {
  apiKey: "demo-api-key",
  authDomain: "prop-wire-dev.firebaseapp.com",
  projectId: "prop-wire-dev", // Use your actual project ID for better emulator UI support
  storageBucket: "prop-wire-dev.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo",
  measurementId: "G-DEMO"
};

// Select configuration based on environment
let firebaseConfig;
if (useEmulator) {
  firebaseConfig = emulatorConfig;
  console.log('🔧 Using Firebase Emulators');
} else if (isTest) {
  firebaseConfig = testConfig;
} else {
  firebaseConfig = productionConfig;
}

// Log environment information
logEnvironmentInfo();

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Connect to emulators if in emulator mode
if (useEmulator && typeof window !== 'undefined') {
  // Only connect in browser environment and if not already connected
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (error) {
    console.log('Firestore emulator already connected');
  }
  
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
  } catch (error) {
    console.log('Auth emulator already connected');
  }
  
  try {
    connectStorageEmulator(storage, 'localhost', 9199);
  } catch (error) {
    console.log('Storage emulator already connected');
  }
}



export default app;
