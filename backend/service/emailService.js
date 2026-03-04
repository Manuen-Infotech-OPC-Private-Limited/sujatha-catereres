const nodemailer = require('nodemailer');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ ERROR: Email credentials missing in .env file!");
}
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Send an email to a user when their testing registration is approved.
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name
 */
const sendApprovalEmail = async (to, name) => {
    const mailOptions = {
        from: `"Sujatha Caterers" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Welcome to Sujatha Caterers Closed Testing!',
        html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #dc2626;">Hello ${name},</h2>
        <p>Congratulations! Your request to join the <strong>Sujatha Caterers</strong> closed testing phase has been <strong>approved</strong>.</p>
        <p>You can now access the app through the following links:</p>
        
        <div style="margin: 20px 0;">
          <a href="https://play.google.com/store/apps/details?id=com.manuen.sujatha_caterers" 
             style="background-color: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;">
             Join on Android
          </a>
          <a href="https://play.google.com/apps/testing/com.manuen.sujatha_caterers" 
             style="background-color: #facc15; color: #854d0e; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
             Join on Web
          </a>
        </div>
        
        <p>Thank you for helping us improve our services. Your feedback is invaluable!</p>
        <p>Best regards,<br/>The Sujatha Caterers Team</p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Approval email sent to ${to}`);
    } catch (error) {
        console.error('Error sending approval email:', error);
        throw error;
    }
};

module.exports = { sendApprovalEmail };
