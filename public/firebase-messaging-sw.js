/* eslint-disable no-undef */

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyD_9y6mS1R98I-B47zOePG6UNDPACfoKuE",
  authDomain: "sujatha-caterers.firebaseapp.com",
  projectId: "sujatha-caterers",
  messagingSenderId: "760085583349",
  appId: "1:760085583349:web:784e809830e596dc0cfcbc",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message', payload);

  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: '/logo192.png',
    }
  );
});
