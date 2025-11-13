import React from 'react';
import './CartSummary.css';
import { useCart } from '../utils/cartContext';
import { useNavigate } from 'react-router-dom';

const CartSummary = ({ selectedPackage, selectedMealType }) => {
  const { cart, removeItemFromCategory } = useCart();
  const navigate = useNavigate();

  const isCartEmpty = Object.keys(cart).length === 0;

  const handleRemoveClick = (category, itemName) => {
    removeItemFromCategory(category, itemName);
  };

  return (
    <div className="cart-summary">
      <h3>Cart Summary</h3>
      <p><strong>Meal Type:</strong> {selectedMealType}</p>
      <p><strong>Package:</strong> {selectedPackage}</p>
      <hr />

      {isCartEmpty ? (
        <p className="cart-empty">No items selected.</p>
      ) : (
        <>
          {Object.entries(cart).map(([category, items]) => (
            <div key={category} className="cart-category">
              <h4>{category.replace(/([A-Z])/g, ' $1')}</h4>
              <ul className="cart-items">
                {items.map((item) => (
                  <li key={item.name} className="cart-item modern-item">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="cart-item-img" />
                    )}
                    <span>{item.name}</span>
                    <button
                      className="remove-item-btn"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => handleRemoveClick(category, item.name)}
                    >
                      {/* × */}
                      x
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="get-invoice-container">
            <button
              className="get-invoice-btn"
              onClick={() =>
                navigate('/review-order', {
                  state: { selectedPackage, selectedMealType },
                })
              }
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
