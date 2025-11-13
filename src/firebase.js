// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// Only initialize Analytics in browser (not SSR or Node)
let analytics;
if (typeof window !== "undefined" && process.env.NODE_ENV !== "test") {
  analytics = getAnalytics(app);
}

const auth = getAuth(app);
auth.useDeviceLanguage();

export { app, analytics, logEvent, auth, RecaptchaVerifier, signInWithPhoneNumber };
