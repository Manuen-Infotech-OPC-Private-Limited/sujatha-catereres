import React from 'react';
import '../css/PackageSelector.css';

const packages = ['Basic', 'Classic', 'Premium', 'Luxury'];

const PackageSelector = ({ selectedPackage, onSelect }) => {
  return (
    <div className="package-selector">
      <h3>Package</h3>
      <div className="package-buttons">
        {packages.map((pkg) => (
          <button
            key={pkg}
            className={pkg === selectedPackage ? 'active' : ''}
            onClick={() => onSelect(pkg)}
          >
            {pkg}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PackageSelector;
