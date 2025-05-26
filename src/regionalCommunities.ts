// regionalCommunities.ts - Permaculture projects and communities by region

export interface Community {
    name: string;
    description: string;
    website?: string;
    location: string;
  }
  
  export const regionalCommunities: Record<string, Community[]> = {
    andalusia: [
      {
        name: "Suryalila Retreat Centre",
        description: "Yoga and permaculture retreat center in the Andalusian mountains",
        website: "suryalila.com",
        location: "Near Prado del Rey, Cádiz"
      },
      {
        name: "Los Molinos del Río Aguas",
        description: "Eco-village and regeneration project in Almería desert",
        website: "molinosaguas.com", 
        location: "Sorbas, Almería"
      },
      {
        name: "Beneficio Community",
        description: "One of Europe's oldest alternative communities",
        location: "Alpujarras, Granada"
      }
    ],
    asturias: [
      {
        name: "Ecoaldea Artosilla",
        description: "Small eco-village focused on self-sufficiency",
        location: "Near Cangas de Onís"
      },
      {
        name: "La Ecoaldea",
        description: "Permaculture education center and community",
        location: "Valles, Asturias"
      }
    ],
    algarve: [
      {
        name: "Tamera Peace Research Village",
        description: "Large-scale peace research and permaculture center",
        website: "tamera.org",
        location: "Odemira (near Algarve border)"
      },
      {
        name: "Mount of Oaks",
        description: "Permaculture farm and education center",
        location: "São Bartolomeu de Messines"
      },
      {
        name: "Awakened Life Project",
        description: "Spiritual community with ecological focus",
        website: "awakenedlifeproject.org",
        location: "Central Portugal (accessible from Algarve)"
      }
    ],
    "northern-portugal": [
      {
        name: "Eco Aldeia de Janas",
        description: "Traditional village turned eco-community",
        location: "Serra de Sintra"
      },
      {
        name: "Vale da Lama",
        description: "Permaculture education and farm",
        website: "valedalama.net",
        location: "Lagos region"
      }
    ],
    provence: [
      {
        name: "Les Amanins",
        description: "Ecological center founded by Pierre Rabhi",
        website: "lesamanins.com",
        location: "La Roche-sur-Grâne, Drôme"
      },
      {
        name: "Mas de Beaulieu",
        description: "Biodynamic farm and community",
        location: "Near Arles"
      }
    ],
    brittany: [
      {
        name: "Kerzello Community",
        description: "Permaculture community and education center",
        location: "Plufur, Côtes-d'Armor"
      },
      {
        name: "Eco-Village Keruzerh",
        description: "Sustainable living project",
        location: "Locoal-Mendon, Morbihan"
      }
    ],
    bavaria: [
      {
        name: "Schloss Tempelhof",
        description: "Large eco-village and community",
        website: "schloss-tempelhof.de",
        location: "Kreßberg, near Bavaria"
      },
      {
        name: "Lebensgarten Steyerberg",
        description: "One of Germany's oldest eco-villages",
        location: "Lower Saxony (accessible from Bavaria)"
      }
    ],
    brandenburg: [
      {
        name: "Ökodorf Sieben Linden",
        description: "Self-sufficient eco-village with 150 residents",
        website: "siebenlinden.org",
        location: "Beetzendorf, Saxony-Anhalt (near Brandenburg)"
      },
      {
        name: "KuBiZ Kulturzentrum",
        description: "Cultural center with permaculture projects",
        location: "Weißensee, Berlin (close to Brandenburg)"
      }
    ],
    carinthia: [
      {
        name: "Krameterhof",
        description: "Sepp Holzer's famous permaculture farm",
        website: "krameterhof.at",
        location: "Ramingstein, Lungau"
      },
      {
        name: "Biotopia Community",
        description: "Small permaculture community",
        location: "Near Klagenfurt"
      }
    ],
    "south-bohemia": [
      {
        name: "Permalot",
        description: "Permaculture education center",
        website: "permalot.cz",
        location: "Near České Budějovice"
      },
      {
        name: "Ekocentrum Sluňákov",
        description: "Environmental education center",
        location: "Horka nad Moravou (accessible from South Bohemia)"
      }
    ],
    dalarna: [
      {
        name: "Stjärnsund Community",
        description: "Folk high school and intentional community",
        location: "Near Hedemora"
      },
      {
        name: "Charlottendal Gård",
        description: "Biodynamic farm and community",
        location: "Järna (accessible from Dalarna)"
      }
    ]
  };