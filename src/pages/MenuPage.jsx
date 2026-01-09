// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './MenuPage.css';
// import PackageSelector from '../components/PackageSelector';
// import MealTypeSelector from '../components/MealTypeSelector';
// import BreakfastMenu from '../components/MenuDisplay/BreakfastMenu';
// import LunchDinnerMenu from '../components/MenuDisplay/LunchDinnerMenu';
// import { MENU } from '../data/menuData';
// import Header from '../components/Header';
// import useAuth from '../hooks/useAuth';

// const MenuPage = () => {
//   const [selectedPackage, setSelectedPackage] = useState('Basic');
//   const [selectedMealType, setSelectedMealType] = useState('Breakfast');
//   const navigate = useNavigate();

//   const { user, loading } = useAuth();

//   return (
//     <div className="home">
//       <Header />

//       <section className="menu-content">
//         <h1>Our Menu</h1>

//         {/* Show nothing until auth is loaded */}
//         {!loading && (
//           <>
//             {user ? (
//               <button
//                 className="order-now-btn"
//                 onClick={() => navigate('/order')}
//               >
//                 Order Now
//               </button>
//             ) : (
//               <button
//                 className="order-now-btn login-required-btn"
//                 onClick={() => navigate('/login')}
//               >
//                 Please login to place an order
//               </button>
//             )}
//           </>
//         )}

//         <div>
//           <MealTypeSelector
//             selectedMealType={selectedMealType}
//             onSelect={setSelectedMealType}
//           />

//           <PackageSelector
//             selectedPackage={selectedPackage}
//             onSelect={setSelectedPackage}
//           />
//         </div>

//         <div>
//           {selectedMealType === 'Breakfast' ? (
//             MENU.breakfast ? (
//               <BreakfastMenu
//                 menuData={MENU.breakfast}
//                 selectedPackage={selectedPackage}
//               />
//             ) : (
//               <p>Breakfast menu is not available at the moment.</p>
//             )
//           ) : selectedMealType === 'Lunch' ? (
//             MENU.lunchDinner ? (
//               <LunchDinnerMenu
//                 menuData={MENU.lunchDinner}
//                 selectedMealType={selectedMealType}
//                 selectedPackage={selectedPackage}
//               />
//             ) : (
//               <p>Lunch menu is not available at the moment.</p>
//             )
//           ) : selectedMealType === 'Dinner' ? (
//             MENU.lunchDinner ? (
//               <LunchDinnerMenu
//                 menuData={MENU.lunchDinner}
//                 selectedMealType={selectedMealType}
//                 selectedPackage={selectedPackage}
//               />
//             ) : (
//               <p>Dinner menu is not available at the moment.</p>
//             )
//           ) : (
//             <p>Please select a valid meal type.</p>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default MenuPage;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuPage.css';
import PackageSelector from '../components/PackageSelector';
import MealTypeSelector from '../components/MealTypeSelector';
import BreakfastMenu from '../components/MenuDisplay/BreakfastMenu';
import LunchDinnerMenu from '../components/MenuDisplay/LunchDinnerMenu';
import Header from '../components/Header';
import useAuth from '../hooks/useAuth';

const MenuPage = () => {
  const [selectedPackage, setSelectedPackage] = useState('Basic');
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const [menuData, setMenuData] = useState({});
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [menuError, setMenuError] = useState('');
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const API = process.env.REACT_APP_API_URL;

  // Fetch menu from backend
  useEffect(() => {
    const fetchMenu = async () => {
      setLoadingMenu(true);
      setMenuError('');
      try {
        const res = await fetch(`${API}/api/menu?mealType=${selectedMealType}`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch menu');
        const data = await res.json();
        setMenuData(data);
      } catch (err) {
        console.error(err);
        setMenuError(`Failed to load menu. Please try again later. ${err}`);
      } finally {
        setLoadingMenu(false);
      }
    };

    fetchMenu();
  }, [selectedMealType]);

  return (
    <div className="home">
      <Header />

      <section className="menu-content">
        <h1>Our Menu</h1>

        {!loading && (
          <>
            {user ? (
              <button
                className="order-now-btn"
                onClick={() => navigate('/catering/order')}
              >
                Order Now
              </button>
            ) : (
              <button
                className="order-now-btn login-required-btn"
                onClick={() => navigate('/login')}
              >
                Please login to place an order
              </button>
            )}
          </>
        )}

        <div>
          <MealTypeSelector
            selectedMealType={selectedMealType}
            onSelect={setSelectedMealType}
          />

          <PackageSelector
            selectedPackage={selectedPackage}
            onSelect={setSelectedPackage}
          />
        </div>

        <div>
          {loadingMenu ? (
            <p>Loading menu...</p>
          ) : menuError ? (
            <p>{menuError}</p>
          ) : Object.keys(menuData).length === 0 ? (
            <p>{selectedMealType} menu is not available at the moment.</p>
          ) : selectedMealType === 'Breakfast' ? (
            <BreakfastMenu
              menuData={menuData}
              selectedPackage={selectedPackage}
            />
          ) : selectedMealType === 'Lunch' || selectedMealType === 'Dinner' ? (
            <LunchDinnerMenu
              menuData={menuData}
              selectedMealType={selectedMealType}
              selectedPackage={selectedPackage}
            />
          ) : (
            <p>Please select a valid meal type.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default MenuPage;
