import React, { useState } from 'react';
import DishCard from './DishCard';
import './CollapsibleMenu.css';
import { useCart } from '../../utils/cartContext';
import { getCategoryLimit } from '../../utils/cartRules';
import { toast } from 'react-toastify';

const CollapsibleMenu = ({ menuData, selectedPackage, selectedMealType }) => {
    const [openCategory, setOpenCategory] = useState(null);
    const { cart, setCategoryItem, removeItemFromCategory } = useCart();

    const toggleCategory = (category) => {
        setOpenCategory((prev) => (prev === category ? null : category));
    };

    const handleItemClick = (category, item) => {
        if (!item.packages.includes(selectedPackage)) {
            toast.error(`"${item.name}" is not available in the "${selectedPackage}" package.`);
            return;
        }

        const limit = getCategoryLimit(selectedMealType, selectedPackage, category);
        const existing = cart[category] || [];

        const isAlreadySelected = existing.some(i => i.name === item.name);

        if (isAlreadySelected) {
            // Deselect
            removeItemFromCategory(category, item.name);
            toast.info(`"${item.name}" removed from "${category}".`);
        } else {
            if (existing.length >= limit) {
                toast.info(`Limit reached for "${category}". Remove an item to add new ones.`);
                return;
            }

            setCategoryItem(category, item, limit);
        }
    };

    return (
        <div className="collapsible-menu">
            <div className="category-header-container">
                {Object.entries(menuData).map(([category, dishes]) => {
                    const limit = getCategoryLimit(selectedMealType, selectedPackage, category);
                    const selectedCount = (cart[category] || []).length;
                    const isComplimentary = category.toLowerCase() === 'complimentary';

                    return (
                        <div
                            key={category}
                            className={`category-header-chip ${openCategory === category ? 'active' : ''}`}
                            onClick={() => toggleCategory(category)}
                        >
                            {isComplimentary
                                ? category.replace(/([A-Z])/g, ' $1').trim()
                                : `${category.replace(/([A-Z])/g, ' $1').trim()} (${selectedCount}/${limit})`
                            }
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
                                    const limit = getCategoryLimit(selectedMealType, selectedPackage, category);
                                    const selectedCount = (cart[category] || []).length;
                                    const isComplementary = category.toLowerCase() === 'complimentary';
                                    const isSelectable = !isComplementary || !!dish.selectableGroup;

                                    const disabled = selectedCount >= limit && !(cart[category] || []).some(i => i.name === dish.name);

                                    return (
                                        <div
                                            key={dish.name}
                                            onClick={() => {
                                                if (!disabled && isSelectable) {
                                                    handleItemClick(category, dish);
                                                }
                                            }}
                                            style={{
                                                cursor: disabled ? 'not-allowed' : 'pointer',
                                                opacity: disabled ? 0.5 : 1,
                                            }}
                                        >
                                            <DishCard
                                                name={dish.name}
                                                packages={dish.packages}
                                                selectedPackage={selectedPackage}
                                                image={dish.image}
                                                isSelected={(cart[category] || []).some(i => i.name === dish.name)}
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
