
export function getEligibleItems(mealType, selectedPackage, menuData) {
    if (mealType === "Breakfast") {
        const allowed = {
            // Basic: ["idly", "vada", "upma", "complimentary"],
            Classic: ["idly", "vada", "pongal", "complimentary"],
            Premium: ["idly", "vada", "dosa", "pongal", "complimentary"],
            Luxury: null, // Luxury = all items
        };

        const allowedKeys = allowed[selectedPackage];
        if (!allowedKeys) return menuData; // Luxury = no filtering

        // breakfast has categories like { idly: [...], vada: [...], upma: [...] }
        return Object.fromEntries(
            Object.entries(menuData).filter(([key]) => allowedKeys.includes(key))
        );
    }

    if (["Lunch", "Dinner"].includes(mealType)) {
        let filtered = { ...menuData };

        if (selectedPackage === "Basic") {
            // Remove breads and paan
            delete filtered.indianbreads;
            delete filtered.paan;

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
        }

        return filtered;
    }

    return menuData;
}
