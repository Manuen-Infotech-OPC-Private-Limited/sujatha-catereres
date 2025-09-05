// utils/cartRules.js

export function getCategoryLimit(mealType, selectedPackage, category) {
  if (category === 'complimentary') return 2;

  if (mealType === 'Breakfast') {
    return 1;
    // if (selectedPackage === "Basic"){

    // }
  }

  const rules = {
    Basic: {
      sweets: 1,
      'hotsnacks': 1,
      'flavoredrice': 1,
      'dosa':0,
      'pongal':0,

    },
    Classic: {
      sweets: 2,
      'hotsnacks': 1,
      'flavoredrice': 1
    },
    Premium: {
      sweets: 2,
      'hotsnacks': 2,
      'flavoredrice': 2,
      'northindian': 2,
    },
    Luxury: {
      sweets: 3,
      'hotsnacks': 2,
      'flavoredrice': 2
    }
  };

  const lowerCategory = category.toLowerCase();
  console.log(`Mealtype: ${mealType}\nselected Package: ${selectedPackage}\nCategory: ${lowerCategory} \n Rules are: ${rules[selectedPackage]?.[lowerCategory]}`)
  return rules[selectedPackage]?.[lowerCategory] || 1;
}
