import React, { useEffect, useState } from 'react';
import '../css/CartSummary.css';
import { useCart } from '../utils/cartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCategoryLimit } from '../utils/cartRules';
import { useMenu } from '../utils/MenuContext';

const CartSummary = ({ selectedPackage, selectedMealType }) => {
  const { cart, removeItemFromCategory } = useCart();
  const navigate = useNavigate();
  const { getMenu } = useMenu();

  const [menuData, setMenuData] = useState(null);

  const isCartEmpty = Object.keys(cart).length === 0;

  // 🔹 Fetch menu from backend via MenuContext
  useEffect(() => {
    let mounted = true;

    getMenu(selectedMealType)
      .then((data) => {
        if (mounted) setMenuData(data);
      })
      .catch(() => { });

    return () => {
      mounted = false;
    };
  }, [selectedMealType, getMenu]);

  const handleRemoveClick = (category, itemName) => {
    removeItemFromCategory(category, itemName);
  };

  // ✅ Complimentary items now come ONLY from backend data
  // Include if: Match Package AND (Explicitly AutoInclude OR Not Selectable)
  const complimentaryItems =
    menuData?.complimentary
      ?.filter(item => 
        item.packages.includes(selectedPackage) && 
        (item.autoInclude || !item.selectableGroup)
      ) || [];

  // Get all non-complimentary categories
  const categories = menuData
    ? Object.keys(menuData).filter(
      (c) => c.toLowerCase() !== 'complimentary'
    )
    : [];

  // Categories that must be selected
  const requiredCategories = categories.filter(
    (category) =>
      getCategoryLimit(selectedMealType, selectedPackage, category) > 0
  );

  const cartKeysLower = Object.keys(cart).map(k => k.toLowerCase());

  const allCategoriesSelected = requiredCategories.every((category) => {
    const matchingKey = cartKeysLower.find(
      k => k === category.toLowerCase()
    );
    return matchingKey
      ? cart[
        Object.keys(cart).find(
          k => k.toLowerCase() === matchingKey
        )
      ]?.length > 0
      : false;
  });

  const handleReviewOrder = () => {
    if (!allCategoriesSelected) {
      toast.warn(
        'Please select at least one item from each category before proceeding.'
      );
      return;
    }

    // 🔹 Validate Complimentary Drinks (Tea/Coffee) Selection
    // If current package/meal allows selectable drinks (not auto-included), ensure one is selected.
    // Logic: Look for "selectableGroup": "drink" in menuData.complimentary for current package
    // If found, ensure cart['complimentary'] has at least one item.
    if (menuData?.complimentary) {
        const hasSelectableDrink = menuData.complimentary.some(
            item => 
                item.packages.includes(selectedPackage) && 
                item.selectableGroup === 'drink' && 
                !item.autoInclude
        );

        if (hasSelectableDrink) {
            const drinkCart = cart['Opted-drink'] || [];
            
            if (drinkCart.length === 0) {
                 toast.warn('Please select either Tea or Coffee from the Complimentary section.');
                 return;
            }
        }
    }


    // 🔒 Defensive check: never allow webpack URLs to pass
    const hasInvalidImage = complimentaryItems.some(
      item => item.image?.startsWith('/static/media')
    );

    if (hasInvalidImage) {
      toast.error('Invalid image data detected. Please refresh the page.');
      return;
    }

    navigate('/review-order', {
      state: {
        orderType: 'catering',
        selectedPackage,
        selectedMealType,
        complimentaryItems,
      },
    });
  };

  return (
    <div className="cart-summary">
      <h3>Cart Summary</h3>
      <p><strong>Meal Type:</strong> {selectedMealType}</p>
      <p><strong>Package:</strong> {selectedPackage}</p>

      <p className="complimentary-items-note">
        All complimentary items will be added automatically.
      </p>

      <hr />

      {isCartEmpty ? (
        <p className="cart-empty">No items selected.</p>
      ) : (
        <>
          {Object.entries(cart).map(([category, items]) => (
            <div key={category} className="cart-category">
              <h4>
                {category === 'Opted-drink' 
                  ? 'Selected Drinks' 
                  : category.replace(/([A-Z])/g, ' $1')}
              </h4>
              <ul className="cart-items">
                {items.map((item) => (
                  <li key={item.name} className="cart-item modern-item">
                    {item.image && (
                      <img
                        src={`${process.env.REACT_APP_API_URL}${item.image}`}
                        alt={item.name}
                        className="cart-item-img"
                      />
                    )}
                    <span>{item.name}</span>
                    <button
                      className="remove-item-btn"
                      aria-label={`Remove ${item.name}`}
                      onClick={() =>
                        handleRemoveClick(category, item.name)
                      }
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="get-invoice-container">
            <button
              className="get-invoice-btn"
              onClick={handleReviewOrder}
            >
              Review Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartSummary;