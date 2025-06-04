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
  familySize: number;
  onContinue: (areaM2: number) => void;
  onBack?: () => void;
  onUpdateCart?: (items: CartItem[]) => void;
}

export default function LandSizeSlider({
  subregion,
  familySize,
  onContinue,
  onBack,
  onUpdateCart,
}: Props) {
  const [area, setArea] = useState(5000); // m²
  const maxArea = 10000; // 1 hectare
  const hectare = (area / 10000).toFixed(1);
  const price = Math.round(area * subregion.averagePricePerSqm);

  // Football field comparison (standard field = 7140 m²)
  const footballFields = (area / 7140).toFixed(1);

  // Calculate percentage relative to max area
  const percentage = Math.min(100, (area / maxArea) * 100);

  // Update cart when area changes
  React.useEffect(() => {
    if (onUpdateCart) {
      const cartItems: CartItem[] = [
        { label: `Land (${hectare} ha)`, value: price },
      ];
      onUpdateCart(cartItems);
    }
  }, [area, price, hectare, onUpdateCart]);

  const getCategory = () => {
    if (area <= 5000)
      return {
        label: "Small & Minimal",
        description:
          "A cozy wooden cabin surrounded by enough garden to grow your daily vegetables.",
      };
    if (area <= 8000)
      return {
        label: "Medium & Comfortable",
        description:
          "A proper home with space to breathe. Room for fruit trees, a workshop, maybe a few chickens.",
      };
    return {
      label: "Large & Spacious",
      description:
        "Your own small world. Space for guests, seasonal farming, maybe a pond.",
    };
  };

  const category = getCategory();

  return (
    <PageLayout>
      <ProgressBar
        currentStep={STEPS.LAND.number}
        totalSteps={STEPS.LAND.total}
        stepLabel={STEPS.LAND.label}
      />

      <PageHeader
        title="How much space do you need?"
        subtitle={`In ${
          subregion.name
        }, choose the land size that fits your vision for ${familySize} ${
          familySize === 1 ? "person" : "people"
        }.`}
      />

      {/* Main content with fixed width */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Size selection */}
          <div className="space-y-8">
            <div>
              <div className={`text-base font-medium mb-4`}>
                {category.label}
              </div>
              <div className={`text-xs text-gray-600 leading-relaxed`}>
                {category.description}
              </div>
            </div>

            {/* Size display */}
            <div className="border border-black p-8">
              <div className="text-base font-medium mb-2">
                {area.toLocaleString()} m²
              </div>
              <div className="text-xs text-gray-600">{hectare} hectares</div>
              <div className="text-xs text-gray-600 whitespace-nowrap">
                {footballFields} football{" "}
                {parseFloat(footballFields) === 1 ? "field" : "fields"}
              </div>
            </div>

           {/* Slider */}
           <div className="relative">
              <style
                dangerouslySetInnerHTML={{
                  __html: `
                    .land-slider::-webkit-slider-thumb {
                      appearance: none;
                      width: 2px;
                      height: 24px;
                      background: black;
                      cursor: pointer;
                      position: relative;
                      z-index: 2;
                    }
                    .land-slider::-moz-range-thumb {
                      width: 2px;
                      height: 24px;
                      background: black;
                      border: none;
                      cursor: pointer;
                      position: relative;
                      z-index: 2;
                    }
                    .land-slider::-webkit-slider-runnable-track {
                      height: 1px;
                      background: black;
                    }
                    .land-slider::-moz-range-track {
                      height: 1px;
                      background: black;
                    }
                  `,
                }}
              />
              <input
                type="range"
                min={1000}
                max={maxArea}
                step={250}
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="land-slider w-full h-6 bg-transparent appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>0.1 ha</span>
                <span>0.5 ha</span>
                <span>1.0 ha</span>
              </div>
            </div>

            {/* Quick options */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { size: 2000, label: "Minimal", desc: "0.2 ha" },
                { size: 5000, label: "Balanced", desc: "0.5 ha" },
                { size: 8000, label: "Spacious", desc: "0.8 ha" },
              ].map((option) => (
                <QuickOption
                  key={option.size}
                  label={option.label}
                  description={option.desc}
                  selected={Math.abs(area - option.size) < 500}
                  onClick={() => setArea(option.size)}
                />
              ))}
            </div>
          </div>

          {/* Right: Price & visualization */}
          <div className="space-y-8">
            {/* Price summary */}
            <div className="border border-black p-8">
              <div className="text-base font-medium mb-6">
                Investment Summary
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-xs">Land price ({subregion.name})</span>
                  <span className="text-xs font-medium">
                    €{subregion.averagePricePerSqm}/m²
                  </span>
                </div>
                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between">
                    <span className="text-base font-medium">Total</span>
                    <span className="text-base font-medium">
                      €{price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual scale with football field overlay */}
            <div>
              <div className="text-xs text-gray-600 mb-4">Visual scale</div>
              <div className="w-full h-48 bg-gray-50 border border-gray-300 relative overflow-hidden">
                {/* Your land */}
                <div
                  className="absolute bottom-4 left-4 bg-black transition-all duration-300"
                  style={{
                    width: `${Math.max(20, (percentage / 100) * 200)}px`,
                    height: `${Math.max(20, (percentage / 100) * 150)}px`,
                  }}
                />

                {/* Football field overlay - positioned to overlap with land when similar size */}
                <div
                  className="absolute bottom-4 left-4 border-2 border-gray-400"
                  style={{
                    width: "142px", // 71.4% of max width (football field is 7140m²)
                    height: "107px", // maintain aspect ratio
                    backgroundColor: "rgba(156, 163, 175, 0.2)", // light gray with transparency
                  }}
                >
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="text-xs text-gray-600">⚽</span>
                  </div>
                </div>

                {/* Labels */}
                <div className="absolute top-2 right-2 text-xs text-gray-500">
                  1 hectare = full area
                </div>
              </div>
              <div className="text-xs text-gray-600 mt-2">
                Black = your land | Gray = football field (7,140 m²)
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between items-center mt-16">
          {onBack && <Button onClick={onBack}>← Back</Button>}
          <div className={onBack ? "" : "ml-auto"}>
            <Button onClick={() => onContinue(area)}>
              Continue with {hectare} hectares
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}