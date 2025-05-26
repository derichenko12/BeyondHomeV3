import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Subregion, FoodProductionOption } from "./subregionsData";
import { CartItem } from "./CartContext";
import {
  selfSufficiencyModes,
  SelfSufficiencyMode,
  getFoodMultiplier,
} from "./SelfSufficiencyModes";
import {
  ProgressBar,
  PageHeader,
  PageLayout,
  Button,
  STEPS,
} from "./DesignSystem";

export interface SelectedFoodSystem {
  type: string;
  setupCost: number;
  annualMaintenance: number;
}

interface Props {
  subregion: Subregion;
  landArea: number;
  homeArea: number;
  familySize: number;
  onContinue: (selectedSystems: SelectedFoodSystem[]) => void;
  onUpdateCart: (items: CartItem[]) => void;
  onBack?: () => void;
  existingCartItems: CartItem[];
}

type FoodSystemType = keyof Subregion["foodProduction"];

const foodSystemLabels: Record<FoodSystemType, string> = {
  vegetableGarden: "Vegetable Garden",
  foodForest: "Food Forest",
  greenhouse: "Greenhouse",
  fruitOrchard: "Fruit Orchard",
  poultry: "Poultry",
  beekeeping: "Beekeeping",
  dairy: "Dairy",
};

const foodSystemIcons: Record<FoodSystemType, string> = {
  vegetableGarden: "🥬",
  foodForest: "🌳",
  greenhouse: "🏠",
  fruitOrchard: "🍎",
  poultry: "🐔",
  beekeeping: "🐝",
  dairy: "🐄",
};

// Base space requirements
const baseSpaceRequirements: Record<FoodSystemType, number> = {
  vegetableGarden: 200,
  foodForest: 1000,
  greenhouse: 50,
  fruitOrchard: 500,
  poultry: 100,
  beekeeping: 20,
  dairy: 2000,
};

// Storage and utility buildings space requirements
const utilitySpaceRequirements: Record<FoodSystemType, number> = {
  vegetableGarden: 20,
  foodForest: 30,
  greenhouse: 10,
  fruitOrchard: 40,
  poultry: 30,
  beekeeping: 15,
  dairy: 80,
};

// Weekly work hours estimates
const weeklyHours: Record<FoodSystemType, { peak: number; average: number }> = {
  vegetableGarden: { peak: 8, average: 4 },
  foodForest: { peak: 6, average: 2 },
  greenhouse: { peak: 5, average: 3 },
  fruitOrchard: { peak: 10, average: 2 },
  poultry: { peak: 7, average: 7 },
  beekeeping: { peak: 4, average: 1 },
  dairy: { peak: 20, average: 14 },
};

// Production estimates based on system, family size, and mode
const getProductionEstimate = (
  system: FoodSystemType,
  familySize: number,
  mode: SelfSufficiencyMode
): string => {
  const baseProduction: Record<
    FoodSystemType,
    (size: number, mode: string) => string
  > = {
    vegetableGarden: (size, mode) => {
      const kg = Math.round(
        150 * size * (mode === "hobby" ? 0.3 : mode === "homestead" ? 0.8 : 1.2)
      );
      return `~${kg} kg vegetables/year • Feeds ${size} ${
        size === 1 ? "person" : "people"
      } ${
        mode === "hobby" ? "3-4" : mode === "homestead" ? "8-10" : "12"
      } months`;
    },
    foodForest: (size, mode) => {
      const kg = Math.round(
        100 * size * (mode === "hobby" ? 0.3 : mode === "homestead" ? 0.8 : 1.2)
      );
      return `~${kg} kg fruits & nuts/year • Diverse harvest`;
    },
    greenhouse: (size, mode) => {
      const months =
        mode === "hobby" ? "2-3" : mode === "homestead" ? "6-8" : "10-12";
      return `Year-round growing • Extends season ${months} months`;
    },
    fruitOrchard: (size, mode) => {
      const trees = Math.round(
        10 * size * (mode === "hobby" ? 0.3 : mode === "homestead" ? 0.8 : 1.2)
      );
      return `~${trees} fruit trees • Seasonal abundance`;
    },
    poultry: (size, mode) => {
      const chickens = Math.round(
        4 * size * (mode === "hobby" ? 0.5 : mode === "homestead" ? 1 : 1.5)
      );
      const eggs = chickens * 200;
      return `${chickens} chickens • ~${eggs} eggs/year`;
    },
    beekeeping: (size, mode) => {
      const hives = mode === "hobby" ? 1 : mode === "homestead" ? 2 : 3;
      const honey = hives * 30;
      return `${hives} ${
        hives === 1 ? "hive" : "hives"
      } • ~${honey} kg honey/year`;
    },
    dairy: (size, mode) => {
      const goats = Math.round(
        size * (mode === "hobby" ? 0.5 : mode === "homestead" ? 1 : 1.5)
      );
      return `${goats} ${
        goats === 1 ? "goat" : "goats"
      } • Milk & cheese production`;
    },
  };

  return baseProduction[system](familySize, mode.id);
};

