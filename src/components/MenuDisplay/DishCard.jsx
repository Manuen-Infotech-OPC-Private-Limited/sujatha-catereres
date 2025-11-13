import React from 'react';
import './DishCard.css';

const DishCard = ({ name, packages, selectedPackage, image, isSelected }) => {
  const isAvailable = packages.includes(selectedPackage);
  const restrictionNote = !isAvailable
    ? `Available in: ${packages.join(', ')}`
    : null;

  return (
    <div
      className={`dish-card 
        ${!isAvailable ? 'restricted' : ''} 
        ${isSelected ? 'selected' : ''}`}
    >
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

      {isSelected && <div className="selected-badge">✓ Selected</div>}
    </div>
  );
};

export default DishCard;
