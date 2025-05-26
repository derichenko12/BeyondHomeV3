export interface FoodProductionOption {
  feasibility: "recommended" | "challenging" | "not_recommended";
  description: string;
  setupCost: number; // in euros
  annualMaintenance: number; // in euros/year
}

export interface SubregionFoodProduction {
  vegetableGarden: FoodProductionOption;
  foodForest: FoodProductionOption;
  greenhouse: FoodProductionOption;
  fruitOrchard: FoodProductionOption;
  poultry: FoodProductionOption;
  beekeeping: FoodProductionOption;
  dairy: FoodProductionOption;
}

export interface Subregion {
  id: string;
  name: string;
  country: string;
  region: string;
  landscape: string[];
  climate: string[];
  energy: string[];
  description: string;
  vegetables: string[];
  fruitsAndNuts: string[];
  otherFoodProduction: string[];
  rainfall: number;
  averagePricePerSqm: number;
  buildingLicensePercent: number;
  foodProduction: SubregionFoodProduction; // New field
}

export const subregionsData: Subregion[] = [
  {
    id: "andalusia",
    name: "Andalusia",
    country: "Spain",
    region: "Southern Europe",
    landscape: ["Mountains", "Coastline", "Meadow"],
    climate: ["Sufficient Sun", "Mild"],
    energy: ["High Solar"],
    description: `Hottest summers in Europe & mild winters. Get's really dry for long times, so one must to think strategically about water & irrigation resources. Historically, people have grown lots of olives here. It is an interesting region for hikes. You have both snowy mountains, some lush forests, deserts and beautiful beaches. In spring hills gets covered with lavander and poppy.
  
  Traditional white Spanish villages, lots of Flamenco and a really slow-paced life. White-stone houses, flat roofs. In big cities like Granada, Cordova, Sevilla you'll see a lot of ancient Moorish architecture.`,
    vegetables: ["Tomatoes", "Peppers", "Eggplant", "Zucchini"],
    fruitsAndNuts: ["Olives", "Citrus", "Almonds", "Pomegranates", "Avocados"],
    otherFoodProduction: ["Honey"],
    rainfall: 400,
    averagePricePerSqm: 4,
    buildingLicensePercent: 15,
    foodProduction: {
      vegetableGarden: {
        feasibility: "challenging",
        description:
          "Requires careful water management and irrigation systems due to long dry periods. Best with drought-resistant varieties and mulching.",
        setupCost: 3000,
        annualMaintenance: 800,
      },
      foodForest: {
        feasibility: "recommended",
        description:
          "Perfect for Mediterranean food forests with olives, almonds, carobs, and drought-adapted plants. Traditional and highly productive.",
        setupCost: 5000,
        annualMaintenance: 500,
      },
      greenhouse: {
        feasibility: "recommended",
        description:
          "Excellent for water conservation and protecting from extreme summer heat. Extends growing season for winter vegetables.",
        setupCost: 8000,
        annualMaintenance: 600,
      },
      fruitOrchard: {
        feasibility: "recommended",
        description:
          "Ideal for citrus, olives, almonds, pomegranates. Traditional systems are proven over centuries.",
        setupCost: 4000,
        annualMaintenance: 700,
      },
      poultry: {
        feasibility: "recommended",
        description:
          "Works well with shade structures for hot summers. Chickens help with pest control in orchards.",
        setupCost: 2000,
        annualMaintenance: 1200,
      },
      beekeeping: {
        feasibility: "recommended",
        description:
          "Excellent with wild herbs, almond blossoms, and citrus. Long flowering season produces unique honey.",
        setupCost: 1500,
        annualMaintenance: 300,
      },
      dairy: {
        feasibility: "challenging",
        description:
          "Goats better suited than cows due to water scarcity. Need good shade and water management systems.",
        setupCost: 10000,
        annualMaintenance: 3000,
      },
    },
  },
  {
    id: "asturias",
    name: "Asturias",
    country: "Spain",
    region: "Southern Europe",
    landscape: ["Mountains", "Forests", "Rivers", "Coastline"],
    climate: ["Cloudy", "Mild"],
    energy: ["High Wind", "Hydroelectric Potential"],
    description: `Fishing villages, green cliffs drop into the Atlantic. Lot's of beautiful hidden beaches, secluded coves. Lush ancient forests and high misty mountains. A paradise for outdoors enthusiasts and surfers. Many places have saved its authenticity because of lack of tourists, unlike other regions. Also, really affordable cities, especially compared to Madrid or Barcelona.
  
  Stone cottages & wooden barns designed to last long in a humid environment. Organic & natural ingredients is not a trend but a normality. Also great apple cider and cheese is produced here.`,
    vegetables: ["Vegetables"],
    fruitsAndNuts: ["Apples"],
    otherFoodProduction: ["Dairy"],
    rainfall: 1100,
    averagePricePerSqm: 4,
    buildingLicensePercent: 11,
    foodProduction: {
      vegetableGarden: {
        feasibility: "recommended",
        description:
          "Excellent conditions with abundant rainfall. Perfect for leafy greens, brassicas, and root vegetables year-round.",
        setupCost: 2000,
        annualMaintenance: 500,
      },
      foodForest: {
        feasibility: "recommended",
        description:
          "Ideal for temperate food forests with apples, hazelnuts, chestnuts, and abundant berry bushes.",
        setupCost: 4000,
        annualMaintenance: 400,
      },
      greenhouse: {
        feasibility: "challenging",
        description:
          "Less necessary due to mild climate, but useful for tomatoes and peppers which struggle outdoors.",
        setupCost: 6000,
        annualMaintenance: 500,
      },
      fruitOrchard: {
        feasibility: "recommended",
        description:
          "Excellent for apples and traditional cider production. Natural conditions create high-quality fruit.",
        setupCost: 3500,
        annualMaintenance: 600,
      },
      poultry: {
        feasibility: "recommended",
        description:
          "Ideal conditions with natural forage and mild temperatures. Free-range systems thrive here.",
        setupCost: 1800,
        annualMaintenance: 1000,
      },
      beekeeping: {
        feasibility: "challenging",
        description:
          "Possible but frequent rain limits flying days. Need weather-resistant hives and good management.",
        setupCost: 1800,
        annualMaintenance: 400,
      },
      dairy: {
        feasibility: "recommended",
        description:
          "Traditional dairy region with lush pastures. Perfect for cows and artisanal cheese production.",
        setupCost: 15000,
        annualMaintenance: 4000,
      },
    },
  },
  {
    id: "algarve",
    name: "Algarve",
    country: "Portugal",
    region: "Southern Europe",
    landscape: ["Coastline", "Meadow", "Rivers"],
    climate: ["Sufficient Sun", "Mild"],
    energy: ["High Solar", "High Wind"],
    description: `Dramatic cliffs and golden beaches on south of Portugal. Lot's of festivals, organic markets and eco-communities. Higher in the mountains people hike in lush green forests & limestone formations, as well as and swim in natural springs.
  
  On the west is Costa Vicentina, which is a nice destination for surfers across Europe. Lagos and Tavira became popular destination for expats who got tired from Lisbon. Cafes and spaces for fast internet and affordable prices. Across the region there is a lot of permacultural projects and a place seems to be vibrant with community. Whitewashed houses with tiled roofs and Portuguese tiles.`,
    vegetables: [],
    fruitsAndNuts: [
      "Citrus",
      "Olives",
      "Almonds",
      "Figs",
      "Avocados",
      "Pomegranates",
      "Grapes",
    ],
    otherFoodProduction: [],
    rainfall: 600,
    averagePricePerSqm: 6,
    buildingLicensePercent: 14,
    foodProduction: {
      vegetableGarden: {
        feasibility: "recommended",
        description:
          "Good conditions with proper irrigation. Winter growing season excellent, summer needs shade and water.",
        setupCost: 2800,
        annualMaintenance: 700,
      },
      foodForest: {
        feasibility: "recommended",
        description:
          "Excellent for diverse Mediterranean food forest. Figs, carobs, citrus create productive layers.",
        setupCost: 5200,
        annualMaintenance: 550,
      },
      greenhouse: {
        feasibility: "challenging",
        description:
          "Useful for summer shade and water conservation, less critical than in colder climates.",
        setupCost: 7500,
        annualMaintenance: 550,
      },
      fruitOrchard: {
        feasibility: "recommended",
        description:
          "Perfect for citrus, avocados, tropical fruits. Coastal influence prevents frost damage.",
        setupCost: 4500,
        annualMaintenance: 750,
      },
      poultry: {
        feasibility: "recommended",
        description:
          "Excellent conditions year-round. Chickens help control pests in orchards naturally.",
        setupCost: 2100,
        annualMaintenance: 1100,
      },
      beekeeping: {
        feasibility: "recommended",
        description:
          "Thriving conditions with wildflowers, citrus, and herbs. Produces distinctive regional honey.",
        setupCost: 1600,
        annualMaintenance: 320,
      },
      dairy: {
        feasibility: "challenging",
        description:
          "Better suited for goats than cows. Summer heat requires careful management and shade.",
        setupCost: 11000,
        annualMaintenance: 3200,
      },
    },
  },
  {
    id: "northern-portugal",
    name: "Northern Portugal",
    country: "Portugal",
    region: "Southern Europe",
    landscape: ["Mountains", "Forests", "Rivers", "Meadow", "Lakes"],
    climate: ["Cloudy", "Mild"],
    energy: ["High Wind", "Hydroelectric Potential"],
    description: `Green valleys, misty mountains, and old stone villages. Vineyards along the river produce Port wine. Small villages with cobblestone streets and local markets selling fresh dairy, chestnuts, and honey. There is a National Park with wild horses, oak forests, and waterfalls. Organic farms and permaculture projects are also growing here.`,
    vegetables: ["Root Vegetables"],
    fruitsAndNuts: ["Olives", "Grapes", "Apples", "Pears"],
    otherFoodProduction: [],
    rainfall: 800,
    averagePricePerSqm: 6,
    buildingLicensePercent: 12,
    foodProduction: {
      vegetableGarden: {
        feasibility: "recommended",
        description:
          "Excellent for year-round production. Traditional terraced gardens work well on slopes.",
        setupCost: 2200,
        annualMaintenance: 550,
      },
      foodForest: {
        feasibility: "recommended",
        description:
          "Perfect mix of Mediterranean and temperate species. Chestnuts, walnuts, and fruit trees thrive.",
        setupCost: 4300,
        annualMaintenance: 450,
      },
      greenhouse: {
        feasibility: "challenging",
        description:
          "Helpful for starting seeds and growing heat-loving crops, but not essential.",
        setupCost: 6500,
        annualMaintenance: 520,
      },
      fruitOrchard: {
        feasibility: "recommended",
        description:
          "Traditional fruit growing region. Excellent for grapes, apples, pears, and stone fruits.",
        setupCost: 3800,
        annualMaintenance: 650,
      },
      poultry: {
        feasibility: "recommended",
        description:
          "Ideal conditions with natural forage. Traditional free-range systems common.",
        setupCost: 1900,
        annualMaintenance: 1050,
      },
      beekeeping: {
        feasibility: "recommended",
        description:
          "Good conditions with mountain wildflowers and fruit blossoms. Quality honey production.",
        setupCost: 1700,
        annualMaintenance: 350,
      },
      dairy: {
        feasibility: "recommended",
        description:
          "Good pastures support small-scale dairy. Traditional cheese-making culture.",
        setupCost: 13000,
        annualMaintenance: 3600,
      },
    },
  },
  {
    id: "provence",
    name: "Provence",
    country: "France",
    region: "Western Europe",
    landscape: ["Mountains", "Meadow", "Rivers", "Coastline", "Lakes"],
    climate: ["Sufficient Sun", "Mild"],
    energy: [],
    description: `It's not just lavender fields, and olives. And village life is still very active here — many make press their own oil, bake the bread, locals drink espresso and read the newspaper in the morning. Stone walls help to keep out the summer heat, and small windows hold the warmth during winter. Younger people come here to learn to build and make things. Some create eco-farms, co-living spaces. It is also an active place that looks for volunteers. There are many places to stay for free at Workaway.
  
  Overall it's a very nice place, but kind of pricey.`,
    vegetables: [],
    fruitsAndNuts: [
      "Olives",
      "Grapes",
      "Almonds",
      "Figs",
      "Apricots",
      "Peaches",
    ],
    otherFoodProduction: [],
    rainfall: 700,
    averagePricePerSqm: 12,
    buildingLicensePercent: 15,
    foodProduction: {
      vegetableGarden: {
        feasibility: "recommended",
        description:
          "Classic Mediterranean garden paradise. Traditional techniques perfected over centuries.",
        setupCost: 3000,
        annualMaintenance: 700,
      },
      foodForest: {
        feasibility: "recommended",
        description:
          "Perfect for Mediterranean food forest with olives, figs, grapes, and aromatic herbs layers.",
        setupCost: 5500,
        annualMaintenance: 600,
      },
      greenhouse: {
        feasibility: "challenging",
        description:
          "Less necessary due to favorable climate, mainly useful for early season starts.",
        setupCost: 7000,
        annualMaintenance: 500,
      },
      fruitOrchard: {
        feasibility: "recommended",
        description:
          "Ideal for stone fruits, grapes, olives. Traditional systems highly productive.",
        setupCost: 5000,
        annualMaintenance: 800,
      },
      poultry: {
        feasibility: "recommended",
        description:
          "Excellent conditions with natural forage among herbs. Traditional free-range systems.",
        setupCost: 2200,
        annualMaintenance: 1100,
      },
      beekeeping: {
        feasibility: "recommended",
        description:
          "Famous for lavender honey. Exceptional conditions with aromatic herbs.",
        setupCost: 1800,
        annualMaintenance: 350,
      },
      dairy: {
        feasibility: "challenging",
        description:
          "Possible with goats, especially in higher elevations. Summer heat requires management.",
        setupCost: 12000,
        annualMaintenance: 3500,
      },
    },
  },
  {
    id: "brittany",
    name: "Brittany",
    country: "France",
    region: "Western Europe",
    landscape: ["Meadow", "Coastline", "Forests", "Rivers", "Lakes"],
    climate: ["Cloudy", "Mild"],
    energy: [],
    description:
      "Brittany is a nice northwest coastline. It's quite harsh and raw, a bit wild & untamed here. Waves hit the jagged cliffs and epic lighthouses stand on top of them. No meditarian resorts for pussies, only fisherman huts, mythical forests, and old way of doing things. And huge boulders. Definitely not a place for everyone. But all this harshness gives a special nutrition value to the food that grows here.",
    vegetables: [
      "Cabbage",
      "Artichokes",
      "Cauliflower",
      "Potatoes",
      "Vegetables",
    ],
    fruitsAndNuts: [],
    otherFoodProduction: ["Dairy"],
    rainfall: 1100,
    averagePricePerSqm: 6,
    buildingLicensePercent: 13,
    foodProduction: {
      vegetableGarden: {
        feasibility: "recommended",
        description:
          "Excellent for cool-season crops. Famous for artichokes, cauliflower, and early potatoes.",
        setupCost: 2300,
        annualMaintenance: 600,
      },
      foodForest: {
        feasibility: "challenging",
        description:
          "Limited by wind and salt spray near coast. Inland areas better for hardy fruits and nuts.",
        setupCost: 4200,
        annualMaintenance: 500,
      },
      greenhouse: {
        feasibility: "recommended",
        description:
          "Very useful for wind protection and season extension. Polytunnels popular here.",
        setupCost: 8000,
        annualMaintenance: 650,
      },
      fruitOrchard: {
        feasibility: "challenging",
        description:
          "Apples possible inland, but coastal winds challenging. Need windbreaks and hardy varieties.",
        setupCost: 4000,
        annualMaintenance: 700,
      },
      poultry: {
        feasibility: "recommended",
        description:
          "Hardy breeds do well. Need good shelter from Atlantic storms.",
        setupCost: 2100,
        annualMaintenance: 1150,
      },
      beekeeping: {
        feasibility: "challenging",
        description:
          "Possible but challenging with frequent rain and wind. Need sheltered locations.",
        setupCost: 1900,
        annualMaintenance: 420,
      },
      dairy: {
        feasibility: "recommended",
        description:
          "Traditional dairy region with excellent pastures. Famous for butter and cheese.",
        setupCost: 16000,
        annualMaintenance: 4200,
      },
    },
  },
  {
    id: "bavaria",
    name: "Bavaria",
    country: "Germany",
    region: "Western Europe",
    landscape: ["Mountains", "Meadow", "Forests", "Lakes"],
    climate: ["Sufficient Sun", "Cold Winters"],
    energy: ["High Wind", "Hydroelectric Potential"],
    description:
      "Picture Alps, crystal-clear lakes, highland forests and thick stone walls of the farmhouses in the valley. Peace and tranquility. It is a place where sustainability became integrated into local life long before it became trendy. It is place filled with deep respect for the nature and each other. Cold winters and mountain climate taught local communities to rely on themselves and design stable homestead systems. It will suit for those who find mountains to be a crystal-clear source of inspiration. The region also serves as a great source of inspiration of mature, well-designed living systems, often based on traditional crafts.",
    vegetables: ["Root Vegetables", "Cabbage"],
    fruitsAndNuts: ["Apples", "Berries"],
    otherFoodProduction: ["Dairy", "Honey"],
    rainfall: 1800,
    averagePricePerSqm: 12,
    buildingLicensePercent: 12,
    foodProduction: {
      vegetableGarden: {
        feasibility: "challenging",
        description:
          "Short growing season requires cold-hardy varieties and season extension. Focus on storage crops.",
        setupCost: 2500,
        annualMaintenance: 600,
      },
      foodForest: {
        feasibility: "challenging",
        description:
          "Limited to cold-hardy species like apples, pears, hazelnuts, and berry bushes.",
        setupCost: 4500,
        annualMaintenance: 500,
      },
      greenhouse: {
        feasibility: "recommended",
        description:
          "Essential for extending short season. Well-insulated structures with thermal mass needed.",
        setupCost: 12000,
        annualMaintenance: 800,
      },
      fruitOrchard: {
        feasibility: "recommended",
        description:
          "Traditional apple and pear region. Cold winters provide necessary chill hours for fruit.",
        setupCost: 4000,
        annualMaintenance: 700,
      },
      poultry: {
        feasibility: "recommended",
        description:
          "Hardy breeds thrive. Need insulated coops for winter protection from snow and cold.",
        setupCost: 2500,
        annualMaintenance: 1300,
      },
      beekeeping: {
        feasibility: "recommended",
        description:
          "Strong tradition of beekeeping. Alpine flowers produce exceptional honey varieties.",
        setupCost: 2000,
        annualMaintenance: 400,
      },
      dairy: {
        feasibility: "recommended",
        description:
          "Traditional dairy region with alpine pastures. Excellent for cheese production year-round.",
        setupCost: 20000,
        annualMaintenance: 5000,
      },
    },
  },
  {
    id: "brandenburg",
    name: "Brandenburg",
    country: "Germany",
    region: "Western Europe",
    landscape: ["Meadow", "Forests", "Rivers", "Lakes"],
    climate: ["Cloudy", "Cold Winters"],
    energy: ["High Wind", "Hydroelectric Potential"],
    description:
      "First thing you need to know about this region — it is a place with a really cheap land. First it seems flat and empty, but with enough research one will discover just how many eco-hubs and permaculture projects are around here. It is a true playground for any homestead enthusiast or eco-entrepreneur. Young people go there to find & build communities. It is also pretty close to Berlin, so why don't give it a shot?",
    vegetables: ["Vegetables"],
    fruitsAndNuts: [],
    otherFoodProduction: [],
    rainfall: 650,
    averagePricePerSqm: 4,
    buildingLicensePercent: 11,
    foodProduction: {
      vegetableGarden: {
        feasibility: "recommended",
        description:
          "Good for root vegetables and brassicas. Sandy soils need organic matter improvement.",
        setupCost: 2200,
        annualMaintenance: 550,
      },
      foodForest: {
        feasibility: "challenging",
        description:
          "Limited species selection due to climate. Focus on hardy nuts, apples, and berries.",
        setupCost: 4000,
        annualMaintenance: 450,
      },
      greenhouse: {
        feasibility: "recommended",
        description:
          "Very useful for extending season. Popular in eco-communities for year-round production.",
        setupCost: 10000,
        annualMaintenance: 700,
      },
      fruitOrchard: {
        feasibility: "challenging",
        description:
          "Limited to hardy varieties like apples and pears. Need wind protection.",
        setupCost: 3500,
        annualMaintenance: 650,
      },
      poultry: {
        feasibility: "recommended",
        description:
          "Works well with proper housing. Many permaculture projects successfully include chickens.",
        setupCost: 2000,
        annualMaintenance: 1200,
      },
      beekeeping: {
        feasibility: "recommended",
        description:
          "Good conditions with forest flowers and agricultural crops. Growing beekeeping community.",
        setupCost: 1600,
        annualMaintenance: 350,
      },
      dairy: {
        feasibility: "challenging",
        description:
          "Possible but requires infrastructure. Better for small-scale goat operations.",
        setupCost: 12000,
        annualMaintenance: 3800,
      },
    },
  },
  {
    id: "carinthia",
    name: "Carinthia",
    country: "Austria",
    region: "Central Europe",
    landscape: ["Mountains", "Forests", "Lakes", "Meadow"],
    climate: ["Sufficient Sun", "Cold Winters"],
    energy: ["High Solar", "Hydroelectric Potential"],
    description:
      "This is a home to Sepp Holzer's Krameterhof — a high-altitude farm that is built on the principles of permaculture. It was a proof that well-designed regenerative systems can thrive and provide a lot of food even in Alpine terrain. The region is warmer than Bavaria, with diverse nature. You'll see deep-blue lakes, lush forests. Clear mountain streams in spring, so drought never happens in this place.",
    vegetables: ["Root Vegetables", "Cabbage"],
    fruitsAndNuts: ["Apples", "Pears", "Plums", "Berries"],
    otherFoodProduction: ["Dairy"],
    rainfall: 1200,
    averagePricePerSqm: 10,
    buildingLicensePercent: 12,
    foodProduction: {
      vegetableGarden: {
        feasibility: "recommended",
        description:
          "Proven possible at altitude with proper design. Raised beds and microclimates essential.",
        setupCost: 2600,
        annualMaintenance: 620,
      },
      foodForest: {
        feasibility: "recommended",
        description:
          "Sepp Holzer proved food forests work here. Focus on microclimates and hardy species.",
        setupCost: 4800,
        annualMaintenance: 520,
      },
      greenhouse: {
        feasibility: "recommended",
        description:
          "Very beneficial for season extension. Earth-sheltered designs work exceptionally well.",
        setupCost: 11000,
        annualMaintenance: 750,
      },
      fruitOrchard: {
        feasibility: "recommended",
        description:
          "Excellent for apples, pears, plums. Use slopes for frost protection and sun exposure.",
        setupCost: 4200,
        annualMaintenance: 720,
      },
      poultry: {
        feasibility: "recommended",
        description:
          "Work well with proper shelter. Mobile coops useful for pasture management.",
        setupCost: 2400,
        annualMaintenance: 1250,
      },
      beekeeping: {
        feasibility: "recommended",
        description:
          "Mountain flowers produce exceptional honey. Need wind-protected locations.",
        setupCost: 1900,
        annualMaintenance: 380,
      },
      dairy: {
        feasibility: "recommended",
        description:
          "Traditional alpine dairy region. Excellent summer pastures and hay quality.",
        setupCost: 18000,
        annualMaintenance: 4600,
      },
    },
  },
  {
    id: "south-bohemia",
    name: "South Bohemia",
    country: "Czech Republic",
    region: "Central Europe",
    landscape: ["Forests", "Lakes", "Meadow", "Rivers"],
    climate: ["Cloudy", "Cold Winters"],
    energy: ["High Wind", "Hydroelectric Potential"],
    description:
      "The land of traditional craftsmanship and old-school living. People don't come here to launch yoga-eco-retreats — they come to buy a beautiful old farm to renovate it. No hype, no rush. Locals that respect people who contribute with skills, not personal brand. Villages are small, practical, and community-based.\n\nThis is a region of water and forest: lakes, rivers, ponds, even swamps. Forests are filled with edible mushrooms, wild herbs, and firewood. This gives extra reason to spend your morning in the forest instead of a fancy cafe.\n\nLocals still preserve food, dry apples, keep goats, and work with wood. Great place to learn traditional ways of getting the job done — simply, efficiently and through the craftsmanship.",
    vegetables: ["Vegetables", "Root Vegetables", "Cabbage"],
    fruitsAndNuts: ["Apples", "Plums", "Pears", "Berries"],
    otherFoodProduction: ["Dairy"],
    rainfall: 900,
    averagePricePerSqm: 10,
    buildingLicensePercent: 11,
    foodProduction: {
      vegetableGarden: {
        feasibility: "recommended",
        description:
          "Traditional gardens thrive. Root cellars common for winter storage of abundant harvest.",
        setupCost: 2300,
        annualMaintenance: 580,
      },
      foodForest: {
        feasibility: "recommended",
        description:
          "Excellent for temperate food forest. Traditional fruit trees, berries, and mushroom cultivation.",
        setupCost: 4100,
        annualMaintenance: 470,
      },
      greenhouse: {
        feasibility: "recommended",
        description:
          "Useful for extending season and growing heat-loving crops. Many use simple polytunnels.",
        setupCost: 9000,
        annualMaintenance: 680,
      },
      fruitOrchard: {
        feasibility: "recommended",
        description:
          "Traditional fruit growing region. Excellent for apples, plums, pears. Strong preserving culture.",
        setupCost: 3700,
        annualMaintenance: 680,
      },
      poultry: {
        feasibility: "recommended",
        description:
          "Very common in villages. Chickens, ducks, and geese traditional and productive.",
        setupCost: 1900,
        annualMaintenance: 1150,
      },
      beekeeping: {
        feasibility: "recommended",
        description:
          "Strong beekeeping tradition. Forest and meadow flowers produce quality honey.",
        setupCost: 1700,
        annualMaintenance: 360,
      },
      dairy: {
        feasibility: "recommended",
        description:
          "Small-scale dairy common. Good pastures and traditional cheese-making knowledge.",
        setupCost: 14000,
        annualMaintenance: 3900,
      },
    },
  },
  {
    id: "dalarna",
    name: "Dalarna",
    country: "Sweden",
    region: "Northern Europe",
    landscape: ["Forests", "Lakes", "Rivers"],
    climate: ["Cold Winters"],
    energy: [],
    description:
      "Dalarna is one of Sweden's most active regions for permaculture and back-to-the-land living. People come here to recover, rebuild, and do real things with their hands. It's quiet, vast, and slow. Lakes stretch for kilometers and pine forests surround you everywhere. Great region for winter fans and those who enjoy chopping the firewood.",
    vegetables: ["Root Vegetables", "Cabbage"],
    fruitsAndNuts: ["Berries"],
    otherFoodProduction: ["Dairy"],
    rainfall: 850,
    averagePricePerSqm: 12,
    buildingLicensePercent: 12,
    foodProduction: {
      vegetableGarden: {
        feasibility: "challenging",
        description:
          "Very short season requires greenhouses, cold frames, and storage crops. Focus on preservation.",
        setupCost: 3000,
        annualMaintenance: 700,
      },
      foodForest: {
        feasibility: "not_recommended",
        description:
          "Extremely limited options. Only the hardiest berries and possibly sea buckthorn viable.",
        setupCost: 5000,
        annualMaintenance: 600,
      },
      greenhouse: {
        feasibility: "recommended",
        description:
          "Essential for serious food production. Needs excellent insulation and possibly supplemental heat.",
        setupCost: 15000,
        annualMaintenance: 1200,
      },
      fruitOrchard: {
        feasibility: "not_recommended",
        description:
          "Too cold for most fruit trees. Limited to experimental cold-hardy varieties.",
        setupCost: 4000,
        annualMaintenance: 800,
      },
      poultry: {
        feasibility: "challenging",
        description:
          "Possible with cold-hardy breeds and insulated housing. Higher winter feed costs.",
        setupCost: 3000,
        annualMaintenance: 1500,
      },
      beekeeping: {
        feasibility: "challenging",
        description:
          "Short but intense season. Bees need careful management and winter preparation.",
        setupCost: 2200,
        annualMaintenance: 500,
      },
      dairy: {
        feasibility: "recommended",
        description:
          "Traditional dairy region. Good summer pastures, extensive hay storage needed for winter.",
        setupCost: 18000,
        annualMaintenance: 4500,
      },
    },
  },
];
