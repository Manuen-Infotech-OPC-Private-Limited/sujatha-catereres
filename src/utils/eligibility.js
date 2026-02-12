
export function getEligibleItems(mealType, selectedPackage, menuData) {
    if (mealType === "Breakfast") {
        const allowed = {
            Basic: ["idly", "vada", "upma", "complimentary"],
            Classic: ["idly", "vada", "pongal", "upma", "sweets", "complimentary"],
            Premium: ["idly", "vada", "pongal", "upma", "dosa", "sweets", "complimentary"],
            Luxury: null, // Luxury = all items (includes mysoreBonda)
        };

        const allowedKeys = allowed[selectedPackage];

        // 1. Determine eligible categories
        let filteredEntries = Object.entries(menuData);

        if (allowedKeys) {
            filteredEntries = filteredEntries.filter(([key]) => allowedKeys.includes(key));
        }

        // 2. Filter items within those categories to match selectedPackage
        // This prevents duplicates where we have two "Coffee" entries (one for Basic, one for Luxury)
        const finalMenu = {};

        filteredEntries.forEach(([category, items]) => {
            // Filter the array of items
            const pkgItems = items.filter(item => item.packages.includes(selectedPackage));

            // Only add category if it has items (optional, but cleaner)
            if (pkgItems.length > 0 || category === 'complimentary') {
                finalMenu[category] = pkgItems;
            }
        });

        return finalMenu;
    }

    if (["Lunch", "Dinner"].includes(mealType)) {
        let filtered = { ...menuData };

        if (selectedPackage === "Basic") {
            // Remove breads and paan
            delete filtered.indianbreads;
            delete filtered.paan;

            // Remove icecreams if not allowed (checking previous rules, Basic usually didn't have ice creams)
            delete filtered.icecreams;

            // Remove powders if not allowed
            delete filtered.powders;

            // Restrict fries → only aloo fry, dondakaya fry
            if (filtered.fries) {
                filtered.fries = filtered.fries.filter(i =>
                    ["aloo fry", "dondakaya fry"].includes(i.key)
                );
            }
        }

        if (selectedPackage === "Classic") {
            // Exclude mini parotta from breads
            if (filtered.indianbreads) {
                filtered.indianbreads = filtered.indianbreads.filter(i => i.key !== "mini parotta");
            }
            delete filtered.powders;
            delete filtered.paan;
        }

        return filtered;
    }

    return menuData;
}
