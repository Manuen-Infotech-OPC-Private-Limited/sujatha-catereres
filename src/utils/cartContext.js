// utils/cartContext.js
import { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const setCategoryItem = (category, item, limit = 1) => {
    setCart((prev) => {
      let newCart;
      if (category === 'complimentary') {
        if (item.selectableGroup) {
          const subCategory = `Opted-${item.selectableGroup}`;
          const existing = prev[subCategory] || [];
          if (existing.some(i => i.name === item.name)) return prev;

          const updatedItems = [item];
          toast.success(`"${item.name}" is opted to ${item.selectableGroup}.`);

          newCart = {
            ...prev,
            [subCategory]: updatedItems,
          };
        } else {
          const existing = prev[category] || [];
          if (existing.some(i => i.name === item.name)) return prev;

          const updatedItems = [...existing, item];
          toast.success(`"${item.name}" added to complimentary.`);

          newCart = {
            ...prev,
            [category]: updatedItems,
          };
        }
      } else {
        const existing = prev[category] || [];
        if (existing.some(i => i.name === item.name)) return prev;

        let updatedItems;
        if (existing.length >= limit) {
          updatedItems = [...existing];
          updatedItems[updatedItems.length - 1] = item;
          toast.info(`Limit reached for "${category}". Replaced last item with "${item.name}".`);
        } else {
          updatedItems = [...existing, item];
          const remaining = limit - updatedItems.length;
          toast.success(`"${item.name}" added to "${category}". ${remaining > 0 ? `${remaining} more allowed.` : 'Limit reached.'}`);
        }

        newCart = {
          ...prev,
          [category]: updatedItems,
        };
      }
      
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeItemFromCategory = (category, itemName) => {
    setCart((prev) => {
      const existing = prev[category] || [];
      const updatedItems = existing.filter(item => item.name !== itemName);
      const updatedCart = { ...prev };

      if (updatedItems.length > 0) {
        updatedCart[category] = updatedItems;
      } else {
        delete updatedCart[category];
      }

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const resetCart = () => {
    setCart({});
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{ cart, setCategoryItem, resetCart, removeItemFromCategory }}>
      {children}
    </CartContext.Provider>
  );
};
