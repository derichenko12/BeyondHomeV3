// SimpleResources.ts - Simple resource system with tag-based availability

export type ResourceCategory = "energy" | "water" | "heating" | "irrigation";

export interface SimpleResource {
  id: string;
  name: string;
  description: string;
  category: ResourceCategory;
  setupCost: number;
  annualCost: number;
  weeklyHours: number;
  // Tags that make this resource available/recommended
  availableFor: string[];
  // Tags that make this resource NOT recommended
  notRecommendedFor?: string[];
  icon: string;
  // For future expansion
  variants?: {
    id: string;
    name: string;
    setupCost: number;
    annualCost: number;
    description?: string;
  }[];
}

// Category metadata for UI
export const categoryInfo: Record<ResourceCategory, { 
  label: string; 
  description: string;
  required: boolean;
}> = {
  energy: {
    label: "Energy Systems",
    description: "Electricity is essential for modern off-grid living. Choose systems that match your climate and budget to power your lights, appliances, and tools.",
    required: true,
  },
  water: {
    label: "Water Supply",
    description: "Clean water is fundamental for life. Select reliable water sources and filtration systems to ensure safe drinking water year-round.",
    required: true,
  },
  heating: {
    label: "Heating Systems",
    description: "Stay warm and comfortable through cold seasons. Choose heating solutions that suit your climate and available resources.",
    required: true,
  },
  irrigation: {
    label: "Irrigation Systems",
    description: "Efficient watering systems save time and water while ensuring healthy crops. Pick methods that match your terrain and water availability.",
    required: false,
  },
};

// Base resources available everywhere
export const simpleResources: SimpleResource[] = [
  // ========== ENERGY ==========
  {
    id: "grid-connection",
    name: "Grid Connection",
    description: "Connect to the local electricity network. Most reliable option while you build other systems. Can later add solar/wind and sell excess back to grid.",
    category: "energy",
    setupCost: 3000,
    annualCost: 1200,
    weeklyHours: 0,
    availableFor: ["ALL"],
    icon: "🔌",
    variants: [
      { 
        id: "basic", 
        name: "Basic connection (15A)", 
        setupCost: 3000, 
        annualCost: 1200,
        description: "For tiny homes & minimal use. Powers lights, laptop, fridge, basic cooking."
      },
      { 
        id: "standard", 
        name: "Standard (25A)", 
        setupCost: 4000, 
        annualCost: 1800,
        description: "Most common choice. Runs normal household: appliances, tools, heating."
      },
      { 
        id: "high", 
        name: "High capacity (35A+)", 
        setupCost: 6000, 
        annualCost: 2400,
        description: "For large homes or workshops. Heavy machinery, electric heating, EV charging."
      },
    ],
  },
  {
    id: "solar-basic",
    name: "Solar Power System",
    description: "Converts sunlight into electricity using panels on your roof. Includes batteries to store power for nighttime use. Perfect for sunny regions, minimal maintenance.",
    category: "energy",
    setupCost: 8000,
    annualCost: 200,
    weeklyHours: 0.5,
    availableFor: ["Sufficient Sun"],
    icon: "☀️",
    variants: [
      { id: "3kw", name: "3kW Basic (essential needs)", setupCost: 8000, annualCost: 200 },
      { id: "5kw", name: "5kW Standard (comfortable)", setupCost: 15000, annualCost: 300 },
      { id: "8kw", name: "8kW Large (full household)", setupCost: 22000, annualCost: 400 },
    ],
  },
  {
    id: "wind-turbine",
    name: "Wind Turbine",
    description: "Spins with the wind to generate electricity. Works day and night when there's breeze. Great for windy locations like coasts or hills. Needs regular checks.",
    category: "energy",
    setupCost: 12000,
    annualCost: 500,
    weeklyHours: 1,
    availableFor: ["Coastline", "Mountains", "Meadow", "High Wind"],
    notRecommendedFor: ["Forests"],
    icon: "💨",
  },
  {
    id: "generator",
    name: "Backup Generator",
    description: "Burns fuel (diesel/gas) to create electricity on demand. Essential backup for cloudy/windless days. Noisy when running, needs fuel storage.",
    category: "energy",
    setupCost: 2000,
    annualCost: 600,
    weeklyHours: 0.5,
    availableFor: ["ALL"], // Universal
    icon: "⚡",
  },
  {
    id: "gas-cooking",
    name: "Gas for Cooking",
    description: "Propane bottles power your stove and oven. Clean, instant heat for cooking. No electricity needed. Bottles need periodic refilling.",
    category: "energy",
    setupCost: 500,
    annualCost: 600,
    weeklyHours: 0,
    availableFor: ["ALL"],
    icon: "🔥",
  },

  // ========== WATER ==========
  {
    id: "well",
    name: "Water Well",
    description: "Drilled deep hole accessing underground water. Provides year-round clean water. Electric pump brings water up. Most reliable option if groundwater exists.",
    category: "water",
    setupCost: 8000,
    annualCost: 300,
    weeklyHours: 0.2,
    availableFor: ["ALL"],
    icon: "🚰",
  },
  {
    id: "rainwater",
    name: "Rainwater Harvesting",
    description: "Collects rain from your roof into large tanks. Free water from the sky! Needs good rainfall and roof space. Great supplement to other sources.",
    category: "water",
    setupCost: 4000,
    annualCost: 200,
    weeklyHours: 0.5,
    availableFor: ["Cloudy", "Mild"],
    notRecommendedFor: ["Sufficient Sun"], // Less effective in dry regions
    icon: "🌧️",
    variants: [
      { id: "5000L", name: "5,000L (small family)", setupCost: 4000, annualCost: 200 },
      { id: "10000L", name: "10,000L (standard)", setupCost: 6000, annualCost: 250 },
      { id: "20000L", name: "20,000L (large/dry climate)", setupCost: 10000, annualCost: 300 },
    ],
  },
  {
    id: "spring",
    name: "Natural Spring",
    description: "Taps into natural water flowing from the ground. Crystal-clear mountain water, gravity-fed. Lucky if you have one on your land!",
    category: "water",
    setupCost: 2000,
    annualCost: 100,
    weeklyHours: 0.3,
    availableFor: ["Mountains", "Rivers"],
    icon: "⛲",
  },
  {
    id: "water-filter",
    name: "Water Filtration System",
    description: "Multi-stage filters remove bacteria, chemicals, and particles. Makes any water source safe to drink. Essential for health, easy to maintain.",
    category: "water",
    setupCost: 1500,
    annualCost: 300,
    weeklyHours: 0.1,
    availableFor: ["ALL"],
    icon: "💧",
  },

  // ========== HEATING ==========
  {
    id: "wood-stove",
    name: "Wood Stove",
    description: "Burns logs for cozy warmth. Traditional, reliable heating using local wood. Provides ambiance and can cook on top. Needs dry wood storage and chimney cleaning.",
    category: "heating",
    setupCost: 3000,
    annualCost: 400,
    weeklyHours: 3,
    availableFor: ["ALL"],
    icon: "🪵",
  },
  {
    id: "heat-pump",
    name: "Heat Pump",
    description: "Electric system that moves heat from outside air into your home. Very efficient in mild climates. Also cools in summer. Quiet and clean.",
    category: "heating",
    setupCost: 6000,
    annualCost: 600,
    weeklyHours: 0,
    availableFor: ["Mild", "Sufficient Sun"],
    notRecommendedFor: ["Cold Winters"],
    icon: "🌡️",
  },
  {
    id: "pellet-stove",
    name: "Pellet Stove",
    description: "Burns compressed wood pellets automatically. Cleaner than logs, programmable temperature. Pellets delivered in bags. Good for busy lifestyles.",
    category: "heating",
    setupCost: 4000,
    annualCost: 800,
    weeklyHours: 0.5,
    availableFor: ["Cold Winters", "Cloudy"],
    icon: "🔥",
  },

  // ========== IRRIGATION ==========
  {
    id: "drip-irrigation",
    name: "Drip Irrigation",
    description: "Delivers water drop by drop directly to plant roots. Saves 50% water compared to sprinklers. Timer-controlled, perfect for gardens. Set and forget!",
    category: "irrigation",
    setupCost: 1500,
    annualCost: 100,
    weeklyHours: 0.5,
    availableFor: ["ALL"],
    icon: "💦",
  },
  {
    id: "gravity-irrigation",
    name: "Gravity-Fed System",
    description: "Uses natural slope to move water without pumps. Free to operate once installed. Perfect if you have elevation. Ancient and reliable method.",
    category: "irrigation",
    setupCost: 1000,
    annualCost: 50,
    weeklyHours: 1,
    availableFor: ["Mountains", "Rivers"],
    icon: "⛰️",
  },
  {
    id: "pump-irrigation",
    name: "Pump System",
    description: "Electric or solar pump moves water where needed. Flexible placement, strong pressure. Good for flat land or uphill watering. Automated with timers.",
    category: "irrigation",
    setupCost: 2000,
    annualCost: 200,
    weeklyHours: 0.5,
    availableFor: ["ALL"],
    icon: "🔌",
  },
];

// Helper functions for resource filtering
export function getAvailableResources(
  allResources: SimpleResource[],
  regionTags: string[]
): SimpleResource[] {
  return allResources.filter(resource => {
    // Check if resource is available
    const isAvailable = resource.availableFor.includes("ALL") || 
      resource.availableFor.some(tag => regionTags.includes(tag));
    
    // Check if resource is not recommended
    const isNotRecommended = resource.notRecommendedFor?.some(tag => 
      regionTags.includes(tag)
    ) || false;
    
    return isAvailable && !isNotRecommended;
  });
}

// Get recommendation level for UI display
export function getResourceRecommendation(
  resource: SimpleResource,
  regionTags: string[]
): "highly-recommended" | "recommended" | "available" {
  // Count matching tags
  const matchingTags = resource.availableFor.filter(tag => 
    regionTags.includes(tag)
  ).length;
  
  // Has exclusions?
  const hasExclusions = resource.notRecommendedFor?.some(tag => 
    regionTags.includes(tag)
  ) || false;
  
  if (hasExclusions) return "available";
  if (matchingTags >= 2) return "highly-recommended";
  if (matchingTags >= 1 || resource.availableFor.includes("ALL")) return "recommended";
  return "available";
}

// Calculate costs with scaling factors
export function calculateResourceCosts(
  resource: SimpleResource,
  homeSize: number,
  familySize: number
): { setupCost: number; annualCost: number } {
  let setupMultiplier = 1;
  let annualMultiplier = 1;
  
  // Scale heating costs by home size
  if (resource.category === "heating") {
    if (homeSize <= 50) setupMultiplier = 0.8;
    else if (homeSize <= 100) setupMultiplier = 1.0;
    else setupMultiplier = 1.3;
    annualMultiplier = setupMultiplier;
  }
  
  // Scale water costs by family size
  if (resource.category === "water" && resource.id !== "well") {
    if (familySize <= 2) setupMultiplier = 0.8;
    else if (familySize <= 4) setupMultiplier = 1.0;
    else setupMultiplier = 1.2;
  }
  
  // Scale irrigation by assumed garden size based on family
  if (resource.category === "irrigation") {
    if (familySize <= 2) setupMultiplier = 0.7;
    else if (familySize <= 4) setupMultiplier = 1.0;
    else setupMultiplier = 1.3;
  }
  
  // Scale grid connection electricity costs by family size and home size
  if (resource.id === "grid-connection") {
    // Annual cost scales with both family and home size
    const familyFactor = familySize <= 2 ? 0.7 : familySize <= 4 ? 1.0 : 1.3;
    const homeFactor = homeSize <= 50 ? 0.8 : homeSize <= 100 ? 1.0 : 1.2;
    annualMultiplier = familyFactor * homeFactor;
    // Setup cost doesn't change much
    setupMultiplier = 1.0;
  }
  
  return {
    setupCost: Math.round(resource.setupCost * setupMultiplier),
    annualCost: Math.round(resource.annualCost * annualMultiplier),
  };
}