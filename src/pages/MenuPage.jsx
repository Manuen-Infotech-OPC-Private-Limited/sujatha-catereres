import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/MenuPage.css';
import PackageSelector from '../components/PackageSelector';
import MealTypeSelector from '../components/MealTypeSelector';
import BreakfastMenu from '../components/MenuDisplay/BreakfastMenu';
import LunchDinnerMenu from '../components/MenuDisplay/LunchDinnerMenu';
import Header from '../components/Header';
import useAuth from '../hooks/useAuth';
import { useMenu } from '../utils/MenuContext';

const MenuPage = () => {
  const [selectedPackage, setSelectedPackage] = useState('Basic');
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const [menuData, setMenuData] = useState({});

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const { getMenu, loading: loadingMenu, error: menuError } = useMenu();

  // Fetch menu via shared cache
  useEffect(() => {
    let isMounted = true;

    getMenu(selectedMealType)
      .then((data) => {
        if (isMounted) setMenuData(data);
      })
      .catch(() => {
        // error already handled in context
      });

    return () => {
      isMounted = false;
    };
  }, [selectedMealType, getMenu]);

  return (
    <div className="home">
      <Header />

      <section className="menu-content">
        <h1>Our Menu</h1>

        {!authLoading && (
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
