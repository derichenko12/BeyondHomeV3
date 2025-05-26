import React, { useState } from "react";
import { Subregion } from "./subregionsData";
import { CartItem } from "./CartContext";
import {
  ProgressBar,
  PageHeader,
  PageLayout,
  Button,
  QuickOption,
  STEPS,
} from "./DesignSystem";

interface Props {
  subregion: Subregion;
  landArea: number;
  landPrice: number;
  onContinue: (homePrice: number, homeArea: number) => void;
  onUpdateCart: (items: CartItem[]) => void;
  onBack?: () => void;
}

export default function LivingSpaceSelection({
  subregion,
  landArea,
  landPrice,
  onContinue,
  onUpdateCart,
  onBack,
}: Props) {
  const [homePrice, setHomePrice] = useState(50000); // euros
  const minPrice = 15000;
  const maxPrice = 200000;
  const step = 2500;

  // Calculate building license cost
  const buildingLicenseCost = Math.round(
    homePrice * (subregion.buildingLicensePercent / 100)
  );
  const totalHomeCost = homePrice + buildingLicenseCost;

  // Calculate home area based on price
  const calculateHomeArea = (price: number): number => {
    if (price <= 35000) return 30; // ~30 m²
    if (price <= 80000) return 70; // ~70 m²
    if (price <= 120000) return 120; // ~120 m²
    return 150; // ~150 m² for larger homes
  };

  const homeArea = calculateHomeArea(homePrice);

  // Handle price change and update cart
  const handlePriceChange = (newPrice: number) => {
    setHomePrice(newPrice);
    const newBuildingLicenseCost = Math.round(
      newPrice * (subregion.buildingLicensePercent / 100)
    );
    const cartItems: CartItem[] = [
      { label: `Land (${(landArea / 10000).toFixed(1)} ha)`, value: landPrice },
      { label: "Home", value: newPrice },
      { label: "Building License", value: newBuildingLicenseCost },
    ];
    onUpdateCart(cartItems);
  };

  // Initialize cart on mount
  React.useEffect(() => {
    const cartItems: CartItem[] = [
      { label: `Land (${(landArea / 10000).toFixed(1)} ha)`, value: landPrice },
      { label: "Home", value: homePrice },
      { label: "Building License", value: buildingLicenseCost },
    ];
    onUpdateCart(cartItems);
  }, []); // Empty dependency array - only run on mount

  // Calculate percentage for slider
  const percentage = ((homePrice - minPrice) / (maxPrice - minPrice)) * 100;

  const getCategory = () => {
    if (homePrice <= 35000)
      return {
        label: "Small & Minimal",
        description:
          "Perfect if: you seek simplicity, minimal upkeep, and closeness to nature",
        details: [
          "Compact wooden cabin or modular home (~20-35 m²)",
          "Minimal environmental impact",
          "Ideal for singles, couples, or minimalists seeking simplicity",
          "Limited storage space",
          "Quick set-up, easy maintenance",
        ],
      };
    if (homePrice <= 80000)
      return {
        label: "Medium & Comfortable",
        description:
          "Perfect if: you want comfort, functionality, and enough space for creativity",
        details: [
          "Comfortable prefabricated wooden house or sustainable construction (~50-90 m²)",
          "Suitable for small families or couples looking for comfort",
          "Space for daily living plus a dedicated creative/hobby room or office",
          "Moderate maintenance needs",
        ],
      };
    return {
      label: "Large & Spacious",
      description:
        "Perfect if: you're investing in long-term comfort, aesthetics, and ample creative space",
      details: [
        "Spacious custom-designed sustainable home (~100-200 m²)",
        "High-quality finishes, aesthetic and functional design",
        "Dedicated areas for family, guests, creative studio, or workspace",
        "Outdoor terrace, garden, or integrated patio",
        "Higher comfort level, increased maintenance",
      ],
    };
  };

  const category = getCategory();

  return (
    <PageLayout>
      <ProgressBar
        currentStep={STEPS.LIVING.number}
        totalSteps={STEPS.LIVING.total}
        stepLabel={STEPS.LIVING.label}
      />

      <PageHeader
        title="Choose living space"
        subtitle={`Design your home in ${subregion.name} on ${(
          landArea / 10000
        ).toFixed(1)} hectares.`}
      />

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Left: Size selection */}
        <div className="space-y-8">
          <div>
            <div className={`text-base font-medium mb-4`}>{category.label}</div>
            <div className={`text-xs text-gray-600 leading-relaxed mb-6`}>
              {category.description}
            </div>
            <ul className="space-y-2">
              {category.details.map((detail, index) => (
                <li
                  key={index}
                  className="text-xs text-gray-600 flex items-start"
                >
                  <span className="mr-2">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Price display */}
          <div className="border border-black p-8">
            <div className="text-base font-medium mb-2">
              €{homePrice.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Base home cost</div>
            <div className="text-xs text-gray-600">
              +€{buildingLicenseCost.toLocaleString()} building license (
              {subregion.buildingLicensePercent}%)
            </div>
            <div className="text-xs text-gray-600 mt-2">
              Estimated area: ~{homeArea} m²
            </div>
          </div>

          {/* Slider */}
          <div className="relative">
            <style
              dangerouslySetInnerHTML={{
                __html: `
                  .home-slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    background: white;
                    border: 2px solid black;
                    border-radius: 50%;
                    cursor: pointer;
                    position: relative;
                    z-index: 2;
                  }
                  .home-slider::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    background: white;
                    border: 2px solid black;
                    border-radius: 50%;
                    cursor: pointer;
                    position: relative;
                    z-index: 2;
                  }
                  .home-slider::-moz-range-track {
                    background: transparent;
                    border: none;
                  }
                `,
              }}
            />
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              step={step}
              value={homePrice}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
              className="home-slider w-full h-1 bg-gray-200 appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #000 0%, #000 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>€15k</span>
              <span>€100k</span>
              <span>€200k</span>
            </div>
          </div>

          {/* Quick options */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { price: 15000, label: "Minimal", desc: "€15,000" },
              { price: 50000, label: "Comfortable", desc: "€50,000" },
              { price: 130000, label: "Spacious", desc: "€130,000" },
            ].map((option) => (
              <QuickOption
                key={option.price}
                label={option.label}
                description={option.desc}
                selected={Math.abs(homePrice - option.price) < 5000}
                onClick={() => handlePriceChange(option.price)}
              />
            ))}
          </div>
        </div>

        {/* Right: Cost summary */}
        <div className="space-y-8">
          {/* Total cost summary */}
          <div className="border border-black p-8">
            <div className="text-base font-medium mb-6">Investment Summary</div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-xs">
                  Land ({(landArea / 10000).toFixed(1)} ha)
                </span>
                <span className="text-xs font-medium">
                  €{landPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Home construction</span>
                <span className="text-xs font-medium">
                  €{homePrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">
                  Building license ({subregion.buildingLicensePercent}%)
                </span>
                <span className="text-xs font-medium">
                  €{buildingLicenseCost.toLocaleString()}
                </span>
              </div>
              <div className="border-t border-gray-300 pt-4">
                <div className="flex justify-between">
                  <span className="text-base font-medium">Total</span>
                  <span className="text-base font-medium">
                    €{(landPrice + totalHomeCost).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Continue button */}
      <div className="flex justify-between items-center mt-16">
        {onBack && <Button onClick={onBack}>← Back</Button>}
        <div className={onBack ? "" : "ml-auto"}>
          <Button onClick={() => onContinue(totalHomeCost, homeArea)}>
            Continue with €{totalHomeCost.toLocaleString()} home
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}