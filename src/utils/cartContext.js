// context/CartContext.js
import { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({});

    const setCategoryItem = (category, item, limit = 1) => {
        setCart((prev) => {
            if (category === 'complimentary') {
                if (!item.selectableGroup) {
                    toast.info(`"${item.name}" cannot be selected.`);
                    return prev;
                }

                const subCategory = `Opted-${item.selectableGroup}`;
                const existing = prev[subCategory] || [];

                if (existing.some(i => i.name === item.name)) return prev;

                // Only one allowed per selectableGroup
                const updatedItems = [item];

                const updatedCart = {
                    ...prev,
                    [subCategory]: updatedItems,
                };

                toast.success(`"${item.name}" is opted to ${item.selectableGroup}.`);

                return updatedCart;
            }

            // Original behavior for other categories
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
                toast.success(
                    `"${item.name}" added to "${category}". ${remaining > 0 ? `${remaining} more allowed.` : 'Limit reached.'
                    }`
                );
            }

            return {
                ...prev,
                [category]: updatedItems,
            };
        });
    };

    const removeItemFromCategory = (category, itemName) => {
        setCart((prev) => {
            const existing = prev[category] || [];
            const updatedItems = existing.filter(item => item.name !== itemName);

            // If no items left in the category, remove the category key
            const updatedCart = { ...prev };
            if (updatedItems.length > 0) {
                updatedCart[category] = updatedItems;
            } else {
                delete updatedCart[category];
            }

            return updatedCart;
        });
    };

    const resetCart = () => setCart({});

    return (
        <CartContext.Provider value={{ cart, setCategoryItem, resetCart, removeItemFromCategory }}>
            {children}
        </CartContext.Provider>
    );
};
