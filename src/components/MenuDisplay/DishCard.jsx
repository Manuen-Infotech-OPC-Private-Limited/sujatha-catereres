import React, { useState } from 'react';
import './DishCard.css';

const DishCard = ({ name, packages, selectedPackage, image, isSelected }) => {
  const [loaded, setLoaded] = useState(false); // Track image load
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
      <div className="dish-image-wrapper">
        {/* Skeleton placeholder */}
        {!loaded && <div className="image-skeleton"></div>}

        {image && (
          <img
            src={image}
            alt={name}
            loading="lazy"
            className={`dish-image ${loaded ? 'visible' : 'hidden'}`}
            onLoad={() => setLoaded(true)}
          />
        )}
      </div>

      <div className="dish-info">
        <h4>{name}</h4>
        {restrictionNote && <span className="tag">{restrictionNote}</span>}
      </div>

      {isSelected && <div className="selected-badge">✓ Selected</div>}
    </div>
  );
};

export default DishCard;