const getFeasibilityColor = (
  feasibility: FoodProductionOption["feasibility"]
) => {
  switch (feasibility) {
    case "recommended":
      return "border-green-600 hover:border-green-700";
    case "challenging":
      return "border-yellow-600 hover:border-yellow-700";
    case "not_recommended":
      return "border-red-600 hover:border-red-700";
    default:
      return "border-gray-300";
  }
};

const getFeasibilityBadge = (
  feasibility: FoodProductionOption["feasibility"]
) => {
  switch (feasibility) {
    case "recommended":
      return {
        text: "Recommended",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
      };
    case "challenging":
      return {
        text: "Challenging",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
      };
    case "not_recommended":
      return {
        text: "Not Recommended",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
      };
  }
};

export default function FoodProductionSelection({
  subregion,
  landArea,
  homeArea,
  familySize,
  onContinue,
  onUpdateCart,
  onBack,
  existingCartItems,
}: Props) {
  const [selectedSystems, setSelectedSystems] = useState<Set<FoodSystemType>>(
    new Set()
  );
  const [selectedMode, setSelectedMode] = useState<SelfSufficiencyMode>(
    selfSufficiencyModes[1]
  );

  // Memoize multipliers
  const { familyMultiplier, totalMultiplier } = useMemo(() => {
    const fm = getFoodMultiplier(familySize);
    const tm = fm * selectedMode.sizeMultiplier;
    return { familyMultiplier: fm, totalMultiplier: tm };
  }, [familySize, selectedMode]);

  // Memoize space requirements
  const spaceRequirements = useMemo(() => {
    return Object.entries(baseSpaceRequirements).reduce((acc, [key, value]) => {
      acc[key as FoodSystemType] = Math.round(value * totalMultiplier);
      return acc;
    }, {} as Record<FoodSystemType, number>);
  }, [totalMultiplier]);

  // Memoize available space calculation
  const { availableSpace, utilitySpace } = useMemo(() => {
    const infrastructureSpace = 200;
    const utilitySpace = Array.from(selectedSystems).reduce(
      (sum, system) => sum + utilitySpaceRequirements[system],
      0
    );
    const reservedSpace = homeArea + infrastructureSpace + utilitySpace;
    return {
      availableSpace: landArea - reservedSpace,
      utilitySpace,
    };
  }, [selectedSystems, homeArea, landArea]);

  // Memoize sorted systems
  const sortedSystems = useMemo(() => {
    return (
      Object.entries(subregion.foodProduction) as [
        FoodSystemType,
        FoodProductionOption
      ][]
    ).sort((a, b) => {
      const order = { recommended: 0, challenging: 1, not_recommended: 2 };
      return order[a[1].feasibility] - order[b[1].feasibility];
    });
  }, [subregion.foodProduction]);

  // Memoize cart items calculation
  const foodCartItems = useMemo(() => {
    const items: CartItem[] = [];

    selectedSystems.forEach((system) => {
      const option = subregion.foodProduction[system];
      const scaledSetupCost = Math.round(
        option.setupCost * selectedMode.costMultiplier
      );
      const scaledAnnualCost = Math.round(
        option.annualMaintenance * selectedMode.costMultiplier
      );
      // Don't apply familyMultiplier here - it will be applied in totalWeeklyHours calculation
      const scaledAvgHours = Math.round(
        weeklyHours[system].average * selectedMode.sizeMultiplier
      );
      const scaledPeakHours = Math.round(
        weeklyHours[system].peak * selectedMode.sizeMultiplier
      );

      items.push(
        {
          label: `${foodSystemLabels[system]} Setup`,
          value: scaledSetupCost,
          type: "money",
        },
        {
          label: `${foodSystemLabels[system]} Annual`,
          value: scaledAnnualCost,
          type: "money",
        },
        {
          label: `${foodSystemLabels[system]} Time (avg)`,
          value: scaledAvgHours,
          type: "time",
          unit: "hrs/week",
        },
        {
          label: `${foodSystemLabels[system]} Time (peak)`,
          value: scaledPeakHours,
          type: "time",
          unit: "hrs/week peak",
        }
      );
    });

    return items;
  }, [selectedSystems, subregion, selectedMode]);

  // Update cart only when foodCartItems change
  useEffect(() => {
    onUpdateCart([...existingCartItems, ...foodCartItems]);
  }, [foodCartItems]); // Убираем existingCartItems и onUpdateCart из зависимостей

  // Optimize toggle system with useCallback
  const toggleSystem = useCallback(
    (system: FoodSystemType) => {
      setSelectedSystems((prevSelected) => {
        const newSelected = new Set(prevSelected);

        if (newSelected.has(system)) {
          newSelected.delete(system);
        } else {
          const currentUsedSpace = Array.from(newSelected).reduce(
            (sum, s) => sum + spaceRequirements[s],
            0
          );
          const newTotalSpace = currentUsedSpace + spaceRequirements[system];

          if (newTotalSpace > availableSpace) {
            return prevSelected;
          }

          newSelected.add(system);
        }

        return newSelected;
      });
    },
    [spaceRequirements, availableSpace]
  );

  // Memoize totals calculation
  const { totalSetupCost, totalAnnualCost, usedSpace, totalWeeklyHours } =
    useMemo(() => {
      const setupCost = Array.from(selectedSystems).reduce((sum, system) => {
        return (
          sum +
          Math.round(
            subregion.foodProduction[system].setupCost *
              selectedMode.costMultiplier
          )
        );
      }, 0);

      const annualCost = Array.from(selectedSystems).reduce((sum, system) => {
        return (
          sum +
          Math.round(
            subregion.foodProduction[system].annualMaintenance *
              selectedMode.costMultiplier
          )
        );
      }, 0);

      const space = Array.from(selectedSystems).reduce(
        (sum, system) => sum + spaceRequirements[system],
        0
      );

      const weeklyHoursCalc = Array.from(selectedSystems).reduce(
        (acc, system) => {
          const hours = weeklyHours[system];
          // Only apply selectedMode.sizeMultiplier, not familyMultiplier
          // (family size doesn't necessarily multiply work hours linearly)
          const scaledHours = {
            peak: Math.round(hours.peak * selectedMode.sizeMultiplier),
            average: Math.round(hours.average * selectedMode.sizeMultiplier),
          };
          acc.peak += scaledHours.peak;
          acc.average += scaledHours.average;
          return acc;
        },
        { peak: 0, average: 0 }
      );

      return {
        totalSetupCost: setupCost,
        totalAnnualCost: annualCost,
        usedSpace: space,
        totalWeeklyHours: weeklyHoursCalc,
      };
    }, [
      selectedSystems,
      subregion,
      selectedMode,
      spaceRequirements,
      familyMultiplier,
    ]);

  const handleContinue = () => {
    const selected: SelectedFoodSystem[] = [];
    selectedSystems.forEach((system) => {
      const option = subregion.foodProduction[system];
      selected.push({
        type: foodSystemLabels[system],
        setupCost: option.setupCost,
        annualMaintenance: option.annualMaintenance,
      });
    });
    onContinue(selected);
  };

  return (
    <PageLayout maxWidth="6xl">
      <ProgressBar
        currentStep={STEPS.FOOD.number}
        totalSteps={STEPS.FOOD.total}
        stepLabel="Food Production"
      />

      <PageHeader
        title="Choose your food production systems"
        subtitle={`Select the systems that match your lifestyle and ${subregion.name}'s conditions.`}
      />

      {/* Mode selection */}
      <div className="mb-8">
        <h3 className="text-base font-medium mb-4">Self-sufficiency level</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selfSufficiencyModes.map((mode) => (
            <div
              key={mode.id}
              onClick={() => setSelectedMode(mode)}
              className={`border p-6 cursor-pointer transition-all ${
                selectedMode.id === mode.id
                  ? "border-black bg-gray-50"
                  : "border-gray-300 hover:border-black"
              }`}
            >
              <h4 className="text-sm font-medium mb-2">{mode.name}</h4>
              <p className="text-xs text-gray-600 mb-2">
                {mode.coverage} of food needs
              </p>
              <p className="text-xs text-gray-600 mb-4">{mode.description}</p>
              <ul className="space-y-1">
                {mode.details.map((detail, idx) => (
                  <li key={idx} className="text-xs text-gray-500">
                    • {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4">
          For {familySize} {familySize === 1 ? "person" : "people"}, systems
          will be sized accordingly
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Food system selection */}
        <div className="space-y-4">
          {sortedSystems.map(([system, option]) => {
            const isSelected = selectedSystems.has(system);
            const badge = getFeasibilityBadge(option.feasibility);
            const systemSpace = spaceRequirements[system];
            const wouldExceedSpace =
              !isSelected && usedSpace + systemSpace > availableSpace;

            return (
              <div
                key={system}
                onClick={() => !wouldExceedSpace && toggleSystem(system)}
                className={`border-2 p-6 cursor-pointer transition-all ${
                  isSelected
                    ? "bg-gray-50 border-black"
                    : wouldExceedSpace
                    ? "bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed"
                    : `bg-white ${getFeasibilityColor(option.feasibility)}`
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{foodSystemIcons[system]}</span>
                    <h3 className="text-base font-medium">
                      {foodSystemLabels[system]}
                    </h3>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${badge.bgColor} ${badge.textColor}`}
                  >
                    {badge.text}
                  </span>
                </div>

                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  {option.description}
                </p>

                {/* Production estimates */}
                <div className="text-xs text-gray-600 mb-2">
                  {getProductionEstimate(system, familySize, selectedMode)}
                </div>

                <div className="flex justify-between text-xs">
                  <div>
                    <span className="text-gray-500">Setup cost: </span>
                    <span className="font-medium">
                      €
                      {Math.round(
                        option.setupCost * selectedMode.costMultiplier
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Annual: </span>
                    <span className="font-medium">
                      €
                      {Math.round(
                        option.annualMaintenance * selectedMode.costMultiplier
                      ).toLocaleString()}
                      /year
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mt-2">
                  Space needed: ~{systemSpace.toLocaleString()} m² +{" "}
                  {utilitySpaceRequirements[system]} m² storage
                </div>

                <div className="text-xs text-gray-500">
                  Time:{" "}
                  {Math.round(
                    weeklyHours[system].average * selectedMode.sizeMultiplier
                  )}{" "}
                  hrs/week (peak:{" "}
                  {Math.round(
                    weeklyHours[system].peak * selectedMode.sizeMultiplier
                  )}{" "}
                  hrs/week)
                </div>

                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs font-medium">✓ Selected</div>
                  </div>
                )}

                {wouldExceedSpace && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs text-red-600">
                      Not enough land space
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Summary and tips */}
        <div className="space-y-8">
          {/* Cost summary */}
          <div className="border border-black p-8">
            <h3 className="text-base font-medium mb-6">
              Food Production Investment
            </h3>

            {/* Space usage indicator */}
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-2">
                <span>Land usage</span>
                <span>
                  {usedSpace.toLocaleString()} /{" "}
                  {availableSpace.toLocaleString()} m²
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 relative">
                <div
                  className="absolute left-0 top-0 h-full bg-black transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (usedSpace / availableSpace) * 100
                    )}%`,
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1 space-y-1">
                <div>
                  Reserved: {homeArea} m² (home) + 200 m² (infrastructure)
                </div>
                {utilitySpace > 0 && (
                  <div>
                    Utility buildings: {utilitySpace} m² (sheds, storage,
                    processing)
                  </div>
                )}
              </div>
            </div>

            {selectedSystems.size === 0 ? (
              <p className="text-xs text-gray-500">
                Select systems to see costs
              </p>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  {Array.from(selectedSystems).map((system) => (
                    <div key={system} className="text-xs">
                      <div className="flex justify-between">
                        <span>{foodSystemLabels[system]} setup</span>
                        <span className="font-medium">
                          €
                          {Math.round(
                            subregion.foodProduction[system].setupCost *
                              selectedMode.costMultiplier
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Total Setup Cost</span>
                    <span>€{totalSetupCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>Annual Maintenance</span>
                    <span>€{totalAnnualCost.toLocaleString()}/year</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Regional tips */}
          <div className="border border-gray-300 p-6">
            <h4 className="text-sm font-medium mb-4">
              {subregion.name} Food Production Tips
            </h4>
            <div className="space-y-3 text-xs text-gray-600">
              <p>
                <strong>Climate:</strong> {subregion.climate.join(", ")} —
                {subregion.rainfall}mm annual rainfall
              </p>
              <p>
                <strong>Traditional crops:</strong>{" "}
                {[...subregion.vegetables, ...subregion.fruitsAndNuts]
                  .slice(0, 5)
                  .join(", ")}
              </p>
              <p>
                <strong>Best systems:</strong>{" "}
                {sortedSystems
                  .filter(([_, opt]) => opt.feasibility === "recommended")
                  .slice(0, 3)
                  .map(([sys, _]) => foodSystemLabels[sys])
                  .join(", ")}
              </p>
            </div>
          </div>

          {/* Work time summary */}
          {selectedSystems.size > 0 && (
            <div className="border border-black p-6">
              <h4 className="text-sm font-medium mb-4">
                Time Commitment (Basic Care Only)
              </h4>
              <div className="space-y-3">
                <div className="text-xs">
                  <div className="flex justify-between mb-2">
                    <span>Average weekly hours:</span>
                    <span className="font-medium">
                      {totalWeeklyHours.average} hours
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Peak season hours:</span>
                    <span className="font-medium">
                      {totalWeeklyHours.peak} hours
                    </span>
                  </div>
                  <div className="text-gray-500 mt-3">
                    {totalWeeklyHours.average < 10 &&
                      "Perfect for weekends and evenings"}
                    {totalWeeklyHours.average >= 10 &&
                      totalWeeklyHours.average < 20 &&
                      "Part-time commitment needed"}
                    {totalWeeklyHours.average >= 20 &&
                      totalWeeklyHours.average < 30 &&
                      "Significant daily work required"}
                    {totalWeeklyHours.average >= 30 &&
                      "Full-time lifestyle commitment"}
                  </div>
                </div>

                <div className="border-t pt-3 text-xs text-gray-500">
                  <p className="font-medium mb-1">Peak seasons:</p>
                  {selectedSystems.has("vegetableGarden") && (
                    <p>• Spring planting & fall harvest</p>
                  )}
                  {selectedSystems.has("fruitOrchard") && (
                    <p>• Fruit harvest & processing</p>
                  )}
                  {selectedSystems.has("dairy") && (
                    <p>• Daily milking year-round</p>
                  )}
                  {selectedSystems.has("poultry") && (
                    <p>• Daily care required</p>
                  )}
                </div>

                <div className="border-t pt-3 text-xs text-gray-500">
                  <p className="font-medium mb-2">Time estimates include:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Basic maintenance & daily care</li>
                    <li>• Harvest time (but NOT processing)</li>
                    <li>• Essential infrastructure repairs</li>
                  </ul>
                  <p className="mt-2 text-xs text-orange-600 font-medium">
                    Add 50-100% more time for:
                  </p>
                  <ul className="space-y-1 text-xs text-orange-600">
                    <li>
                      • Processing & preservation (canning, drying, freezing)
                    </li>
                    <li>• Marketing/selling surplus</li>
                    <li>• Learning curve in first years</li>
                    <li>• Trips for supplies & materials</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Synergies */}
          {selectedSystems.size >= 2 && (
            <div className="border border-gray-300 p-6">
              <h4 className="text-sm font-medium mb-4">System Synergies</h4>
              <div className="space-y-2 text-xs text-gray-600">
                {selectedSystems.has("poultry") &&
                  selectedSystems.has("vegetableGarden") && (
                    <p>
                      • Chickens provide fertilizer for gardens and pest control
                    </p>
                  )}
                {selectedSystems.has("beekeeping") &&
                  selectedSystems.has("fruitOrchard") && (
                    <p>• Bees improve fruit yields through pollination</p>
                  )}
                {selectedSystems.has("dairy") &&
                  selectedSystems.has("vegetableGarden") && (
                    <p>• Manure enriches garden soil naturally</p>
                  )}
                {selectedSystems.has("foodForest") &&
                  selectedSystems.has("poultry") && (
                    <p>• Chickens thrive in food forest understory</p>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-between items-center mt-16">
        {onBack && <Button onClick={onBack}>← Back</Button>}
        <div className={onBack ? "" : "ml-auto"}>
          <Button
            onClick={handleContinue}
            disabled={selectedSystems.size === 0}
          >
            {selectedSystems.size === 0
              ? "Select at least one system"
              : `Continue with ${selectedSystems.size} system${
                  selectedSystems.size !== 1 ? "s" : ""
                }`}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}