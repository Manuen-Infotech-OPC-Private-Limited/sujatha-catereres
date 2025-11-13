// utils/cartRules.js

export function getCategoryLimit(mealType, selectedPackage, category) {
  // if (category === 'complimentary') return 2;

  // Breakfast rules
  if (mealType === "Breakfast") {
    // Every item type in breakfast is limited to 1
    return 1;
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
    },
    Classic: {
      sweets: 2,
      // hotsnacks: 1,
      // indianbreads: 1, // all allowed except mini parotta
      // flavoredrice: 1,
      // northindian: 1,
      // southindian: 1,
      // fries: 1,
      // icecreams: 1,
      paan: 0,
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
    }
  };

  const lowerCategory = category.toLowerCase();
  console.log(`Mealtype: ${mealType}\nselected Package: ${selectedPackage}\nCategory: ${lowerCategory} \n Rules are: ${rules[selectedPackage]?.[lowerCategory]}`)
  return rules[selectedPackage]?.[lowerCategory] ?? 1;
}


