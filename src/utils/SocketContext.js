// src/utils/socketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null); // store current user info
  const API = process.env.REACT_APP_API_URL;

  // 🔔 Request notification permission globally once
  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  // Fetch logged-in user for registering socket
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API}/api/users/me`, { withCredentials: true });
        setUser(res.data.user);
      } catch (err) {
        console.error('Failed to fetch user for socket:', err);
      }
    };
    fetchUser();
  }, [API]);

  // Connect socket and handle global events
  useEffect(() => {
    if (!user?._id) return;

    const s = io(API, {
      withCredentials: true,
      transports: ['polling', 'websocket'],
      reconnection: true,
    });

    // Helper: send browser notification
    const sendBrowserNotification = (title, body) => {
      if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/logo192.png' });
      }
    };

    s.on('connect', () => {
      console.log('Global socket connected');
      s.emit('register', { userId: user._id });
    });

    // 🔔 Global notifications
    s.on('orderUpdated', (updatedOrder) => {
      if (String(updatedOrder.user?._id) === String(user._id)) {
        sendBrowserNotification(
          'Sujatha Caterers • Order Update',
          `Your order ${updatedOrder._id} is now "${updatedOrder.status}".`
        );
      }
    });

    s.on('orderCreated', (newOrder) => {
      if (String(newOrder.user?._id) === String(user._id)) {
        sendBrowserNotification(
          'Sujatha Caterers • New Order',
          `You just created a new order ${newOrder._id}.`
        );
      }
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [API, user?._id]);

  return (
    <SocketContext.Provider value={{ socket, user }}>
      {children}
    </SocketContext.Provider>
  );
};
