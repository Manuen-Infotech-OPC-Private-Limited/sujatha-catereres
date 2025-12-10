// utils/friendlyMessages.js
const statusMessages = {
  pending: [
    "We've received your order! 🍴 Hang tight, we'll start preparing it soon.",
    "Your order is in the queue! 🕒 Get ready for some deliciousness."
  ],
  confirmed: [
    "Yay! Your order is confirmed. 🎉 We're getting things ready.",
    "Your feast is confirmed! 🍽️ Sit back while we cook it up."
  ],
  preparing: [
    "Your food is being prepared! 👨‍🍳 Smells amazing, right?",
    "Our chefs are on it! 🔥 Cooking up your order with love."
  ],
  delivered: [
    "Your order is here! 🎉 Bon appétit!",
    "Enjoy your meal! 🍽️ Thanks for ordering with us."
  ],
  cancelled: [
    "Oops! Your order got cancelled. 😔 Need help? Contact us anytime.",
    "Your order couldn't be completed. 💔 We’re here if you need assistance."
  ]
};

function getFriendlyMessage(status) {
  const messages = statusMessages[status];
  if (!messages) return `Your order is now ${status}.`;
  return messages[Math.floor(Math.random() * messages.length)];
}

module.exports = { getFriendlyMessage };
