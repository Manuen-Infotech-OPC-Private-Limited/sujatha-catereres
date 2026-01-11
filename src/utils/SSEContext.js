import React, { createContext, useContext, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';

const SSEContext = createContext(null);

export const SSEProvider = ({ children }) => {
  const { user, token } = useAuth();
  const esRef = useRef(null);
  const seenIds = useRef(new Set());

  useEffect(() => {
    if (!user || !token) return;

    const API = process.env.REACT_APP_API_URL;
    const url =
      user.role === 'admin'
        ? `${API}/sse/admin?token=${token}`
        : `${API}/sse/user?token=${token}`;

    const es = new EventSource(url, { withCredentials: true });
    esRef.current = es;

    es.onopen = () => {
      console.log('[SSE] connected');
    };

    es.onerror = () => {
      console.warn('[SSE] connection lost, retrying…');
    };

    const handle = (event, cb) => {
      es.addEventListener(event, e => {
        if (seenIds.current.has(e.lastEventId)) return;
        seenIds.current.add(e.lastEventId);
        cb(JSON.parse(e.data));
      });
    };

    handle('order_created', data => {
      toast.info(`🆕 New order received`);
    });

    handle('order_updated', data => {
      toast.info(`📦 Order updated`);
    });

    handle('order_status_updated', data => {
      toast.info(`🚚 Order ${data.status}`);
    });

    return () => {
      es.close();
      esRef.current = null;
      seenIds.current.clear();
    };
  }, [user, token]);

  return (
    <SSEContext.Provider value={null}>
      {children}
    </SSEContext.Provider>
  );
};

export default SSEContext;
