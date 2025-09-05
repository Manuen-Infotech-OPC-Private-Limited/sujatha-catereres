import React from 'react';
import DishCard from './DishCard';
import './LunchDinnerMenu.css'; // Import the CSS

const LunchDinnerMenu = ({ menuData, selectedMealType, selectedPackage }) => {
  return (
    <div>
      <h2>{selectedMealType.toLowerCase() === 'lunch' ? 'Lunch' : 'Dinner'} Menu</h2>

      {Object.entries(menuData).map(([category, dishes]) => (
        <div key={category} className="lunch-dinner-section">
          <h3 className="lunch-dinner-category-title">
            {category.replace(/([A-Z])/g, ' $1')}
          </h3>
          <div className="dish-card-container">
            {dishes.length === 0 ? (<p>No items available in this category</p>) : dishes.map((dish) => (
              <DishCard
                key={dish.name}
                name={dish.name}
                packages={dish.packages}
                selectedPackage={selectedPackage}
                image={dish.image}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LunchDinnerMenu;
