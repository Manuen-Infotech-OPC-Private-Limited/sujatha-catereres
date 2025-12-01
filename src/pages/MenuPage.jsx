import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuPage.css';
import PackageSelector from '../components/PackageSelector';
import MealTypeSelector from '../components/MealTypeSelector';
import BreakfastMenu from '../components/MenuDisplay/BreakfastMenu';
import LunchDinnerMenu from '../components/MenuDisplay/LunchDinnerMenu';
import { MENU } from '../data/menuData';
import Header from '../components/Header';
import useAuth from '../hooks/useAuth';

const MenuPage = () => {
  const [selectedPackage, setSelectedPackage] = useState('Basic');
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const navigate = useNavigate();

  const { user, loading } = useAuth();

  return (
    <div className="home">
      <Header />

      <section className="menu-content">
        <h1>Our Menu</h1>

        {/* Show nothing until auth is loaded */}
        {!loading && (
          <>
            {user ? (
              <button
                className="order-now-btn"
                onClick={() => navigate('/order')}
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
          {selectedMealType === 'Breakfast' ? (
            MENU.breakfast ? (
              <BreakfastMenu
                menuData={MENU.breakfast}
                selectedPackage={selectedPackage}
              />
            ) : (
              <p>Breakfast menu is not available at the moment.</p>
            )
          ) : selectedMealType === 'Lunch' ? (
            MENU.lunchDinner ? (
              <LunchDinnerMenu
                menuData={MENU.lunchDinner}
                selectedMealType={selectedMealType}
                selectedPackage={selectedPackage}
              />
            ) : (
              <p>Lunch menu is not available at the moment.</p>
            )
          ) : selectedMealType === 'Dinner' ? (
            MENU.lunchDinner ? (
              <LunchDinnerMenu
                menuData={MENU.lunchDinner}
                selectedMealType={selectedMealType}
                selectedPackage={selectedPackage}
              />
            ) : (
              <p>Dinner menu is not available at the moment.</p>
            )
          ) : (
            <p>Please select a valid meal type.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default MenuPage;
