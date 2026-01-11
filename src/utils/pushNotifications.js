import { messaging, getToken, onMessage } from '../firebase';

export const requestFCMToken = async () => {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  const token = await getToken(messaging, {
    vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
  });

  return token;
};

export const listenForegroundMessages = () => {
  onMessage(messaging, (payload) => {
    console.log('Foreground push:', payload);

    new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: '/logo192.png',
    });
  });
};
