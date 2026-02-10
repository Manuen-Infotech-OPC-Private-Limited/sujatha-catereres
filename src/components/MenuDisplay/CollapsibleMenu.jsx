import React, { useState, useEffect } from 'react';
import DishCard from './DishCard';
import '../../css/CollapsibleMenu.css';
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
        
        // 🔹 Determine the correct cart key (matches cartContext.js logic)
        const cartKey = (category.toLowerCase() === 'complimentary' && item.selectableGroup)
            ? `Opted-${item.selectableGroup}`
            : category;

        const existing = cart[cartKey] || [];
        const isAlreadySelected = existing.some(i => i.name === item.name);

        if (isAlreadySelected) {
            // Deselect
            removeItemFromCategory(cartKey, item.name);
            toast.info(`"${item.name}" removed from "${category}".`);
        } else {
            // Check cross-category mutual exclusion (Pongal vs Upma)
            if (selectedMealType === "Breakfast") {
                const lowerCat = category.toLowerCase();
                if (lowerCat === 'pongal') {
                    // Check if Upma is selected
                    const upmaSelected = (cart['upma'] || []).length > 0;
                    if (upmaSelected) {
                        toast.warn(`You can choose either Pongal OR Upma, not both.`);
                        return;
                    }
                } else if (lowerCat === 'upma') {
                    // Check if Pongal is selected
                    const pongalSelected = (cart['pongal'] || []).length > 0;
                    if (pongalSelected) {
                        toast.warn(`You can choose either Pongal OR Upma, not both.`);
                        return;
                    }
                }
            }

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
                        label = `${category.replace(/([A-Z])/g, ' $1').trim()} (Select options)`;
                    } else if (limit === 0) {
                        label = `${category.replace(/([A-Z])/g, ' $1').trim()} (Not applicable)`;
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
                        {category.toLowerCase() === 'complimentary' && dishes.some(d => d.selectableGroup === 'drink' && !d.autoInclude) && (
                            <div className="selection-instruction" style={{
                                backgroundColor: '#fff3cd',
                                color: '#856404',
                                padding: '10px',
                                margin: '10px 10px 0',
                                borderRadius: '5px',
                                fontSize: '0.9rem',
                                border: '1px solid #ffeeba'
                            }}>
                                <i className="fas fa-info-circle"></i> Please select either <strong>Tea</strong> or <strong>Coffee</strong> (only one allowed).
                            </div>
                        )}
                        <div className="dish-list-wrapper open">
                            {dishes.length === 0 ? (
                                <p className="empty-category">No items in this category</p>
                            ) : (
                                dishes.map((dish) => {
                                    const limit = getCategoryLimit(selectedMealType, selectedPackage, category);
                                    const isComplimentary = category.toLowerCase() === 'complimentary';
                                    const isSelectable = !isComplimentary || !!dish.selectableGroup;
                                    const isAutoIncluded = dish.autoInclude;
                                    
                                    // 🔹 Determine the correct cart key for selection check
                                    const cartKey = (isComplimentary && dish.selectableGroup)
                                        ? `Opted-${dish.selectableGroup}`
                                        : category;

                                    const selectedItems = cart[cartKey] || [];
                                    const isSelected = selectedItems.some(i => i.name === dish.name);
                                    const selectedCount = selectedItems.length;

                                    const disabled = !isAutoIncluded && selectedCount >= limit && !isSelected;
                                    const isDrink = dish.selectableGroup === 'drink';

                                    return (
                                        <div
                                            key={dish.name}
                                            onClick={() => {
                                                if (!disabled && isSelectable && !isAutoIncluded) {
                                                    handleItemClick(category, dish);
                                                }
                                            }}
                                            style={{
                                                cursor: (disabled || isAutoIncluded) ? 'not-allowed' : 'pointer',
                                                opacity: (disabled) ? 0.5 : 1,
                                            }}
                                        >
                                            <DishCard
                                                name={dish.name}
                                                packages={dish.packages}
                                                selectedPackage={selectedPackage}
                                                image={`${process.env.REACT_APP_API_URL}${dish.image}`}
                                                isSelected={isSelected}
                                                tag={isDrink && !isAutoIncluded ? "Select 1" : null}
                                            />
                                            {isAutoIncluded && (
                                                <div style={{ fontSize: '0.8rem', color: 'green', textAlign: 'center' }}>
                                                    Included
                                                </div>
                                            )}
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