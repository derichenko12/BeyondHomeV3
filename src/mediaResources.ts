// mediaResources.ts - Curated media for off-grid living

export interface MediaResource {
    title: string;
    type: "documentary" | "youtube" | "podcast" | "blog";
    description: string;
    link?: string;
    language?: string;
  }
  
  export const mediaResources: MediaResource[] = [
    // Documentaries
    {
      title: "A Simpler Way: Crisis as Opportunity",
      type: "documentary",
      description: "Jordan Osmond & Samuel Alexander explore living simply in response to global crises",
      link: "youtube.com/watch?v=XUwLAvfBCzw"
    },
    {
      title: "Living the Change",
      type: "documentary", 
      description: "Inspiring stories of people pioneering change in the face of climate crisis",
      link: "livingthechangefilm.com"
    },
    {
      title: "Tomorrow (Demain)",
      type: "documentary",
      description: "Solutions to environmental and social challenges from around the world",
      language: "French with subtitles"
    },
    
    // YouTube Channels
    {
      title: "Kirsten Dirksen",
      type: "youtube",
      description: "Hundreds of tours of off-grid homes, natural buildings, and intentional communities",
      link: "youtube.com/@kirstendirksen"
    },
    {
      title: "Happen Films",
      type: "youtube",
      description: "Beautiful short documentaries about permaculture and regenerative living",
      link: "youtube.com/@happenfilms"
    },
    {
      title: "Self Sufficient Me",
      type: "youtube",
      description: "Practical food growing and self-sufficiency from Australia",
      link: "youtube.com/@SelfSufficientMe"
    },
    {
      title: "Swedish Homestead",
      type: "youtube",
      description: "Family documenting their off-grid life in northern Sweden",
      link: "youtube.com/@SwedishHomestead"
    },
    
    // Podcasts
    {
      title: "The Permaculture Podcast",
      type: "podcast",
      description: "Scott Mann explores permaculture principles and practices",
      link: "thepermaculturepodcast.com"
    },
    {
      title: "From the Field",
      type: "podcast",
      description: "Regenerative agriculture stories from around the world",
      link: "fromthefield.media"
    },
    {
      title: "Building Biology",
      type: "podcast",
      description: "Natural building, healthy homes, and sustainable construction",
      link: "buildingbiologyinstitute.org/podcast"
    },
    
    // Blogs & Websites
    {
      title: "Low-tech Magazine",
      type: "blog",
      description: "Solar-powered website about sustainable technology and forgotten knowledge",
      link: "lowtechmagazine.com"
    },
    {
      title: "The Resilience Blog",
      type: "blog",
      description: "Resilience.org's collection of essays on building community resilience",
      link: "resilience.org"
    },
    {
      title: "Permaculture News",
      type: "blog",
      description: "Global permaculture stories, techniques, and inspiration",
      link: "permaculturenews.org"
    }
  ];