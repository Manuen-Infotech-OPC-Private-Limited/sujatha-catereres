// const twilio = require('twilio');

// const accountSid = process.env.TWILIO_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const verifyServiceSid = process.env.TWILIO_VERIFY_SID;

// const client = twilio(accountSid, authToken);

// /**
//  * Send OTP to a phone number via SMS using Twilio Verify.
//  * @param {string} phone - The recipient's phone number in E.164 format (e.g. +919876543210)
//  */
// const sendOTP = async (phone) => {
//   return await client.verify.v2.services(verifyServiceSid)
//     .verifications
//     .create({ to: phone, channel: 'sms' });
// };

// /**
//  * Verify the OTP code for a phone number using Twilio Verify.
//  * @param {string} phone - The phone number used to receive the OTP.
//  * @param {string} code - The OTP code entered by the user.
//  */
// const verifyOTP = async (phone, code) => {
//   return await client.verify.v2.services(verifyServiceSid)
//     .verificationChecks
//     .create({ to: phone, code });
// };

// module.exports = { sendOTP, verifyOTP };
