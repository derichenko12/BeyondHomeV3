export interface SelfSufficiencyMode {
  id: "hobby" | "homestead" | "full";
  name: string;
  coverage: string;
  description: string;
  details: string[];
  sizeMultiplier: number;
  costMultiplier: number;
}

export const selfSufficiencyModes: SelfSufficiencyMode[] = [
  {
    id: "hobby",
    name: "Hobby Garden",
    coverage: "20-30%",
    description: "Fresh vegetables and herbs for your kitchen",
    details: [
      "Daily salads and cooking herbs",
      "Seasonal vegetables for variety",
      "Some preservation for winter",
      "Weekend gardening commitment",
    ],
    sizeMultiplier: 0.3,
    costMultiplier: 0.4,
  },
  {
    id: "homestead",
    name: "Homestead Living",
    coverage: "60-90%",
    description: "Substantial food production with some store supplements",
    details: [
      "Most vegetables and fruits covered",
      "Eggs, honey, and some meat",
      "Significant preservation and storage",
      "Daily maintenance required",
    ],
    sizeMultiplier: 0.8,
    costMultiplier: 0.85,
  },
  {
    id: "full",
    name: "Full Self-Sufficiency",
    coverage: "95-100%",
    description: "Complete food independence year-round",
    details: [
      "All food needs covered",
      "Diverse protein sources",
      "Year-round production systems",
      "Full-time commitment",
    ],
    sizeMultiplier: 1.2,
    costMultiplier: 1.0,
  },
];

export const getFoodMultiplier = (familySize: number): number => {
  // Base multiplier for scaling food production with family size
  const multipliers: Record<number, number> = {
    1: 0.5,
    2: 1.0,
    4: 1.8,
    6: 2.5,
  };
  return multipliers[familySize] || 1.0;
};
