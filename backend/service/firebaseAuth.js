const admin = require("firebase-admin");
const fs = require("fs");

if (!admin.apps.length) {
  try {
    let serviceAccount;

    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH) {
      const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;
      serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } else {
      throw new Error("Firebase service account key not provided");
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });

    console.log("✅ Firebase Admin initialized (Auth + Storage)");
  } catch (err) {
    console.error("❌ Failed to initialize Firebase Admin:", err);
  }
}

const bucket = admin.storage().bucket();

/**
 * Verifies a Firebase ID token
 */
const verifyFirebaseToken = async (idToken) => {
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    return decoded;
  } catch (err) {
    console.error("Invalid Firebase token:", err);
    throw new Error("Unauthorized");
  }
};

module.exports = {
  verifyFirebaseToken,
  bucket,       // ⭐ now exporting bucket
  admin
};
