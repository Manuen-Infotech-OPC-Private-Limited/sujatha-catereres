// import React from 'react';
// import './CartSummary.css';
// import { useCart } from '../utils/cartContext';
// import { useNavigate } from 'react-router-dom';
// import { MENU } from '../data/menuData'; // Make sure MENU is imported

// const CartSummary = ({ selectedPackage, selectedMealType }) => {
//   const { cart, removeItemFromCategory } = useCart();
//   const navigate = useNavigate();

//   const isCartEmpty = Object.keys(cart).length === 0;

//   const handleRemoveClick = (category, itemName) => {
//     removeItemFromCategory(category, itemName);
//   };
//   let complimentaryItems = [];
//   // Get complimentary items based on selected meal type and package
//   if (['Lunch', 'Dinner'].includes(selectedMealType)) {
//     const ci = (MENU.lunchDinner.complimentary).filter(item => item.packages.includes(selectedPackage)) || [];
//     complimentaryItems = ci;
//   } else {
//     const ci = (MENU.breakfast.complimentary).filter(item => item.packages.includes(selectedPackage)) || [];
//     complimentaryItems = ci;
//   }
//   console.log(`complimentary items: ${complimentaryItems}`);
//   return (
//     <div className="cart-summary">
//       <h3>Cart Summary</h3>
//       <p><strong>Meal Type:</strong> {selectedMealType}</p>
//       <p><strong>Package:</strong> {selectedPackage}</p>
//       <p className="complimentary-items-note">
//         All complimentary items will be added to your package automatically, so no selection is required.
//       </p>
//       <hr />

//       {isCartEmpty ? (
//         <p className="cart-empty">No items selected.</p>
//       ) : (
//         <>
//           {Object.entries(cart).map(([category, items]) => (
//             <div key={category} className="cart-category">
//               <h4>{category.replace(/([A-Z])/g, ' $1')}</h4>
//               <ul className="cart-items">
//                 {items.map((item) => (
//                   <li key={item.name} className="cart-item modern-item">
//                     {item.image && (
//                       <img src={item.image} alt={item.name} className="cart-item-img" />
//                     )}
//                     <span>{item.name}</span>
//                     <button
//                       className="remove-item-btn"
//                       aria-label={`Remove ${item.name}`}
//                       onClick={() => handleRemoveClick(category, item.name)}
//                     >
//                       x
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}

//           <div className="get-invoice-container">
//             <button
//               className="get-invoice-btn"
//               onClick={() =>
//                 navigate('/review-order', {
//                   state: { selectedPackage, selectedMealType, complimentaryItems },
//                 })
//               }
//             >
//               Review Order
//             </button>
//           </div>
//         </>
//       )}
//     </div>

//   );
// };

// export default CartSummary;
import React from 'react';
import './CartSummary.css';
import { useCart } from '../utils/cartContext';
import { useNavigate } from 'react-router-dom';
import { MENU } from '../data/menuData';
import { toast } from 'react-toastify';
import { getCategoryLimit } from '../utils/cartRules';

const CartSummary = ({ selectedPackage, selectedMealType }) => {
  const { cart, removeItemFromCategory } = useCart();
  const navigate = useNavigate();

  const isCartEmpty = Object.keys(cart).length === 0;

  const handleRemoveClick = (category, itemName) => {
    removeItemFromCategory(category, itemName);
  };

  // Get complimentary items
  const complimentaryItems = (['Lunch', 'Dinner'].includes(selectedMealType)
    ? MENU.lunchDinner.complimentary
    : MENU.breakfast.complimentary
  )?.filter(item => item.packages.includes(selectedPackage)) || [];

  // Get all categories (exclude complimentary)
  const categories = Object.keys(
    ['Lunch', 'Dinner'].includes(selectedMealType) ? MENU.lunchDinner : MENU.breakfast
  ).filter(c => c.toLowerCase() !== 'complimentary');

  // Only require categories with limit > 0
  const requiredCategories = categories.filter(
    (category) => getCategoryLimit(selectedMealType, selectedPackage, category) > 0
  );
  // console.log(`req cat: ${requiredCategories}`)

  // Normalize cart keys for comparison
  const cartKeysLower = Object.keys(cart).map(k => k.toLowerCase());
  // console.log(`carkeys: ${cartKeysLower}`);
  // Check that user selected at least one item from each required category

  const allCategoriesSelected = requiredCategories.every((category) => {
    // console.log(`category: ${category}`);
    //   console.log(`cart keys: ${cartKeysLower}`);
    const matchingKey = cartKeysLower.find(k => k === category.toLowerCase());
    // console.log(`matching key: ${matchingKey}`);
    return matchingKey ? cart[Object.keys(cart).find(k => k.toLowerCase() === matchingKey)].length > 0 : false;
  });

  const handleReviewOrder = () => {
    if (!allCategoriesSelected) {
      toast.warn("Please select at least one item from each category before proceeding.");
      return;
    }
    navigate('/review-order', {
      state: { selectedPackage, selectedMealType, complimentaryItems },
    });
  };

  return (
    <div className="cart-summary">
      <h3>Cart Summary</h3>
      <p><strong>Meal Type:</strong> {selectedMealType}</p>
      <p><strong>Package:</strong> {selectedPackage}</p>
      <p className="complimentary-items-note">
        All complimentary items will be added to your package automatically, so no selection is required.
      </p>
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
                    {item.image && <img src={`${process.env.REACT_APP_API_URL}${item.image}`} alt={item.name} className="cart-item-img" />}
                    <span>{item.name}</span>
                    <button
                      className="remove-item-btn"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => handleRemoveClick(category, item.name)}
                    >
                      x
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="get-invoice-container">
            <button className="get-invoice-btn" onClick={handleReviewOrder}>
              Review Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartSummary;
