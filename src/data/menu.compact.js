const img = (name) => `/assets/itemImages/${name}.webp`;

export const MENU = {
  breakfast: {
    idly: [
      { name: "Plain Idly", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("plain-idly") },
      { name: "Masala Idly", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("masala-idly") }
    ],
    vada: [
      { name: "Plain Vada", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("plain-vada") },
      { name: "Masala Vada", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("masala-vada") }
    ],
    pongal: [
      { name: "Plain Pongal", packages: ["Classic", "Premium", "Luxury"], image: img("plain-pongal") },
      { name: "Sweet Pongal", packages: ["Classic", "Premium", "Luxury"], image: img("sweet-pongal") }
    ],
    upma: [
      { name: "Semiya Upma", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("semiya-upma") },
      { name: "Godhuma Ravva Upma", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("godhuma-ravva-upma") },
      { name: "Tomato Bath", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("tomato-bath") }
    ],
    dosa: [
      { name: "Set Dosa", packages: ["Premium", "Luxury"], image: img("set-dosa") },
      { name: "Masala Dosa", packages: ["Premium", "Luxury"], image: img("masala-dosa") },
      { name: "Uthappam", packages: ["Premium", "Luxury"], image: img("uthappam") }
    ],
    mysoreBonda: [
        { name: "Mysore Bonda", packages: ["Luxury"], image: img("alu-bonda") }
    ],
    sweets: [
        { name: "Fruit Kesari", packages: ["Classic", "Premium", "Luxury"], image: img("pine-apple-kesari") },
        { name: "Pineapple Kesari", packages: ["Classic", "Premium", "Luxury"], image: img("pine-apple-kesari") }
    ],
    complimentary: [
      { name: "Allam Chutney", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("junnu"), },
      { name: "Coconut Chutney", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("junnu"),   },
      { name: "Sambar", packages: ["Classic", "Premium", "Luxury"], image: img("sambar") },
      // Selectable for Basic, Classic, Premium
      { name: "Coffee", packages: ["Basic", "Classic", "Premium"], image: img("junnu"), selectableGroup: "drink" },
      { name: "Tea", packages: ["Basic", "Classic", "Premium"], image: img("junnu"), selectableGroup: "drink" },
      // Auto-included for Luxury
      { name: "Coffee", packages: ["Luxury"], image: img("junnu"), autoInclude: true },
      { name: "Tea", packages: ["Luxury"], image: img("junnu"), autoInclude: true },

      { name: "Paper Plates", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("plates") },
      { name: "Glasses", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("glasses") },
      { name: "Water", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("water") },
      { name: "Napkins", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("napkins") }
    ]
  },

  lunchDinner: {
    sweets: [
      { name: "Gulab Jaamun", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("gulab-jamun") },
      { name: "Sorakaya Halwa", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("bottle-guard-halwa") },
      { name: "Kaala Jaamun", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("kala-jamun") },
      { name: "Bread Halwa", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("bread-halwa") },
      { name: "Chakrapongali", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("sweet-pongal") },
      { name: "Semiya Payasam", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("semiya-upma") },
      { name: "Jilebi", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("jilebi") },
      { name: "Bobbatlu", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("bobbatlu") },
      { name: "Carrot & Sorakaya Halwa", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("bottle-guard-halwa") },       
      { name: "Kaaju Barfi", packages: ["Classic", "Premium", "Luxury"], image: img("kaaju-barfi") },
      { name: "Dry Fruit Halwa", packages: ["Classic", "Premium", "Luxury"], image: img("dry-fruits-halwa") },
      { name: "Maalpuri", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("maal-puri") },
      { name: "Poota Rekulu", packages: ["Premium", "Luxury"], image: img("puta-rekulu") },
      { name: "Malai Sandwich", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("malai-sandwich") },
      { name: "Kaaju Roll", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("kaaju-roll") },
      { name: "Pista Roll", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("kaaju-pista-roll") },
      { name: "Pine Apple Kesari", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("pine-apple-kesari") },
      { name: "Eluru Junnu", packages: ["Classic", "Premium", "Luxury"], image: img("junnu") },
      { name: "Halwa Poori", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("halwa-puri") }
    ],

    hotSnacks: [
      { name: "Vegetable Katlet", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("veg-cutlet") },
      { name: "Vankaya Bajji", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("veg-pakoda") },
      { name: "Aloo Bonda", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("alu-bonda") },
      { name: "Masala Vada", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("masala-vada") },
      { name: "Mirapakaya Bajji", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("mirchi-bajji") },
      { name: "Cut Bajji", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("cut-bajji-biryanii") },
      { name: "Mini Aloo Samosa", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("mini-aluu-samosa") },
      { name: "Gaarelu", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("gaarey") },
      { name: "Vegetable Manchurian", packages: ["Classic", "Premium", "Luxury"], image: img("veg-manchuriyan") },
      { name: "Gobi Manchurian", packages: ["Classic", "Premium", "Luxury"], image: img("gobi-manchuriyan") },
      { name: "Paneer Katlet", packages: ["Premium", "Luxury"], image: img("paneer-cutlet") },
      { name: "Chef's Special", packages: ["Premium", "Luxury"], image: img("paneer-cutlet") },
      { name: "Corn Samosa / Roll", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("corn-samosa") },
      { name: "Vegetable Lollipop", packages: ["Classic", "Premium", "Luxury"], image: img("veg-lallipop") },
      { name: "Vegetable Shanghai Roll", packages: ["Classic", "Premium", "Luxury"], image: img("veg-shangaii-roll") },
    ],

    indianBreads: [
      { name: "Pulka", packages: ["Classic", "Premium", "Luxury"], image: img("pulkaa") },
      { name: "Rumaali Roti", packages: ["Classic", "Premium", "Luxury"], image: img("rumali-rotii") },
      { name: "Chapathi", packages: ["Classic", "Premium", "Luxury"], image: img("chapathii") },
      { name: "Plain Kulcha", packages: ["Classic", "Premium", "Luxury"], image: img("plain-kulchaa") },
      { name: "Masala Kulcha", packages: ["Classic", "Premium", "Luxury"], image: img("masala-dosa") },
      { name: "Mini Parota", packages: ["Premium", "Luxury"], image: img("mini-aluu-samosa") },
      { name: "Butter Naan", packages: ["Luxury"], image: img("rumali-rotii") }
    ],


    flavoredRice: [
      { name: "Aavakaya Rice", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("mango-pulihora") },
      { name: "Nimmakaya Pulihora", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("lemon-pulihopra") },
      { name: "Chintapandu Pulihora", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("tamarind-pulihora") },
      { name: "Tomota Rice", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("tomato-rice") },
      { name: "Vegetable Fried Rice", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("veg-fried-rice") },
      { name: "Vegetable Noodles", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("noodles") },
      { name: "Mamidikaya Pulihora", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("mango-pulihora") },
      { name: "Vegetable Biryani", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("veg-biryani") },
      { name: "Kobbari Annam", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("podina-rice") },
      { name: "Pudina Rice", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("podina-rice") },
      { name: "Panasakaaya Biryani", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("jeera-biryanii") },
      { name: "Cut Bajji Biryani", packages: ["Classic", "Premium", "Luxury"], image: img("cut-bajji-biryanii") },
      { name: "Jeera Rice", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("jeera-biryanii") },
      // Exception
      { name: "Ulava Chaaru Biryani", packages: ["Premium", "Luxury"], image: img("ulava-chaaru-biryani") },

      { name: "Karivepaku Rice", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("karivey-paku-rice") }
    ],


    northIndian: [
      { name: "Veg Curry", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("mixed-veg-curry") },

      // Exception
      { name: "Paneer Butter Masala", packages: ["Classic", "Premium", "Luxury"], image: img("paneer-butter-masala") },

      { name: "Palak Paneer", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("palak-paneer") },
      { name: "Capsicum Masala", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("capsicum-masala") },
      { name: "Mixed Veg Curry", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("mixed-veg-curry") },
      { name: "Aloo Gobi Masala", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("alu-gobi-masala") },
      { name: "Aloo Kurma", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("aluu-kurma") },
      { name: "Aloo Capsicum Tomato", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("aluu-capsicum-tamota") },        
      { name: "Veg & Green Peas Kurma", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("veg-green-batany-kurmaa") },   
      { name: "Kadai Vegetable", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("kadaii-vegitable") },
      { name: "Methi Chaman Curry", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("methi-chaman-curry") },
      { name: "BabyCorn Masala", packages: ["Classic", "Premium", "Luxury"], image: img("baby-corn-masala") },
      { name: "Mushroom Masala", packages: ["Classic", "Premium", "Luxury"], image: img("mushroom-masala") },
      { name: "Phool Makhana Curry", packages: ["Classic", "Premium", "Luxury"], image: img("phool-makana-curry") },
      { name: "Navratna Kurma", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("navratnaa-kurmaa") },
      { name: "Milk Maker Kurma", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("mill-maker-kurma") }
    ],
    pappu: [
      { name: "Tomato Pappu", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("gravy-curry") },
      { name: "Aakukura Pappu", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("gravy-curry") },
      { name: "Mamidikaaya Pappu", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("gravy-curry") },
      { name: "Dosakaaya Pappu", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("gravy-curry") }
    ],

    southIndianCurries: [
      { name: "Gutti Vankaya Curry", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("taati-munjala-curry") },
      { name: "Vankaya Tomato Pachi Kaaram Curry", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("taati-munjala-curry") },
      { name: "Drumstick Curry", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("chama-dumpala-pulusu") },
      { name: "Panasa Kaaya Curry", packages: ["Premium", "Luxury"], image: img("chama-dumpala-pulusu") },
      { name: "Mushroom Curry", packages: ["Premium", "Luxury"], image: img("chama-dumpala-pulusu") },
      { name: "Cauliflower Curry", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("cabbage-beans-carrot") },
      { name: "Chikkudukaya Curry", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("cabbage-beans-carrot") },
      { name: "Gongura Phoolmakhana Curry", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("gongura-phool-makani") },  
    ],
    pickles: [
      { name: "Beera Kaaya Pachadi", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("cabbage-beans-carrot") },
      { name: "Gongura Pichadi", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("cabbage-beans-carrot") },
      { name: "Pandu Mirchi Tomato Pachadi", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("gongura-phool-makani") }, 
      { name: "Chintakaya Pachadi", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("gongura-phool-makani") },
      { name: "Dosakaya Pachadi", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("gongura-phool-makani") },
      { name: "JeediPappu Velliulli Pachadi", packages: ["Premium", "Luxury"], image: img("gongura-phool-makani") },
      { name: "Madras Ullipaya Pachadi", packages: ["Premium", "Luxury"], image: img("gongura-phool-makani") },
      { name: "Lemon Pickle", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("gongura-phool-makani") },
      { name: "Cut Mango Pachadi", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("gongura-phool-makani") },
      { name: "Dondakaya Pachadi", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("gongura-phool-makani") },

    ],
    powders: [
      { name: "Pappula Podi", packages: ["Premium", "Luxury"], image: img("gongura-phool-makani") },
      { name: "Karivepaku Podi", packages: ["Premium", "Luxury"], image: img("gongura-phool-makani") },
      { name: "Kobbari Kaaram Podi", packages: ["Premium", "Luxury"], image: img("gongura-phool-makani") },
      { name: "Nellore Kaaram Podi", packages: ["Premium", "Luxury"], image: img("gongura-phool-makani") },
    ],
    southIndianFries: [
      { name: "Dondakaya Fry", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("donda-kaaya-fry") },
      { name: "Aloo Fry", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("aluu-fry") },
      { name: "Cabbage 65", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("cabbage-65") },
      { name: "Vankaaya Pakodi", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("veg-pakoda") },
      { name: "Spicy Gutti-Vankaya", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("hot-green-stuffed-kabab") },      
      { name: "Capsicum 65", packages: ["Classic", "Premium", "Luxury"], image: img("capsicum-65") },
      { name: "Kanda Fry", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("kandha-fry") },
      { name: "Cabbage Beans Carrot Fry", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("cabbage-beans-carrot") },    
      { name: "Thota Kura Liver Fry", packages: ["Classic", "Premium", "Luxury"], image: img("thota-kura-fry") },
      { name: "Aloo 65", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("alu-65") },
      { name: "Gobi 65", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("gobi-65") },
      { name: "Chamadumpala Fry", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("chamadumpala-fry") },
      { name: "Bendakaya Kaju Fry", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("kaaju-bhindi-fry") },
      { name: "Kakarakaaya Fry", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("bottle-guard-halwa") }
    ],

    iceCreams: [
      { name: "Vanilla", packages: ["Classic", "Premium", "Luxury"], image: img("vanilla") },
      { name: "Mango", packages: ["Classic", "Premium", "Luxury"], image: img("mango") },
      { name: "Fruit Punch", packages: ["Classic", "Premium", "Luxury"], image: img("tooty-fruity") },
      { name: "Butterscotch", packages: ["Classic", "Premium", "Luxury"], image: img("butterscotch") },
      { name: "Strawberry", packages: ["Classic", "Premium", "Luxury"], image: img("strawberry") },
      { name: "American Dryfruits", packages: ["Premium", "Luxury"], image: img("strawberry") },
      { name: "Kaju Kismiss", packages: ["Premium", "Luxury"], image: img("strawberry") },
      { name: "Choco nuts", packages: ["Premium", "Luxury"], image: img("strawberry") },
    ],

    paan: [
      { name: "Paan", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("paan") }
    ],

    complimentary: [
      { name: "Plates", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("plates") },
      { name: "Glasses", packages: ["Basic"], image: img("glasses") },
      { name: "Water", packages: ["Basic"], image: img("water") },
      { name: "Water Bottles", packages: ["Classic", "Premium", "Luxury"], image: img("water") },
      { name: "Rice", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("transport") },
      { name: "Sambar", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("transport") },
      { name: "Salt", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("transport") },
      { name: "Ghee", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("transport") },
      { name: "Papad", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("transport") },
      { name: "Curd", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("transport") },
      { name: "Raita", packages: ["Basic", "Classic", "Premium", "Luxury"], image: img("transport") },
      { name: "Supply", packages: ["Premium", "Luxury"], image: img("supply") },
      { name: "Transport", packages: ["Premium", "Luxury"], image: img("transport") }
    ]
  }
};