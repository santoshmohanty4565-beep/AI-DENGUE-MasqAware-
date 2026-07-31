/**
 * MosqAware — Official Firebase Web SDK & Authentication Configuration
 * Project ID: mosqaware
 */

const firebaseConfig = {
  apiKey: "AIzaSyAbR53ctukUphiQL6NYhEN6_6WHOrbOilA",
  authDomain: "mosqaware.firebaseapp.com",
  projectId: "mosqaware",
  storageBucket: "mosqaware.firebasestorage.app",
  messagingSenderId: "437869104963",
  appId: "1:437869104963:web:08c851e48ffabb194c69f6"
};

// Initialize Firebase App
let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;

if (typeof firebase !== 'undefined') {
  try {
    if (!firebase.apps || !firebase.apps.length) {
      firebaseApp = firebase.initializeApp(firebaseConfig);
    } else {
      firebaseApp = firebase.app();
    }
    if (firebase.auth) firebaseAuth = firebase.auth();
    if (firebase.firestore) firebaseDb = firebase.firestore();
    console.log("🔥 MosqAware Firebase initialized successfully:", firebaseConfig.projectId);
  } catch (err) {
    console.warn("Firebase initialization warning:", err);
  }
}

// Global Firebase Helpers
window.MOSQAWARE_FIREBASE = {
  config: firebaseConfig,
  app: firebaseApp,
  auth: firebaseAuth,
  db: firebaseDb
};
