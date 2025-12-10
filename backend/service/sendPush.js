const admin = require("firebase-admin");

/**
 * Sends a push notification via FCM
 */
async function sendPush(fcmToken, title, body, orderId, extraData = {}) {
    if (!fcmToken) return;

    const stringData = { click_action: "FLUTTER_NOTIFICATION_CLICK", orderId: String(orderId) };

    Object.keys(extraData).forEach(key => {
        stringData[key] = String(extraData[key]);
    });

    const payload = { token: fcmToken, notification: { title, body }, data: stringData };

    try {
        await admin.messaging().send(payload);
    } catch (err) {
        console.error("FCM send error:", err);
    }
}

module.exports = { sendPush };
