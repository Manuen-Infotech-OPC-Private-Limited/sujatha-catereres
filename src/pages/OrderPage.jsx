// // src/pages/OrderPage.js
// import React, { useState, useEffect } from 'react';
// import './OrderPage.css';
// import MealTypeSelector from '../components/MealTypeSelector';
// import PackageSelector from '../components/PackageSelector';
// import { useCart } from '../utils/cartContext';
// import Header from '../components/Header';
// import CollapsibleMenu from '../components/MenuDisplay/CollapsibleMenu';
// import CartSummary from '../components/CartSummary';
// import { PRICES } from '../utils/pricing';
// import { getEligibleItems } from '../utils/eligibility';

// const OrderPage = () => {
//   const [selectedPackage, setSelectedPackage] = useState(
//     () => localStorage.getItem("selectedPackage") || 'Basic'
//   );
//   const [selectedMealType, setSelectedMealType] = useState(
//     () => localStorage.getItem("selectedMealType") || 'Breakfast'
//   );
//   const [menuData, setMenuData] = useState({});
//   const [loadingMenu, setLoadingMenu] = useState(false);
//   const [menuError, setMenuError] = useState('');

//   const { cart, resetCart } = useCart();
//   const isCartEmpty = Object.keys(cart).length === 0;

//   const API = process.env.REACT_APP_API_URL;

//   // Fetch menu whenever meal type changes
//   useEffect(() => {
//     const fetchMenu = async () => {
//       setLoadingMenu(true);
//       setMenuError('');
//       try {
//         const res = await fetch(`${API}/api/menu?mealType=${selectedMealType}`, {
//           credentials: 'include',
//         });
//         if (!res.ok) throw new Error('Failed to fetch menu');
//         const data = await res.json();
//         setMenuData(data);
//       } catch (err) {
//         console.error(err);
//         setMenuError(`Failed to load menu. Please try again later. ${err.message || ''}`);
//       } finally {
//         setLoadingMenu(false);
//       }
//     };

//     fetchMenu();
//   }, [selectedMealType, API]);

//   const handlePackageChange = (pkg) => {
//     if (pkg !== selectedPackage) {
//       if (!isCartEmpty) {
//         const confirmChange = window.confirm("Changing package will reset your selections. Proceed?");
//         if (!confirmChange) return;
//         resetCart();
//       }
//       setSelectedPackage(pkg);
//       localStorage.setItem("selectedPackage", pkg);
//     }
//   };

//   const handleMealTypeChange = (mealType) => {
//     if (mealType !== selectedMealType) {
//       if (!isCartEmpty) {
//         const confirmChange = window.confirm("Changing meal type will reset your selections. Proceed?");
//         if (!confirmChange) return;
//         resetCart();
//       }
//       setSelectedMealType(mealType);
//       localStorage.setItem("selectedMealType", mealType);
//     }
//   };

//   return (
//     <div className="home">
//       <Header />
//       <section className="order-header">
//         <h1>Order Now</h1>
//         <div className="selectors">
//           <MealTypeSelector
//             selectedMealType={selectedMealType}
//             onSelect={handleMealTypeChange}
//           />
//           <PackageSelector
//             selectedPackage={selectedPackage}
//             onSelect={handlePackageChange}
//           />
//         </div>
//         <p className="per-person-price">
//           Price per person: ₹{PRICES[selectedMealType][selectedPackage]}
//         </p>
//       </section>

//       <section className="order-main">
//         <div className="order-content">
//           <div className="order-right">
//             <CartSummary
//               selectedPackage={selectedPackage}
//               selectedMealType={selectedMealType}
//             />
//           </div>
//           <div className="order-left">
//             {loadingMenu ? (
//               <p>Loading menu...</p>
//             ) : menuError ? (
//               <p>{menuError}</p>
//             ) : Object.keys(menuData).length === 0 ? (
//               <p>No menu available for {selectedMealType}</p>
//             ) : (
//               <CollapsibleMenu
//                 menuData={getEligibleItems(selectedMealType, selectedPackage, menuData)}
//                 selectedPackage={selectedPackage}
//               />
//             )}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default OrderPage;



// src/pages/OrderPage.js
import React, { useState, useEffect } from 'react';
import '../css/OrderPage.css';
import MealTypeSelector from '../components/MealTypeSelector';
import PackageSelector from '../components/PackageSelector';
import { useCart } from '../utils/cartContext';
import Header from '../components/Header';
import CollapsibleMenu from '../components/MenuDisplay/CollapsibleMenu';
import CartSummary from '../components/CartSummary';
import { PRICES } from '../utils/pricing';
import { getEligibleItems } from '../utils/eligibility';
import { useMenu } from '../utils/MenuContext';
import { useLocation } from '../utils/LocationContext';

