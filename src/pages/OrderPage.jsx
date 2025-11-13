// src/pages/OrderPage.js
import React, { useState } from 'react';
import './OrderPage.css';
import MealTypeSelector from '../components/MealTypeSelector';
import PackageSelector from '../components/PackageSelector';
import { MENU } from '../data/menuData';
import { useCart } from '../utils/cartContext';
import Header from '../components/Header';
import CollapsibleMenu from '../components/MenuDisplay/CollapsibleMenu';
// After other imports
import CartSummary from '../components/CartSummary';

import { PRICES } from '../utils/pricing';
import { getEligibleItems } from '../utils/eligibility';


const OrderPage = () => {
    const [selectedPackage, setSelectedPackage] = useState('Basic');
    const [selectedMealType, setSelectedMealType] = useState('Breakfast');
    const { cart, resetCart } = useCart();
    const isCartEmpty = Object.keys(cart).length === 0;

    const handlePackageChange = (pkg) => {
        if (pkg !== selectedPackage) {
            if (!isCartEmpty) {
                const confirmChange = window.confirm("Changing package will reset your selections. Proceed?");
                if (!confirmChange) return;
                resetCart();
            }
            setSelectedPackage(pkg);
        }
    };
    const handleMealTypeChange = (mealType) => {
        if (mealType !== selectedMealType) {
            if (!isCartEmpty) {
                const confirmChange = window.confirm("Changing meal type will reset your selections. Proceed?");
                if (!confirmChange) return;
                resetCart();
            }
            setSelectedMealType(mealType);
        }
    };
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
                <div className="order-left">
                    {/* Collapsible menu categories will go here */}
                    {['Lunch', 'Dinner'].includes(selectedMealType) ? (
                        MENU.lunchDinner ? (
                            <CollapsibleMenu
                                menuData={getEligibleItems(selectedMealType, selectedPackage, MENU.lunchDinner)}
                                selectedPackage={selectedPackage}
                            />
                        ) : (
                            <p>No menu available for {selectedMealType}</p>
                        )
                    ) : MENU.breakfast ? (
                        <CollapsibleMenu
                            menuData={getEligibleItems(selectedMealType, selectedPackage, MENU.breakfast)}
                            selectedPackage={selectedPackage}
                        />
                    ) : (
                        <p>No breakfast menu available</p>
                    )}
                </div>
                <div className="order-right">
                    <CartSummary
                        selectedPackage={selectedPackage}
                        selectedMealType={selectedMealType}
                    />
                </div>

            </section>
        </div>
    );
};

export default OrderPage;
