import React, { useState, useEffect } from "react";

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
    description: "For people who want to brag about growing their own salad but still be close enough to a coffee shop. Just enough to feel like a pioneer without giving up your morning latte.",
    size: 60,
    price: 45000,
  },
  {
    id: "basic",
    title: "Basic",
    description: "For those who think a cozy home with garden and some chickens will fix their existential angst. It won't, but at least you'll get some fresh eggs and vegetables.",
    size: 140,
    price: 120000,
  },
  {
    id: "rooted",
    title: "Rooted",
    description: "For the ones who like the idea of self-sufficiency but also know they'll call their neighbor to borrow a wheelbarrow. A serious commitment to a full self-sufficient set-up.",
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

  // Progress bar component inline to avoid import issues
  const ProgressBar = () => (
    <div className="flex justify-between items-center py-8 border-b border-black" style={{ borderWidth: '0.5px' }}>
      <div className="flex space-x-1">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className={`w-8 h-1 ${
              index < 5 ? "bg-black" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <div className="text-[10px] font-mono uppercase tracking-wider">
        Land & Home 5/9
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#C5D9DA] font-mono">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Progress Bar */}
        <ProgressBar />
        
        {/* Land Selection Section */}
        <div className="mb-16 mt-8">
          <h1 className="text-2xl font-bold mb-4">How much land do you need?</h1>
          <p className="text-sm text-gray-700 mb-8">
            A guide on choosing the land, building permits and zoning regulations<br />
            will be included in the final receipt.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {landOptions.map((option) => {
              const landPrice = calculateLandPrice(option);
              return (
                <div
                  key={option.id}
                  onClick={() => setSelectedLand(option.id)}
                  className={`bg-white p-6 cursor-pointer transition-all border-2 ${
                    selectedLand === option.id
                      ? "border-black shadow-lg"
                      : "border-transparent hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 mr-3 ${
                        selectedLand === option.id
                          ? "border-black bg-black"
                          : "border-gray-400"
                      }`}
                    >
                      {selectedLand === option.id && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <h3 className="text-base font-bold">{option.title}</h3>
                  </div>

                  <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                    {option.description}
                  </p>

                  <div className="flex items-baseline gap-4 text-sm">
                    <span className="px-2 py-1 bg-gray-100">
                      {option.size.toLocaleString()} M²
                    </span>
                    <span className="px-2 py-1 bg-gray-100">
                      {landPrice.toLocaleString()}€
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Home Selection Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Now let's approximate a home budget.</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {homeOptions.map((option) => {
              const licenseCost = calculateBuildingLicenseCost(option.price);
              const totalCost = option.price + licenseCost;
              
              return (
                <div
                  key={option.id}
                  onClick={() => setSelectedHome(option.id)}
                  className={`bg-white p-6 cursor-pointer transition-all border-2 ${
                    selectedHome === option.id
                      ? "border-black shadow-lg"
                      : "border-transparent hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 mr-3 ${
                        selectedHome === option.id
                          ? "border-black bg-black"
                          : "border-gray-400"
                      }`}
                    >
                      {selectedHome === option.id && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <h3 className="text-base font-bold">{option.title}</h3>
                  </div>

                  <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                    {option.description}
                  </p>

                  <div className="flex items-baseline gap-4 text-sm">
                    <span className="px-2 py-1 bg-gray-100">
                      {option.size} M²
                    </span>
                    <span className="px-2 py-1 bg-gray-100">
                      {option.price.toLocaleString()}€
                    </span>
                  </div>
                  
                  {selectedHome === option.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600">
                      <div>+ Building license: €{licenseCost.toLocaleString()}</div>
                      <div className="font-bold mt-1">Total: €{totalCost.toLocaleString()}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary and Continue */}
        {(selectedLand || selectedHome) && (
          <div className="bg-white p-8 mb-8">
            <h3 className="text-lg font-bold mb-4">Your Selection</h3>
            
            {selectedLand && (
              <div className="mb-4">
                <span className="text-sm font-bold">Land: </span>
                <span className="text-sm">
                  {landOptions.find(o => o.id === selectedLand)?.title} - 
                  {' '}€{calculateLandPrice(landOptions.find(o => o.id === selectedLand)!).toLocaleString()}
                </span>
              </div>
            )}
            
            {selectedHome && (
              <div className="mb-4">
                <span className="text-sm font-bold">Home: </span>
                <span className="text-sm">
                  {homeOptions.find(o => o.id === selectedHome)?.title} - 
                  {' '}€{(homeOptions.find(o => o.id === selectedHome)!.price + 
                    calculateBuildingLicenseCost(homeOptions.find(o => o.id === selectedHome)!.price)).toLocaleString()}
                  {' '}(incl. license)
                </span>
              </div>
            )}
            
            {selectedLand && selectedHome && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-lg font-bold">
                  Total Investment: €{(
                    calculateLandPrice(landOptions.find(o => o.id === selectedLand)!) +
                    homeOptions.find(o => o.id === selectedHome)!.price +
                    calculateBuildingLicenseCost(homeOptions.find(o => o.id === selectedHome)!.price)
                  ).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dotted line separator */}
        <div className="border-t-2 border-dotted border-gray-400 my-12"></div>

        {/* Action buttons */}
        <div className="flex justify-between items-center">
          {onBack && (
            <button
              onClick={onBack}
              className="px-6 py-3 bg-white border border-gray-400 text-sm hover:border-black transition-colors"
            >
              ← BACK
            </button>
          )}
          
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`px-8 py-3 text-sm font-bold transition-colors ${
              canContinue
                ? "bg-[#8BA5A8] text-white hover:bg-[#7A9598]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            NEXT STEP
          </button>
        </div>
      </div>
    </div>
  );
}