import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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

// Analytics
let analytics;
if (typeof window !== "undefined" && process.env.NODE_ENV !== "test") {
  analytics = getAnalytics(app);
}

// Auth
const auth = getAuth(app);
auth.useDeviceLanguage();

// Messaging
let messaging;
if (typeof window !== "undefined") {
  messaging = getMessaging(app);
}

export {
  app,
  analytics,
  logEvent,
  auth,
  messaging,
  getToken,
  onMessage,
  RecaptchaVerifier,
  signInWithPhoneNumber
};
