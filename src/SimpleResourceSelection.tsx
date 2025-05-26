import { useState, useMemo, useEffect } from "react";
import { Subregion } from "./subregionsData";
import { CartItem } from "./CartContext";
import {
  simpleResources,
  SimpleResource,
  ResourceCategory,
  categoryInfo,
  getAvailableResources,
  getResourceRecommendation,
  calculateResourceCosts,
} from "./SimpleResources";
import {
  ProgressBar,
  PageHeader,
  PageLayout,
  Button,
  STEPS,
} from "./DesignSystem";

export interface SelectedResourceData {
  resource: SimpleResource;
  variantId?: string;
}

interface Props {
  subregion: Subregion;
  homeArea: number;
  familySize: number;
  onContinue: (selectedResources: SelectedResourceData[]) => void;
  onUpdateCart: (items: CartItem[]) => void;
  onBack?: () => void;
  existingCartItems: CartItem[];
}

export default function SimpleResourceSelection({
  subregion,
  homeArea,
  familySize,
  onContinue,
  onUpdateCart,
  onBack,
  existingCartItems,
}: Props) {
  // Combine all region tags
  const regionTags = useMemo(() => [
    ...subregion.climate,
    ...subregion.landscape,
    ...subregion.energy,
  ], [subregion]);

  // Get available resources for this region
  const availableResources = useMemo(
    () => getAvailableResources(simpleResources, regionTags),
    [regionTags]
  );

  // Group resources by category
  const resourcesByCategory = useMemo(() => {
    const grouped: Record<ResourceCategory, SimpleResource[]> = {
      energy: [],
      water: [],
      heating: [],
      irrigation: [],
    };
    
    availableResources.forEach(resource => {
      grouped[resource.category].push(resource);
    });
    
    // Sort by recommendation level
    Object.keys(grouped).forEach(category => {
      grouped[category as ResourceCategory].sort((a, b) => {
        const aRec = getResourceRecommendation(a, regionTags);
        const bRec = getResourceRecommendation(b, regionTags);
        const order = { "highly-recommended": 0, "recommended": 1, "available": 2 };
        return order[aRec] - order[bRec];
      });
    });
    
    return grouped;
  }, [availableResources, regionTags]);

  // Selected resources state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  // Auto-select some recommended resources on mount
  useEffect(() => {
    const autoSelected = new Set<string>();
    
    // Auto-select one highly recommended from each required category
    ["energy", "water", "heating"].forEach(category => {
      const resources = resourcesByCategory[category as ResourceCategory];
      const highlyRecommended = resources.find(r => 
        getResourceRecommendation(r, regionTags) === "highly-recommended"
      );
      if (highlyRecommended) {
        autoSelected.add(highlyRecommended.id);
        // Set default variant if exists
        if (highlyRecommended.variants) {
          setSelectedVariants(prev => ({
            ...prev,
            [highlyRecommended.id]: highlyRecommended.variants![0].id
          }));
        }
      }
    });
    
    setSelectedIds(autoSelected);
  }, [resourcesByCategory, regionTags]);

  // Toggle resource selection
  const toggleResource = (resourceId: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(resourceId)) {
        newSet.delete(resourceId);
      } else {
        newSet.add(resourceId);
      }
      return newSet;
    });
  };

  // Update variant selection
  const setVariant = (resourceId: string, variantId: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [resourceId]: variantId
    }));
  };

  // Calculate totals
  const { totalSetupCost, totalAnnualCost, totalWeeklyHours, cartItems } = useMemo(() => {
    let setupCost = 0;
    let annualCost = 0;
    let weeklyHours = 0;
    const cartItems: CartItem[] = [];

    selectedIds.forEach(id => {
      const resource = availableResources.find(r => r.id === id);
      if (!resource) return;

      // Get costs (with scaling)
      const costs = calculateResourceCosts(resource, homeArea, familySize);
      
      // Check for variant pricing
      if (resource.variants && selectedVariants[id]) {
        const variant = resource.variants.find(v => v.id === selectedVariants[id]);
        if (variant) {
          costs.setupCost = variant.setupCost;
          costs.annualCost = variant.annualCost;
        }
      }

      setupCost += costs.setupCost;
      annualCost += costs.annualCost;
      weeklyHours += resource.weeklyHours;

      // Add to cart
      cartItems.push(
        {
          label: `${resource.name} Setup`,
          value: costs.setupCost,
          type: "money",
        },
        {
          label: `${resource.name} Annual`,
          value: costs.annualCost,
          type: "money",
        }
      );

      if (resource.weeklyHours > 0) {
        cartItems.push({
          label: `${resource.name} Time`,
          value: resource.weeklyHours,
          type: "time",
          unit: "hrs/week",
        });
      }
    });

    return { totalSetupCost: setupCost, totalAnnualCost: annualCost, totalWeeklyHours: weeklyHours, cartItems };
  }, [selectedIds, selectedVariants, availableResources, homeArea, familySize]);

  // Update cart in useEffect
  useEffect(() => {
    onUpdateCart([...existingCartItems, ...cartItems]);
  }, [cartItems]); // Только cartItems в зависимостях

  // Check if all required categories have selections
  const hasRequiredSelections = useMemo(() => {
    const selectedResources = availableResources.filter(r => selectedIds.has(r.id));
    const hasEnergy = selectedResources.some(r => r.category === "energy");
    const hasWater = selectedResources.some(r => r.category === "water");
    const hasHeating = selectedResources.some(r => r.category === "heating");
    return hasEnergy && hasWater && hasHeating;
  }, [selectedIds, availableResources]);

  const handleContinue = () => {
    const selected: SelectedResourceData[] = [];
    selectedIds.forEach(id => {
      const resource = availableResources.find(r => r.id === id);
      if (resource) {
        selected.push({
          resource,
          variantId: selectedVariants[id]
        });
      }
    });
    onContinue(selected);
  };

  // Render resource card
  const renderResource = (resource: SimpleResource) => {
    const isSelected = selectedIds.has(resource.id);
    const recommendation = getResourceRecommendation(resource, regionTags);
    const costs = calculateResourceCosts(resource, homeArea, familySize);

    const getBadgeStyle = () => {
      switch (recommendation) {
        case "highly-recommended":
          return "bg-green-100 text-green-800";
        case "recommended":
          return "bg-blue-100 text-blue-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    const getBorderStyle = () => {
      if (isSelected) return "border-black bg-gray-50";
      switch (recommendation) {
        case "highly-recommended":
          return "border-green-500 hover:border-green-600";
        case "recommended":
          return "border-blue-500 hover:border-blue-600";
        default:
          return "border-gray-300 hover:border-gray-400";
      }
    };

    return (
      <div
        key={resource.id}
        onClick={() => toggleResource(resource.id)}
        className={`border-2 p-4 cursor-pointer transition-all ${getBorderStyle()}`}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{resource.icon}</span>
            <h4 className="text-sm font-medium">{resource.name}</h4>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${getBadgeStyle()}`}>
            {recommendation.replace("-", " ")}
          </span>
        </div>

        <p className="text-xs text-gray-600 mb-3">{resource.description}</p>

        <div className="flex justify-between text-xs">
          <div>
            <span className="text-gray-500">Setup: </span>
            <span className="font-medium">€{costs.setupCost.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-500">Annual: </span>
            <span className="font-medium">€{costs.annualCost}/year</span>
          </div>
        </div>

        {resource.weeklyHours > 0 && (
          <div className="text-xs text-gray-500 mt-1">
            Time: {resource.weeklyHours} hrs/week
          </div>
        )}

        {/* Variant selection */}
        {isSelected && resource.variants && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs font-medium mb-2">Choose size:</div>
            <div className="space-y-1">
              {resource.variants.map(variant => (
                <label
                  key={variant.id}
                  className="flex items-center gap-2 text-xs cursor-pointer"
                  onClick={e => e.stopPropagation()}
                >
                  <input
                    type="radio"
                    name={`variant-${resource.id}`}
                    checked={selectedVariants[resource.id] === variant.id}
                    onChange={() => setVariant(resource.id, variant.id)}
                  />
                  <span>{variant.name}</span>
                  <span className="text-gray-500">
                    €{variant.setupCost.toLocaleString()}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {isSelected && (
          <div className="mt-3 text-xs font-medium text-green-700">
            ✓ Selected
          </div>
        )}
      </div>
    );
  };

  return (
    <PageLayout maxWidth="6xl">
      <ProgressBar
        currentStep={STEPS.RESOURCES.number}
        totalSteps={STEPS.RESOURCES.total}
        stepLabel={STEPS.RESOURCES.label}
      />

      <PageHeader
        title="Essential Systems & Infrastructure"
        subtitle={`Choose the systems that will power your off-grid life in ${subregion.name}.`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - 2 columns on desktop */}
        <div className="lg:col-span-2 space-y-8">
          {/* Render each category */}
          {(Object.keys(categoryInfo) as ResourceCategory[]).map(category => {
            const resources = resourcesByCategory[category];
            const info = categoryInfo[category];
            
            if (resources.length === 0) return null;

            return (
              <div key={category}>
                <div className="mb-4">
                  <h3 className="text-base font-medium mb-1">{info.label}</h3>
                  <p className="text-xs text-gray-600">{info.description}</p>
                  {info.required && (
                    <p className="text-xs text-red-600 mt-1">* Required</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resources.map(renderResource)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar summary */}
        <div className="space-y-6">
          <div className="border border-black p-6 sticky top-8">
            <h3 className="text-base font-medium mb-4">Systems Summary</h3>
            
            {selectedIds.size === 0 ? (
              <p className="text-xs text-gray-500">No systems selected</p>
            ) : (
              <div className="space-y-4">
                {/* Selected items */}
                <div className="space-y-2">
                  {Array.from(selectedIds).map(id => {
                    const resource = availableResources.find(r => r.id === id);
                    if (!resource) return null;
                    
                    const costs = calculateResourceCosts(resource, homeArea, familySize);
                    const finalCost = resource.variants && selectedVariants[id]
                      ? resource.variants.find(v => v.id === selectedVariants[id])?.setupCost || costs.setupCost
                      : costs.setupCost;

                    return (
                      <div key={id} className="flex justify-between text-xs">
                        <span>{resource.icon} {resource.name}</span>
                        <span className="font-medium">
                          €{finalCost.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Total Setup Cost</span>
                    <span>€{totalSetupCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>Annual Costs</span>
                    <span>€{totalAnnualCost.toLocaleString()}/year</span>
                  </div>
                  {totalWeeklyHours > 0 && (
                    <div className="flex justify-between text-xs text-blue-700 mt-2">
                      <span>Weekly Maintenance</span>
                      <span>{totalWeeklyHours} hrs/week</span>
                    </div>
                  )}
                </div>

                {/* Missing requirements */}
                {!hasRequiredSelections && (
                  <div className="text-xs text-red-600 mt-3">
                    Please select at least one system from each required category.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Regional tips */}
          <div className="border border-gray-300 p-4">
            <h4 className="text-sm font-medium mb-3">Tips for {subregion.name}</h4>
            <div className="space-y-2 text-xs text-gray-600">
              {subregion.climate.includes("Sufficient Sun") && (
                <p>• Solar systems work excellently in your sunny climate</p>
              )}
              {subregion.climate.includes("Cold Winters") && (
                <p>• Consider wood or pellet stoves for reliable winter heating</p>
              )}
              {subregion.landscape.includes("Coastline") && (
                <p>• Wind power could be a great option near the coast</p>
              )}
              {subregion.rainfall < 600 && (
                <p>• Water conservation systems are essential in your dry region</p>
              )}
              {subregion.rainfall > 1000 && (
                <p>• Rainwater harvesting is highly effective with your rainfall</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-between items-center mt-12">
        {onBack && <Button onClick={onBack}>← Back</Button>}
        <div className={onBack ? "" : "ml-auto"}>
          <Button
            onClick={handleContinue}
            disabled={!hasRequiredSelections}
          >
            {!hasRequiredSelections
              ? "Select required systems"
              : `Continue with ${selectedIds.size} systems`}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}