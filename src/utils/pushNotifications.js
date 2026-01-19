import { messaging, getToken, onMessage } from '../firebase';

export const requestFCMToken = async () => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notification');
    return null;
  }
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  if (!messaging) return null;

  const token = await getToken(messaging, {
    vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
  });

  return token;
};

export const listenForegroundMessages = () => {
  if (!messaging) return;
  
  onMessage(messaging, (payload) => {
    console.log('Foreground push:', payload);

    if ('Notification' in window) {
      try {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: '/logo192.png',
        });
      } catch (e) {
        console.warn('Notification API failed:', e);
      }
    }
  });
};
