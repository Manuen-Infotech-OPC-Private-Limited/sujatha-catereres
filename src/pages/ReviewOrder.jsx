// import React, { useState, useEffect } from 'react';
// import { useCart } from '../utils/cartContext';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './ReviewOrder.css';
// import { PRICES } from '../utils/pricing';
// import { toast } from 'react-toastify';

// const ReviewOrder = () => {
//   const { cart, resetCart } = useCart();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [selectedPackage, setSelectedPackage] = useState(null);
//   const [selectedMealType, setSelectedMealType] = useState(null);
//   const [deliveryDate, setDeliveryDate] = useState('');   // NEW STATE
//   const [guests, setGuests] = useState(1);
//   const API = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     if (location.state?.selectedPackage && location.state?.selectedMealType) {
//       setSelectedPackage(location.state.selectedPackage);
//       setSelectedMealType(location.state.selectedMealType);
//     } else {
//       navigate('/', { replace: true });
//     }
//   }, [location.state, navigate]);

//   if (!selectedPackage || !selectedMealType) return null;

//   const pricePerPerson = PRICES[selectedMealType]?.[selectedPackage] || 0;
//   const total = guests * pricePerPerson;

//   const handlePlaceOrder = async () => {
//     if (!deliveryDate) {
//       toast.error('Please select expected delivery date');
//       return;
//     }
//     try {
//       const response = await fetch(`${API}/api/orders`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({
//           cart,
//           selectedPackage,
//           selectedMealType,
//           guests,
//           deliveryDate,
//           pricePerPerson,
//         }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         navigate('/');
//         toast.success('Order placed successfully!', {
//           autoClose: 2000,
//           onClose: () => {
//             resetCart();
//           },
//         });
//       } else {
//         toast.error(data.error || '❌ Order failed');
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error('⚠️ Error placing order');
//     }
//   };

//   return (
//     <div className="review-order">
//       <h2>Review Your Order</h2>
//       <p><strong>Meal Type:</strong> {selectedMealType}</p>
//       <p><strong>Package:</strong> {selectedPackage}</p>

//       <div className="selected-items">
//         {Object.entries(cart).map(([category, items]) => (
//           <div key={category}>
//             <h4>{category}</h4>
//             <ul>
//               {items.map((item) => (
//                 <li key={item.name}>{item.name}</li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>

//       <label>
//         Number of Guests:
//         <input
//           type="number"
//           min="1"
//           value={guests}
//           onChange={(e) => setGuests(Number(e.target.value))}
//         />
//       </label>

//       <label>
//         Expected Delivery Date:
//         <input
//           type="date"
//           value={deliveryDate}
//           onChange={(e) => setDeliveryDate(e.target.value)}
//         />
//       </label>

//       <p><strong>Price per person:</strong> ₹{pricePerPerson}</p>
//       <p><strong>Total:</strong> ₹{total}</p>

//       <button className="place-order-btn" onClick={handlePlaceOrder}>
//         Place Order
//       </button>
//     </div>
//   );
// };

// export default ReviewOrder;


// import React, { useState, useEffect } from 'react';
// import { useCart } from '../utils/cartContext';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './ReviewOrder.css';
// import { PRICES } from '../utils/pricing';
// import { toast } from 'react-toastify';

// const ReviewOrder = () => {
//   const { cart, resetCart } = useCart();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [selectedPackage, setSelectedPackage] = useState(null);
//   const [selectedMealType, setSelectedMealType] = useState(null);
//   const [deliveryDate, setDeliveryDate] = useState('');
//   const [guests, setGuests] = useState(10);
//   const [complimentaryItems, setComplimentaryItems] = useState([]); // NEW STATE

//   const API = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     if (location.state?.selectedPackage && location.state?.selectedMealType) {
//       setSelectedPackage(location.state.selectedPackage);
//       setSelectedMealType(location.state.selectedMealType);
//       setComplimentaryItems(location.state.complimentaryItems || []); // SET COMPLIMENTARY ITEMS
//     } else {
//       navigate('/', { replace: true });
//     }
//   }, [location.state, navigate]);

//   if (!selectedPackage || !selectedMealType) return null;

//   const pricePerPerson = PRICES[selectedMealType]?.[selectedPackage] || 0;
//   const total = guests * pricePerPerson;

//   const handlePlaceOrder = async () => {
//     if (!deliveryDate) {
//       toast.error('Please select delivery date');
//       return;
//     }
//     try {
//       const response = await fetch(`${API}/api/orders`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({
//           cart,
//           complimentaryItems, // INCLUDE COMPLIMENTARY ITEMS IN ORDER
//           selectedPackage,
//           selectedMealType,
//           guests,
//           deliveryDate,
//           pricePerPerson,
//         }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         navigate('/');
//         toast.success('Order placed successfully!', {
//           autoClose: 2000,
//           onClose: () => {
//             resetCart();
//           },
//         });
//       } else {
//         toast.error(data.error || '❌ Order failed');
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error('⚠️ Error placing order');
//     }
//   };

