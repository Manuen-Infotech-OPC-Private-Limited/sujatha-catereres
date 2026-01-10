import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API = process.env.REACT_APP_API_URL;

  // Fetch user only once when the app loads
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API}/api/users/me`, {
          withCredentials: true,
        });
        setUser(response.data.user || null);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [API]);

  const logout = async () => {
    try {
      await axios.post(`${API}/api/users/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
