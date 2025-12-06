export function getCategoryLimit(mealType, selectedPackage, category) {
  // Breakfast rules
  if (mealType === "Breakfast") {
    if (category.toLowerCase() === 'complimentary') {
      return 0;
    }

    // Allowed items per package
    const breakfastItems = {
      Basic: ['idly', 'vada', 'upma'],
      Classic: ['idly', 'vada', 'pongal'],
      Premium: ['idly', 'vada', 'pongal', 'dosa'],
      Luxury: ['idly', 'vada', 'pongal', 'dosa', 'upma'],
    };

    const allowedItems = breakfastItems[selectedPackage] || [];

    // If the category/item is in the allowed list, limit is 1, else 0
    return allowedItems.includes(category.toLowerCase()) ? 1 : 0;
  }

  // Lunch & Dinner rules
  const rules = {
    Basic: {
      sweets: 1,
      hotsnacks: 1,
      indianbreads: 0,
      flavoredrice: 1,
      northindian: 1,
      southindian: 1,
      fries: 1,
      icecreams: 0,
      paan: 0,
      complimentary: 0,
    },
    Classic: {
      sweets: 2,
      paan: 0,
      complimentary: 0,
    },
    Premium: {
      sweets: 2,
      hotsnacks: 2,
      indianbreads: 2,
      flavoredrice: 2,
      northindian: 2,
      southindian: 2,
      fries: 2,
      icecreams: 2,
      paan: 1,
      complimentary: 0,
    },
    Luxury: {
      sweets: 3,
      hotsnacks: 3,
      indianbreads: 2,
      flavoredrice: 2,
      northindian: 2,
      southindian: 2,
      fries: 2,
      icecreams: 2,
      paan: 1,
      complimentary: 0,
    }
  };

  const lowerCategory = category.toLowerCase();
  return rules[selectedPackage]?.[lowerCategory] ?? 1;
}
