import React, { useState } from 'react';
import DishCard from './DishCard';
import './CollapsibleMenu.css';
import { useCart } from '../../utils/cartContext';
import { getCategoryLimit } from '../../utils/cartRules';
import { toast } from 'react-toastify';
const CollapsibleMenu = ({ menuData, selectedPackage, selectedMealType }) => {
    const [openCategory, setOpenCategory] = useState(null);
    const { setCategoryItem } = useCart();

    const toggleCategory = (category) => {
        setOpenCategory((prev) => (prev === category ? null : category));
    };

    const handleItemClick = (category, item) => {
        // Check if item is available for the selected package
        if (!item.packages.includes(selectedPackage)) {
            // Optionally, show a toast or just ignore silently
            toast.error(`"${item.name}" is not available in the "${selectedPackage}" package.`);
            return;
        }

        const limit = getCategoryLimit(selectedMealType, selectedPackage, category);
        setCategoryItem(category, item, limit);
    };


    return (
        <div className="collapsible-menu">
            <div className="category-header-container">
                {Object.entries(menuData).map(([category]) => {
                    const limit = getCategoryLimit(selectedMealType, selectedPackage, category);

                    return (
                        <div
                            key={category}
                            className={`category-header-chip ${openCategory === category ? 'active' : ''}`}
                            onClick={() => toggleCategory(category)}
                        >
                            {category.replace(/([A-Z])/g, ' $1')} ({limit ?? 0})
                        </div>
                    );
                })}
            </div>

            {Object.entries(menuData).map(([category, dishes]) =>
                openCategory === category ? (
                    <div key={category} className="category">
                        <div className="dish-list-wrapper open">
                            {dishes.length === 0 ? (
                                <p className="empty-category">No items in this category</p>
                            ) : (
                                dishes.map((dish) => {
                                    const isComplementary = category.toLowerCase() === 'complimentary';
                                    const isSelectable = isComplementary && !!dish.selectableGroup;

                                    return (
                                        <div
                                            key={dish.name}
                                            onClick={() => {
                                                if (!isComplementary || isSelectable) {
                                                    handleItemClick(category, dish);
                                                }
                                            }}
                                            style={{ cursor: isSelectable ? 'pointer' : 'default', }}
                                        >
                                            <DishCard
                                                name={dish.name}
                                                packages={dish.packages}
                                                selectedPackage={selectedPackage}
                                                image={dish.image}
                                            />
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                ) : null
            )}
        </div>
    );
};

export default CollapsibleMenu;