//   return (
//     <div className="review-order">
//       <h2>Review Your Order</h2>
//       <p><strong>Meal Type:</strong> {selectedMealType}</p>
//       <p><strong>Package:</strong> {selectedPackage}</p>

//       <div className="selected-items">
//         {Object.entries(cart).map(([category, items]) => (
//           <div key={category}>
//             <h4>{category}</h4>
//             <ul>
//               {items.map((item) => (
//                 <li key={item.name}>{item.name}</li>
//               ))}
//             </ul>
//           </div>
//         ))}

//         {complimentaryItems.length > 0 && (
//           <div className="complimentary-items">
//             <h4>Complimentary Items</h4>
//             <ul>
//               {complimentaryItems.map((item) => (
//                 <li key={item.name}>{item.name}</li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>

//       <label>
//         Number of Guests:
//         <input
//           type="number"
//           min="10"
//           value={guests}
//           onChange={(e) => setGuests(Number(e.target.value))}
//         />
//       </label>

//       <label>
//         Delivery Date:
//         <input
//           type="date"
//           value={deliveryDate}
//           onChange={(e) => setDeliveryDate(e.target.value)}
//         />
//       </label>

//       <p><strong>Price per person:</strong> ₹{pricePerPerson}</p>
//       <p><strong>Total:</strong> ₹{total}</p>
//       <div className="button-row">
//         <button
//           className="adjust-order-btn"
//           // onClick={() =>
//           //   navigate('/', {
//           //     state: {
//           //       selectedMealType,
//           //       selectedPackage
//           //     }
//           //   })
//           // }
//           onClick={() => navigate(-1)} // Go back to previous page

//         >
//           Go Back
//         </button>

//         <button className="place-order-btn" onClick={handlePlaceOrder}>
//           Place Order
//         </button>
//       </div>

//     </div>
//   );
// };

// export default ReviewOrder;



import React, { useState, useEffect } from 'react';
import { useCart } from '../utils/cartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './ReviewOrder.css';
import { PRICES } from '../utils/pricing';
import { toast } from 'react-toastify';
// import OrderPlacedAnimation from '../components/OrderPlacedAnimation';
import OrderPlacedAnimation from '../components/OrderPlacedAnimation';
import soundSuccess from '../assets/sounds/order-placed.mp3';

const ReviewOrder = () => {
  const { cart, resetCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [guests, setGuests] = useState(10);
  const [complimentaryItems, setComplimentaryItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (location.state?.selectedPackage && location.state?.selectedMealType) {
      setSelectedPackage(location.state.selectedPackage);
      setSelectedMealType(location.state.selectedMealType);
      setComplimentaryItems(location.state.complimentaryItems || []);
    } else {
      navigate('/', { replace: true });
    }
  }, [location.state, navigate]);

  if (!selectedPackage || !selectedMealType) return null;

  const pricePerPerson = PRICES[selectedMealType]?.[selectedPackage] || 0;
  const total = guests * pricePerPerson;

  const handlePlaceOrder = async () => {
    if (!deliveryDate) {
      toast.error('Please select delivery date');
      return;
    }

    try {
      const response = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          cart,
          complimentaryItems,
          selectedPackage,
          selectedMealType,
          guests,
          deliveryDate,
          pricePerPerson,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        resetCart();
        setOrderPlaced(true); // Show animation
      } else {
        toast.error(data.error || '❌ Order failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('⚠️ Error placing order');
    }
  };

  // Show Lottie animation if order placed
  if (orderPlaced) {
    return <OrderPlacedAnimation duration={3000} soundUrl={soundSuccess} />;
  }

  return (
    <div className="review-order">
      <h2>Review Your Order</h2>
      <p><strong>Meal Type:</strong> {selectedMealType}</p>
      <p><strong>Package:</strong> {selectedPackage}</p>

      <div className="selected-items">
        {Object.entries(cart).map(([category, items]) => (
          <div key={category}>
            <h4>{category}</h4>
            <ul>
              {items.map((item) => (
                <li key={item.name}>{item.name}</li>
              ))}
            </ul>
          </div>
        ))}

        {complimentaryItems.length > 0 && (
          <div className="complimentary-items">
            <h4>Complimentary Items</h4>
            <ul>
              {complimentaryItems.map((item) => (
                <li key={item.name}>{item.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <label>
        Number of Guests:
        <input
          type="number"
          min="10"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        />
      </label>

      <label>
        Delivery Date:
        <input
          type="date"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
        />
      </label>

      <p><strong>Price per person:</strong> ₹{pricePerPerson}</p>
      <p><strong>Total:</strong> ₹{total}</p>

      <div className="button-row">
        <button className="adjust-order-btn" onClick={() => navigate(-1)}>
          Go Back
        </button>
        <button className="place-order-btn" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
};

export default ReviewOrder;
