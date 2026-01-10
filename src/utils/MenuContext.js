import React, { createContext, useContext, useRef, useState } from 'react';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const menuCache = useRef({}); // { Breakfast: {...}, Lunch: {...}, Dinner: {...} }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API = process.env.REACT_APP_API_URL;

  const getMenu = async (mealType) => {
    // ✅ Return cached menu
    if (menuCache.current[mealType]) {
      return menuCache.current[mealType];
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API}/api/menu?mealType=${mealType}`, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to fetch menu');

      const data = await res.json();

      // ✅ Cache result
      menuCache.current[mealType] = data;

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <MenuContext.Provider value={{ getMenu, loading, error }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);
