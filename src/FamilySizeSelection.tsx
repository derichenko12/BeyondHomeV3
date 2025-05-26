import React, { useState } from "react";
import {
  ProgressBar,
  PageHeader,
  PageLayout,
  Button,
  SelectionCard,
  STEPS,
} from "./DesignSystem";

interface Props {
  onContinue: (familySize: number) => void;
  onBack?: () => void;
}

interface FamilyOption {
  size: number;
  label: string;
  description: string;
  recommendedLand: string;
  recommendedHome: string;
  foodNeeds: string;
}

const familyOptions: FamilyOption[] = [
  {
    size: 1,
    label: "Solo Living",
    description: "Independent life with minimal needs",
    recommendedLand: "0.2-0.5 ha",
    recommendedHome: "30-50 m²",
    foodNeeds: "Small garden, few chickens",
  },
  {
    size: 2,
    label: "Couple",
    description: "Two people sharing the journey",
    recommendedLand: "0.3-0.8 ha",
    recommendedHome: "50-80 m²",
    foodNeeds: "Medium garden, small orchard",
  },
  {
    size: 4,
    label: "Small Family",
    description: "Family with 1-2 children",
    recommendedLand: "0.5-1.0 ha",
    recommendedHome: "80-120 m²",
    foodNeeds: "Large garden, diverse systems",
  },
  {
    size: 6,
    label: "Large Family",
    description: "Big household or multi-generational",
    recommendedLand: "0.8-1.5 ha",
    recommendedHome: "120-180 m²",
    foodNeeds: "Multiple production systems",
  },
];

export default function FamilySizeSelection({ onContinue, onBack }: Props) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  return (
    <PageLayout>
      <ProgressBar currentStep={3} totalSteps={9} stepLabel="Family Size" />

      <PageHeader
        title="How many people will live here?"
        subtitle="This helps us recommend the right land size, home, and food production systems for your needs."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {familyOptions.map((option) => (
          <SelectionCard
            key={option.size}
            title={option.label}
            description={option.description}
            selected={selectedSize === option.size}
            onClick={() => setSelectedSize(option.size)}
          >
            <div className="space-y-2 mt-4">
              <div className="text-xs">
                <span className="text-gray-500">Recommended land:</span>{" "}
                <span className="font-medium">{option.recommendedLand}</span>
              </div>
              <div className="text-xs">
                <span className="text-gray-500">Home size:</span>{" "}
                <span className="font-medium">{option.recommendedHome}</span>
              </div>
              <div className="text-xs">
                <span className="text-gray-500">Food systems:</span>{" "}
                <span className="font-medium">{option.foodNeeds}</span>
              </div>
            </div>
          </SelectionCard>
        ))}
      </div>

      <div className="flex justify-between items-center mt-16">
        {onBack && <Button onClick={onBack}>← Back</Button>}
        <div className={onBack ? "" : "ml-auto"}>
          <Button
            onClick={() => selectedSize && onContinue(selectedSize)}
            disabled={!selectedSize}
          >
            {selectedSize
              ? `Continue with ${selectedSize} ${
                  selectedSize === 1 ? "person" : "people"
                }`
              : "Select family size"}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
