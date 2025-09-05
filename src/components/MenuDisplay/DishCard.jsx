import React from 'react';
import './DishCard.css';

const DishCard = ({ name, packages, selectedPackage, image }) => {
  const isAvailable = packages.includes(selectedPackage);
  const restrictionNote = !isAvailable
    ? `Available in: ${packages.join(', ')}`
    : null;

  return (
    <div className={`dish-card ${!isAvailable ? 'restricted' : ''}` }>
      {image && (
        <img
          src={image}
          alt={name}
          className="dish-image"
        />
      )}
      <div className="dish-info">
        <h4>{name}</h4>
        {restrictionNote && <span className="tag">{restrictionNote}</span>}
      </div>
    </div>
  );
};

export default DishCard;
