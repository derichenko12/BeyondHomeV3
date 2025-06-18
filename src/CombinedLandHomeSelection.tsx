import React, { useState, useEffect } from "react";
import {
  ProgressBar,
  PageHeader,
  PageLayout,
  SelectionCard,
  Button,
  STEPS,
} from "./DesignSystem";

// Types
interface LandOption {
  id: string;
  title: string;
  description: string;
  size: number; // in m²
  price: number; // in euros
}

interface HomeOption {
  id: string;
  title: string;
  description: string;
  size: number; // in m²
  price: number; // in euros
}

interface Props {
  subregion: {
    name: string;
    averagePricePerSqm: number;
    buildingLicensePercent: number;
  };
  familySize: number;
  onContinue: (landArea: number, landPrice: number, homePrice: number, homeArea: number) => void;
  onUpdateCart: (items: any[]) => void;
  onBack?: () => void;
}

// Data from PDF
const landOptions: LandOption[] = [
  {
    id: "small",
    title: "Small & Flexible",
    description: "For people who want to brag about growing their own salad but still be close enough to a coffee shop. Just enough to feel like a pioneer without giving up your morning latte.",
    size: 1500,
    price: 6000,
  },
  {
    id: "family",
    title: "Family Garden",
    description: "For those who think a cozy home with garden and some chickens will fix their existential angst. It won't, but at least you'll get some fresh eggs and vegetables.",
    size: 5000,
    price: 20000,
  },
  {
    id: "productive",
    title: "Productive Playground",
    description: "For the ones who like the idea of self-sufficiency but also know they'll call their neighbor to borrow a wheelbarrow. A serious commitment to a full self-sufficient set-up.",
    size: 8000,
    price: 40000,
  },
  {
    id: "collective",
    title: "Collective Land",
    description: "For those who want to see if community really works. Enough space to share dreams, argue about compost, and test if utopia is a myth. Let me know how it goes some day!",
    size: 15000,
    price: 60000,
  },
];

const homeOptions: HomeOption[] = [
  {
    id: "prefab",
    title: "Pre-fabricated",
    description: "Quick to build and budget-friendly. Perfect for those who want to start their off-grid journey without breaking the bank. Modern, efficient, and ready in months.",
    size: 60,
    price: 45000,
  },
  {
    id: "basic",
    title: "Basic",
    description: "A solid foundation for comfortable living. Well-insulated, properly sized for a small family, with all the essentials for year-round off-grid life.",
    size: 140,
    price: 120000,
  },
  {
    id: "rooted",
    title: "Rooted",
    description: "For those who see their home as a long-term investment. Spacious, built to last generations, with room for growth and all the comforts of modern sustainable living.",
    size: 200,
    price: 200000,
  },
];

export default function CombinedLandHomeSelection({
  subregion,
  familySize,
  onContinue,
  onUpdateCart,
  onBack,
}: Props) {
  const [selectedLand, setSelectedLand] = useState<string | null>(null);
  const [selectedHome, setSelectedHome] = useState<string | null>(null);

  // Calculate actual prices based on subregion
  const calculateLandPrice = (option: LandOption) => {
    return Math.round(option.size * subregion.averagePricePerSqm);
  };

  const calculateBuildingLicenseCost = (homePrice: number) => {
    return Math.round(homePrice * (subregion.buildingLicensePercent / 100));
  };

  // Update cart when selections change
  useEffect(() => {
    const cartItems = [];
    
    if (selectedLand) {
      const landOption = landOptions.find(o => o.id === selectedLand);
      if (landOption) {
        const landPrice = calculateLandPrice(landOption);
        cartItems.push({
          label: `Land (${(landOption.size / 10000).toFixed(1)} ha)`,
          value: landPrice,
          type: "money",
        });
      }
    }
    
    if (selectedHome) {
      const homeOption = homeOptions.find(o => o.id === selectedHome);
      if (homeOption) {
        const licenseCost = calculateBuildingLicenseCost(homeOption.price);
        cartItems.push(
          {
            label: "Home",
            value: homeOption.price,
            type: "money",
          },
          {
            label: "Building License",
            value: licenseCost,
            type: "money",
          }
        );
      }
    }
    
    onUpdateCart(cartItems);
  }, [selectedLand, selectedHome, subregion, onUpdateCart]);

  const handleContinue = () => {
    if (selectedLand && selectedHome) {
      const landOption = landOptions.find(o => o.id === selectedLand)!;
      const homeOption = homeOptions.find(o => o.id === selectedHome)!;
      const calculatedLandPrice = calculateLandPrice(landOption);
      const licenseCost = calculateBuildingLicenseCost(homeOption.price);
      const totalHomeCost = homeOption.price + licenseCost;
      
      onContinue(landOption.size, calculatedLandPrice, totalHomeCost, homeOption.size);
    }
  };

  const canContinue = selectedLand && selectedHome;

  return (
    <PageLayout>
      <ProgressBar
        currentStep={STEPS.LAND_AND_HOME.number}
        totalSteps={STEPS.LAND_AND_HOME.total}
        stepLabel={STEPS.LAND_AND_HOME.label}
      />

      <PageHeader
        title="How much land do you need?"
        subtitle="Choose your land size and home type. A guide on building permits and zoning regulations will be included in the final receipt."
      />

      {/* Land Selection Section */}
      <div className="mb-12">
        <h2 className="text-[16px] font-mono uppercase tracking-wider mb-6">
          HOW MUCH LAND DO YOU NEED?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {landOptions.map((option) => {
            const landPrice = calculateLandPrice(option);
            const hectares = (option.size / 10000).toFixed(1);
            
            return (
              <SelectionCard
                key={option.id}
                title={option.title}
                description={option.description}
                selected={selectedLand === option.id}
                onClick={() => setSelectedLand(option.id)}
              >
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <div className="space-x-4">
                    <span className="text-gray-600">SIZE:</span>
                    <span className="font-medium">{option.size.toLocaleString()} M² ({hectares} ha)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-600">PRICE:</span>
                    <span className="font-medium ml-2">€{landPrice.toLocaleString()}</span>
                  </div>
                </div>
              </SelectionCard>
            );
          })}
        </div>
      </div>

      {/* Home Selection Section */}
      <div className="mb-12">
        <h2 className="text-[16px] font-mono uppercase tracking-wider mb-6">
          NOW LET'S APPROXIMATE A HOME BUDGET
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {homeOptions.map((option) => {
            const licenseCost = calculateBuildingLicenseCost(option.price);
            const totalCost = option.price + licenseCost;
            
            return (
              <SelectionCard
                key={option.id}
                title={option.title}
                description={option.description}
                selected={selectedHome === option.id}
                onClick={() => setSelectedHome(option.id)}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-gray-600">SIZE:</span>
                    <span className="font-medium">{option.size} M²</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-gray-600">HOME:</span>
                    <span className="font-medium">€{option.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-gray-600">LICENSE:</span>
                    <span className="font-medium">€{licenseCost.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 flex justify-between items-center text-[10px] font-mono">
                    <span className="text-gray-600">TOTAL:</span>
                    <span className="font-medium">€{totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </SelectionCard>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      {(selectedLand || selectedHome) && (
        <div className="border border-black p-8 mb-8" style={{ borderWidth: '0.5px' }}>
          <h3 className="text-[16px] font-mono uppercase tracking-wider mb-6">YOUR SELECTION</h3>
          
          <div className="space-y-3 text-[10px] font-mono">
            {selectedLand && (
              <div className="flex justify-between">
                <span className="text-gray-600">LAND:</span>
                <span className="font-medium">
                  {landOptions.find(o => o.id === selectedLand)?.title} - €{calculateLandPrice(landOptions.find(o => o.id === selectedLand)!).toLocaleString()}
                </span>
              </div>
            )}
            
            {selectedHome && (
              <div className="flex justify-between">
                <span className="text-gray-600">HOME (INCL. LICENSE):</span>
                <span className="font-medium">
                  {homeOptions.find(o => o.id === selectedHome)?.title} - €{(homeOptions.find(o => o.id === selectedHome)!.price + 
                    calculateBuildingLicenseCost(homeOptions.find(o => o.id === selectedHome)!.price)).toLocaleString()}
                </span>
              </div>
            )}
            
            {selectedLand && selectedHome && (
              <div className="border-t border-gray-300 pt-3 mt-3">
                <div className="flex justify-between text-[16px] font-mono uppercase tracking-wider">
                  <span>TOTAL INVESTMENT:</span>
                  <span className="font-medium">
                    €{(
                      calculateLandPrice(landOptions.find(o => o.id === selectedLand)!) +
                      homeOptions.find(o => o.id === selectedHome)!.price +
                      calculateBuildingLicenseCost(homeOptions.find(o => o.id === selectedHome)!.price)
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-between items-center mt-12">
        {onBack && (
          <Button onClick={onBack}>← BACK</Button>
        )}
        
        <div className="ml-auto">
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
          >
            CONTINUE →
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}