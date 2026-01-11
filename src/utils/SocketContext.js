// // src/utils/SocketContext.js
// import React, { createContext, useContext, useEffect, useRef } from 'react';
// import { io } from 'socket.io-client';
// import { useAuthContext } from './AuthContext';

// const SocketContext = createContext(null);

// export const useSocket = () => useContext(SocketContext);

// export const SocketProvider = ({ children }) => {
//   const { user } = useAuthContext(); // ✅ single source of truth
//   const socketRef = useRef(null);
//   const API = process.env.REACT_APP_API_URL;

//   // Request notification permission once
//   useEffect(() => {
//     if (Notification.permission !== 'granted') {
//       Notification.requestPermission();
//     }
//   }, []);

//   useEffect(() => {
//     if (!user?._id) return;

//     const socket = io(API, {
//       withCredentials: true,
//       transports: ['websocket', 'polling'],
//       reconnection: true,
//     });

//     socketRef.current = socket;

//     const notify = (title, body) => {
//       if (Notification.permission === 'granted') {
//         new Notification(title, {
//           body,
//           icon: '/logo192.png',
//         });
//       }
//     };

//     socket.on('connect', () => {
//       console.log('Socket connected:', socket.id);
//       socket.emit('register', { userId: user._id });
//     });

//     socket.on('orderUpdated', (order) => {
//       if (String(order.user?._id) === String(user._id)) {
//         notify(
//           'Sujatha Caterers • Order Update',
//           `Your order ${order._id} is now "${order.status}".`
//         );
//       }
//     });

//     socket.on('orderCreated', (order) => {
//       if (String(order.user?._id) === String(user._id)) {
//         notify(
//           'Sujatha Caterers • New Order',
//           `Order ${order._id} created successfully.`
//         );
//       }
//     });

//     return () => {
//       console.log('Socket disconnected');
//       socket.disconnect();
//       socketRef.current = null;
//     };
//   }, [API, user?._id]);

//   return (
//     <SocketContext.Provider value={{ socket: socketRef.current }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };
