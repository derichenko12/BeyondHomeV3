// bookResources.ts - Essential reading for off-grid living

export interface Book {
    title: string;
    author: string;
    category: "philosophy" | "practical" | "building" | "food" | "community";
    description: string;
    level: "beginner" | "intermediate" | "advanced";
  }
  
  export const bookResources: Book[] = [
    // Philosophy & Mindset
    {
      title: "Small Is Beautiful",
      author: "E.F. Schumacher",
      category: "philosophy",
      description: "Economics as if people mattered - foundational text on appropriate technology",
      level: "beginner"
    },
    {
      title: "The One-Straw Revolution",
      author: "Masanobu Fukuoka",
      category: "philosophy",
      description: "Natural farming philosophy that changed permaculture",
      level: "beginner"
    },
    {
      title: "Walden",
      author: "Henry David Thoreau",
      category: "philosophy",
      description: "The original experiment in simple living",
      level: "beginner"
    },
    
    // Practical Guides
    {
      title: "The Encyclopedia of Country Living",
      author: "Carla Emery",
      category: "practical",
      description: "The bible of homesteading - everything from bread to butchering",
      level: "beginner"
    },
    {
      title: "Back to Basics: A Complete Guide to Traditional Skills",
      author: "Reader's Digest",
      category: "practical",
      description: "Comprehensive guide to self-sufficient living skills",
      level: "beginner"
    },
    {
      title: "The Self-Sufficient Life and How to Live It",
      author: "John Seymour",
      category: "practical",
      description: "Beautifully illustrated guide to producing your own food and energy",
      level: "intermediate"
    },
    
    // Building & Energy
    {
      title: "The Hand-Sculpted House",
      author: "Ianto Evans, Michael Smith, Linda Smiley",
      category: "building",
      description: "Natural building with cob - philosophy and practice",
      level: "intermediate"
    },
    {
      title: "Earthship Volumes 1-3",
      author: "Michael Reynolds",
      category: "building",
      description: "Radical sustainable architecture using recycled materials",
      level: "advanced"
    },
    {
      title: "Battery Builder's Guide",
      author: "Phillip Hurley",
      category: "building",
      description: "DIY battery banks for off-grid solar systems",
      level: "intermediate"
    },
    
    // Food Production
    {
      title: "Gaia's Garden",
      author: "Toby Hemenway",
      category: "food",
      description: "Permaculture for home gardens - accessible and practical",
      level: "beginner"
    },
    {
      title: "The Market Gardener",
      author: "Jean-Martin Fortier",
      category: "food",
      description: "Small-scale organic farming for profit",
      level: "intermediate"
    },
    {
      title: "Sepp Holzer's Permaculture",
      author: "Sepp Holzer",
      category: "food",
      description: "Mountain permaculture in extreme conditions",
      level: "advanced"
    },
    
    // Community & Social
    {
      title: "Creating a Life Together",
      author: "Diana Leafe Christian",
      category: "community",
      description: "Practical tools for building intentional community",
      level: "intermediate"
    },
    {
      title: "The Transition Handbook",
      author: "Rob Hopkins",
      category: "community",
      description: "Building resilient communities in response to peak oil",
      level: "beginner"
    }
  ];
  
  export const readingPath = {
    beginner: [
      "Start with 'Small Is Beautiful' for philosophical foundation",
      "Read 'The Encyclopedia of Country Living' for practical overview",
      "Explore 'Gaia's Garden' for food production basics",
      "Watch documentaries and YouTube channels for visual learning"
    ],
    intermediate: [
      "Dive into specialized books for your chosen systems",
      "Study 'The Market Gardener' if planning food sales",
      "Read building books relevant to your climate",
      "Join online forums and local permaculture groups"
    ],
    advanced: [
      "Study system design and whole-site planning",
      "Read case studies of successful projects",
      "Take permaculture design certification course",
      "Visit working homesteads and eco-villages"
    ]
  };