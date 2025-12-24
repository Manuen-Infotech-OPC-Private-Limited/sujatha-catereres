import React, { useState, useEffect } from 'react';
import DishCard from './DishCard';
import './CollapsibleMenu.css';
import { useCart } from '../../utils/cartContext';
import { getCategoryLimit } from '../../utils/cartRules';
import { toast } from 'react-toastify';

const CollapsibleMenu = ({ menuData, selectedPackage, selectedMealType }) => {
    const [openCategory, setOpenCategory] = useState(
        () => localStorage.getItem("openCategory") || null
    );
    const { cart, setCategoryItem, removeItemFromCategory } = useCart();

    // UPDATE LOCAL STORAGE WHEN CATEGORY CHANGES
    const toggleCategory = (category) => {
        setOpenCategory((prev) => {
            const newValue = prev === category ? null : category;
            localStorage.setItem("openCategory", newValue ?? "");
            return newValue;
        });
    };
    // CLEAR OPEN CATEGORY IF IT DOESN'T EXIST ANYMORE IN MENUDATA
    useEffect(() => {
        const availableCategories = Object.keys(menuData);
        if (!availableCategories.includes(openCategory)) {
            setOpenCategory(null);
            localStorage.removeItem("openCategory");
        }
    }, [menuData, openCategory]);

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

                    let label;
                    if (isComplimentary) {
                        label = `${category.replace(/([A-Z])/g, ' $1').trim()} (automatically selected)`;
                    } else if (limit === 0) {
                        label = `${category.replace(/([A-Z])/g, ' $1').trim()} (Not applicable in this package)`;
                    } else {
                        label = `${category.replace(/([A-Z])/g, ' $1').trim()} (${selectedCount} out of ${limit} selected)`;
                    }

                    return (
                        <div
                            key={category}
                            className={`category-header-chip ${openCategory === category ? 'active' : ''}`}
                            onClick={() => toggleCategory(category)}
                        >
                            {label}
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
                                    const isComplimentary = category.toLowerCase() === 'complimentary';
                                    const isSelectable = !isComplimentary || !!dish.selectableGroup;

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
                                                // image={dish.image}
                                                image={`${process.env.REACT_APP_API_URL}${dish.image}`}
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