const OrderPage = () => {
  const [selectedPackage, setSelectedPackage] = useState(
    () => localStorage.getItem('selectedPackage') || 'Classic'
  );
  const [selectedMealType, setSelectedMealType] = useState(
    () => localStorage.getItem('selectedMealType') || 'Breakfast'
  );
  const [menuData, setMenuData] = useState({});

  const { cart, resetCart } = useCart();
  const isCartEmpty = Object.keys(cart).length === 0;

  const { getMenu, loading: loadingMenu, error: menuError } = useMenu();
  const { 
    isCateringServiceable, 
    isLoading: loadingLocation, 
    requestLocation, 
    permissionDenied,
    error: locationError,
    pincode
  } = useLocation();

  // Request location on mount
  useEffect(() => {
    if (!pincode && !permissionDenied) {
      requestLocation();
    }
  }, [pincode, permissionDenied, requestLocation]);

  // Fetch menu via shared cache when meal type changes
  useEffect(() => {
    let isMounted = true;

    getMenu(selectedMealType)
      .then((data) => {
        if (isMounted) setMenuData(data);
      })
      .catch(() => {
        // error already handled in MenuContext
      });

    return () => {
      isMounted = false;
    };
  }, [selectedMealType, getMenu]);

  const handlePackageChange = (pkg) => {
    if (pkg !== selectedPackage) {
      if (!isCartEmpty) {
        const confirmChange = window.confirm(
          'Changing package will reset your selections. Proceed?'
        );
        if (!confirmChange) return;
        resetCart();
      }
      setSelectedPackage(pkg);
      localStorage.setItem('selectedPackage', pkg);
    }
  };

  const handleMealTypeChange = (mealType) => {
    if (mealType !== selectedMealType) {
      if (!isCartEmpty) {
        const confirmChange = window.confirm(
          'Changing meal type will reset your selections. Proceed?'
        );
        if (!confirmChange) return;
        resetCart();
      }
      setSelectedMealType(mealType);
      localStorage.setItem('selectedMealType', mealType);
    }
  };

  if (loadingLocation) {
    return (
      <div className="home">
        <Header />
        <div className="location-loading">
          <p>Detecting your location to check serviceability...</p>
        </div>
      </div>
    );
  }

  if (permissionDenied || (pincode && !isCateringServiceable)) {
    return (
      <div className="home">
        <Header />
        <div className="location-blocked">
          <div className="blocked-content">
            <h2>{permissionDenied ? 'Location Required' : 'Outside Service Area'}</h2>
            <p>
              {permissionDenied 
                ? 'We need your location to verify if we can deliver catering services to your area.' 
                : `Sorry, we currently do not provide catering services in your area (Pincode: ${pincode}). Our catering service is available for pincodes 522001 - 522663.`}
            </p>
            {permissionDenied && (
              <button onClick={requestLocation} className="cta-button">
                Allow Location Access
              </button>
            )}
            <p className="contact-note">
              If you believe this is an error, please contact us at <a href="tel:+919703505356">+91 97035 05356</a>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <Header />

      <section className="order-header">
        <h1>Order Now</h1>

        <div className="selectors">
          <MealTypeSelector
            selectedMealType={selectedMealType}
            onSelect={handleMealTypeChange}
          />
          <PackageSelector
            selectedPackage={selectedPackage}
            onSelect={handlePackageChange}
          />
        </div>

        <p className="per-person-price">
          Price per person: ₹{PRICES[selectedMealType][selectedPackage]}
        </p>
      </section>

      <section className="order-main">
        <div className="order-content">
          <div className="order-right">
            <CartSummary
              selectedPackage={selectedPackage}
              selectedMealType={selectedMealType}
            />
          </div>

          <div className="order-left">
            {loadingMenu ? (
              <p>Loading menu...</p>
            ) : menuError ? (
              <p>{menuError}</p>
            ) : Object.keys(menuData).length === 0 ? (
              <p>No menu available for {selectedMealType}</p>
            ) : (
              <CollapsibleMenu
                menuData={getEligibleItems(
                  selectedMealType,
                  selectedPackage,
                  menuData
                )}
                selectedPackage={selectedPackage}
                selectedMealType={selectedMealType}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderPage;
