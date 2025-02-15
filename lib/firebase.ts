import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAFhPa7ftQttJN5IT37pp-0BStXJ1KwVww",
  authDomain: "peerify-da38d.firebaseapp.com",
  projectId: "peerify-da38d",
  storageBucket: "peerify-da38d.appspot.com",
  messagingSenderId: "501485111029",
  appId: "1:501485111029:web:81ea0a0ca74bcc5af467bc"
};

// Make sure we only initialize once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize auth with the app instance
const auth = getAuth(app);
const db = getFirestore(app);

// Add some debug logging
if (process.env.NODE_ENV !== 'production') {
  console.log('Firebase initialized with config:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain
  });
}

export { app, auth, db };