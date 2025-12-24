import React from 'react';
import DishCard from './DishCard';
import './BreakfastMenu.css'; // Import the CSS file

const BreakfastMenu = ({ menuData, selectedPackage }) => {
  return (
    <div>
      <h2>Breakfast Menu</h2>
      {Object.entries(menuData).map(([category, dishes]) => (
        <div key={category} className="breakfast-section">
          <h3 className="breakfast-category-title">{category}</h3>
          <div className="dish-card-container">
            {dishes.length === 0 ? (<p>No items available in this category</p>) :
              dishes.map((dish) => (
                <DishCard
                  key={dish.name}
                  name={dish.name}
                  packages={dish.packages}
                  selectedPackage={selectedPackage}
                  // image={dish.image}
                  image={`${process.env.REACT_APP_API_URL}${dish.image}`}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BreakfastMenu;
