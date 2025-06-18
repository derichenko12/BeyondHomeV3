import { useState, useEffect, useCallback } from "react";
import TagSelector from "./TagSelector";
import { subregionsData, Subregion } from "./subregionsData";
import SubregionSelection from "./SubregionSelection";
import LandSizeSlider from "./LandSizeSelection";
import LivingSpaceSelection from "./LivingSpaceSelection";
import FoodProductionSelection from "./FoodProductionSelection";
import SimpleResourceSelection, { SelectedResourceData } from "./SimpleResourceSelection";
import CreativeSpaceSelection, { CreativeSpace } from "./CreativeSpaceSelection";
import Cart from "./Cart";
import ReceiptPrinter from "./ReceiptPrinter";
import { useCart, CartItem } from "./CartContext";
import {
  ProgressBar,
  PageHeader,
  PageLayout,
  Button,
  STEPS,
} from "./DesignSystem";

type StepType =
  | "welcome"
  | "tags"
  | "subregions"
  | "land"
  | "living"
  | "food"
  | "resources"
  | "creative"
  | "receipt";

interface SelectedFoodSystem {
  type: string;
  setupCost: number;
  annualMaintenance: number;
}

export default function OffGridCJM() {
  const [step, setStep] = useState<StepType>("welcome");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSubregion, setSelectedSubregion] = useState<string | null>(
    null
  );
  const [familySize, setFamilySize] = useState<number>(2); // Default to 2
  const [landArea, setLandArea] = useState<number>(5000); // m²
  const [landPrice, setLandPrice] = useState<number>(0);
  const [homeArea, setHomeArea] = useState<number>(0);
  const [selectedFoodSystems, setSelectedFoodSystems] = useState<
    SelectedFoodSystem[]
  >([]);
  const [selectedResources, setSelectedResources] = useState<SelectedResourceData[]>([]);
  const [selectedCreativeSpace, setSelectedCreativeSpace] = useState<CreativeSpace | { name: string; budget: number } | null>(null);
  const [baseCartItems, setBaseCartItems] = useState<CartItem[]>([]);

  const { updateCart, items: cartItems } = useCart();

  // Memoize the updateCart callback to prevent infinite loops
  const stableUpdateCart = useCallback((items: CartItem[]) => {
    updateCart(items);
  }, [updateCart]);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const renderCart = () => <Cart />;

  if (step === "welcome") {
    return (
      <>
        {renderCart()}
        <PageLayout>
          <ProgressBar
            currentStep={STEPS.WELCOME.number}
            totalSteps={STEPS.WELCOME.total}
            stepLabel={STEPS.WELCOME.label}
          />

          <PageHeader
            title="Welcome to Loam"
            subtitle=""
          />

<div className="space-y-6 max-w-3xl mx-auto">
  <p className="text-[10px] font-mono leading-relaxed text-gray-700">
    A tool for planning a self-sufficient Homestead. Find out the real
    cost in terms of money, time and effort.
  </p>
</div>

          <div className="text-center mt-12">
            <Button onClick={() => setStep("tags")}>Begin your journey</Button>
          </div>
        </PageLayout>
      </>
    );
  }

  if (step === "tags") {
    return (
      <>
        {renderCart()}
        <TagSelector
          archetype="sage"
          onContinue={(tags) => {
            setSelectedTags(tags);
            setStep("subregions");
          }}
        />
      </>
    );
  }

  if (step === "subregions") {
    const scoredSubregions: (Subregion & { score: number })[] =
      subregionsData.map((subregion) => {
        const regionTags = [
          ...subregion.landscape,
          ...subregion.climate,
          ...subregion.gardens,
          ...subregion.otherFoodSources,
        ];
        const score = regionTags.filter((tag) =>
          selectedTags.includes(tag)
        ).length;
        return { ...subregion, score };
      });

    const sortedSubregions = scoredSubregions.sort((a, b) => b.score - a.score);

    return (
      <>
        {renderCart()}
        <SubregionSelection
          subregions={sortedSubregions}
          selectedTags={selectedTags}
          selectedSubregion={selectedSubregion}
          onSelect={setSelectedSubregion}
          onContinue={() => {
            if (selectedSubregion) {
              setLandArea(5000); // Default land area
              setStep("land");
            }
          }}
        />
      </>
    );
  }

  if (step === "land") {
    const subregion = subregionsData.find((r) => r.id === selectedSubregion);
    if (!subregion) return null;

    return (
      <>
        {renderCart()}
        <LandSizeSlider
          subregion={subregion}
          familySize={familySize}
          onContinue={(areaM2) => {
            setLandArea(areaM2);
            const price = Math.round(areaM2 * subregion.averagePricePerSqm);
            setLandPrice(price);
            const newCartItems: CartItem[] = [
              {
                label: `Land (${(areaM2 / 10000).toFixed(1)} ha)`,
                value: price,
                type: "money",
              },
            ];
            stableUpdateCart(newCartItems);
            setStep("living");
          }}
          onBack={() => setStep("subregions")}
          onUpdateCart={stableUpdateCart}
        />
      </>
    );
  }

  if (step === "living") {
    const subregion = subregionsData.find((r) => r.id === selectedSubregion);
    if (!subregion) return null;

    return (
      <>
        {renderCart()}
        <LivingSpaceSelection
          subregion={subregion}
          landArea={landArea}
          landPrice={landPrice}
          onContinue={(totalHomeCost, area) => {
            setHomeArea(area);
            const hectares = (landArea / 10000).toFixed(1);
            const newBaseItems: CartItem[] = [
              {
                label: `Land (${hectares} ha)`,
                value: landPrice,
                type: "money",
              },
              { label: "Home & License", value: totalHomeCost, type: "money" },
            ];
            setBaseCartItems(newBaseItems);
            setStep("food");
          }}
          onUpdateCart={stableUpdateCart}
          onBack={() => setStep("land")}
        />
      </>
    );
  }

  if (step === "food") {
    const subregion = subregionsData.find((r) => r.id === selectedSubregion);
    if (!subregion) return null;

    return (
      <>
        {renderCart()}
        <FoodProductionSelection
          subregion={subregion}
          landArea={landArea}
          homeArea={homeArea}
          familySize={familySize}
          onContinue={(systems) => {
            setSelectedFoodSystems(systems);
            // Сохраняем текущее состояние корзины как базовое для следующего шага
            setBaseCartItems([...cartItems]);
            setStep("resources");
          }}
          onUpdateCart={stableUpdateCart}
          onBack={() => setStep("living")}
          existingCartItems={baseCartItems}
        />
      </>
    );
  }

  if (step === "resources") {
    const subregion = subregionsData.find((r) => r.id === selectedSubregion);
    if (!subregion) return null;

    return (
      <>
        {renderCart()}
        <SimpleResourceSelection
          subregion={subregion}
          homeArea={homeArea}
          familySize={familySize}
          onContinue={(resources) => {
            setSelectedResources(resources);
            // Сохраняем текущее состояние корзины для следующего шага
            setBaseCartItems([...cartItems]);
            setStep("creative");
          }}
          onUpdateCart={stableUpdateCart}
          onBack={() => setStep("food")}
          existingCartItems={baseCartItems}
        />
      </>
    );
  }

  if (step === "creative") {
    return (
      <>
        {renderCart()}
        <CreativeSpaceSelection
          onContinue={(space) => {
            setSelectedCreativeSpace(space);
            setStep("receipt");
          }}
          onUpdateCart={stableUpdateCart}
          onBack={() => setStep("resources")}
          existingCartItems={baseCartItems}
        />
      </>
    );
  }

  
  if (step === "receipt") {
    const moneyItems = cartItems.filter((item) => item.type !== "time");
    const timeItems = cartItems.filter((item) => item.type === "time");
    const avgTimeItems = timeItems.filter((item) =>
      item.label.includes("(avg)")
    );
    const peakTimeItems = timeItems.filter((item) =>
      item.label.includes("(peak)")
    );

    const total = moneyItems.reduce((sum, item) => sum + item.value, 0);
    const financialCushion = Math.round(total * 0.3);
    const totalWithCushion = total + financialCushion;
    const totalAvgTime = avgTimeItems.reduce(
      (sum, item) => sum + item.value,
      0
    );
    const totalPeakTime = peakTimeItems.reduce(
      (sum, item) => sum + item.value,
      0
    );
    
    // Calculate resource time separately
    const resourceTimeItems = timeItems.filter(item => 
      !item.label.includes("(avg)") && !item.label.includes("(peak)")
    );
    const totalResourceTime = resourceTimeItems.reduce(
      (sum, item) => sum + item.value,
      0
    );
    const totalWeeklyTime = totalAvgTime + totalResourceTime;

    // Prepare receipt data
    const subregion = subregionsData.find((r) => r.id === selectedSubregion)!;
    
    // Calculate costs by category
    const landCost = moneyItems.find(item => item.label.includes("Land"))?.value || 0;
    const homeCost = moneyItems.find(item => item.label.includes("Home"))?.value || 0;
    
    const foodSystemsCost = moneyItems
      .filter(item => selectedFoodSystems.some(fs => item.label.includes(fs.type)))
      .reduce((sum, item) => sum + item.value, 0);
    
    const resourceSystemsCost = moneyItems
      .filter(item => selectedResources.some(r => item.label.includes(r.resource.name)))
      .reduce((sum, item) => sum + item.value, 0);
    
    const creativeSpaceCost = moneyItems
      .filter(item => selectedCreativeSpace && item.label.includes(selectedCreativeSpace.name))
      .reduce((sum, item) => sum + item.value, 0) || 0;
    
    const annualCosts = moneyItems
      .filter(item => item.label.includes("Annual"))
      .reduce((sum, item) => sum + item.value, 0);

    const receiptData = {
      subregion,
      landCost,
      homeCost,
      foodSystemsCost,
      resourceSystemsCost,
      creativeSpaceCost,
      totalCost: total,
      annualCosts,
      weeklyHours: totalWeeklyTime,
      peakHours: totalPeakTime + totalResourceTime,
      selectedFoodSystems: selectedFoodSystems.map(fs => fs.type),
      selectedResourceSystems: selectedResources.map(r => r.resource.name),
      creativeSpace: selectedCreativeSpace?.name || null,
      familySize,
      landArea,
      homeArea,
    };

    return (
      <>
        {renderCart()}
        <PageLayout>
          <ProgressBar
            currentStep={STEPS.RECEIPT.number}
            totalSteps={STEPS.RECEIPT.total}
            stepLabel={STEPS.RECEIPT.label}
          />

          <PageHeader
            title="Your Off-Grid Plan"
            subtitle="Complete summary of your personalized off-grid setup."
          />

          <div className="max-w-2xl mx-auto">
            <div className="border border-black p-8">
              <h3 className="text-base font-medium mb-6">
                Investment Breakdown
              </h3>
              <div className="space-y-3">
                {moneyItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="font-medium">
                      €{item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between text-base font-medium">
                    <span>Total Investment</span>
                    <span>€{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Time commitment summary */}
            {(avgTimeItems.length > 0 || resourceTimeItems.length > 0) && (
              <div className="border border-black p-8 mt-6">
                <h4 className="text-base font-medium mb-4">Time Commitment</h4>
                <div className="space-y-2">
                  {avgTimeItems.map((item, index) => {
                    const systemName = item.label.replace(" Time (avg)", "");
                    const peakItem = peakTimeItems.find((p) =>
                      p.label.includes(systemName)
                    );

                    return (
                      <div key={index} className="flex justify-between text-xs">
                        <span>{systemName}</span>
                        <span className="font-medium text-blue-700">
                          {item.value} hrs/week (peak:{" "}
                          {peakItem?.value || item.value} hrs)
                        </span>
                      </div>
                    );
                  })}
                  {resourceTimeItems.map((item, index) => (
                    <div key={`resource-${index}`} className="flex justify-between text-xs">
                      <span>{item.label.replace(" Time", "")}</span>
                      <span className="font-medium text-blue-700">
                        {item.value} hrs/week
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-gray-300 pt-3 mt-3">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Total Weekly Hours</span>
                      <span className="text-blue-700">
                        {totalWeeklyTime.toFixed(1)} hrs average
                      </span>
                    </div>
                    {totalPeakTime > 0 && (
                      <div className="flex justify-between text-sm font-medium">
                        <span>Peak Season Hours</span>
                        <span className="text-blue-700">
                          {(totalPeakTime + totalResourceTime).toFixed(1)} hrs/week
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-gray-600 mt-2">
                      {totalWeeklyTime < 10 && "Perfect for weekends and evenings"}
                      {totalWeeklyTime >= 10 &&
                        totalWeeklyTime < 20 &&
                        "Part-time commitment"}
                      {totalWeeklyTime >= 20 &&
                        totalWeeklyTime < 30 &&
                        "Significant daily work"}
                      {totalWeeklyTime >= 30 && "Full-time lifestyle"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Selected systems summary */}
            {(selectedFoodSystems.length > 0 || selectedResources.length > 0 || selectedCreativeSpace) && (
              <div className="border border-black p-8 mt-6">
                <h4 className="text-base font-medium mb-4">
                  Selected Systems
                </h4>
                
                {selectedFoodSystems.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-medium mb-2">Food Production</h5>
                    <div className="space-y-1">
                      {selectedFoodSystems.map((system, index) => (
                        <div key={index} className="text-xs">
                          <span className="font-medium">{system.type}</span>
                          <span className="text-gray-600 ml-2">
                            (€{system.annualMaintenance.toLocaleString()}/year)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedResources.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-medium mb-2">Infrastructure Systems</h5>
                    <div className="space-y-1">
                      {selectedResources.map((item, index) => {
                        const resource = item.resource;
                        const variant = resource.variants?.find(v => v.id === item.variantId);
                        return (
                          <div key={index} className="text-xs">
                            <span className="font-medium">{resource.name}</span>
                            {variant && <span className="text-gray-600 ml-1">({variant.name})</span>}
                            <span className="text-gray-600 ml-2">
                              (€{resource.annualCost}/year)
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {selectedCreativeSpace && (
                  <div>
                    <h5 className="text-sm font-medium mb-2">Creative Space</h5>
                    <div className="text-xs">
                      <span className="font-medium">
                        {selectedCreativeSpace.name}
                      </span>
                      {'area' in selectedCreativeSpace && (
                        <span className="text-gray-600 ml-2">({selectedCreativeSpace.area} m²)</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Receipt Printer Component */}
            <ReceiptPrinter receiptData={receiptData} />
          </div>

          <div className="text-center mt-12">
            <p className="text-xs text-gray-600 mb-6">
              Your journey is complete!
            </p>
            <Button
              onClick={() => {
                setStep("welcome");
                stableUpdateCart([]);
                setSelectedFoodSystems([]);
                setSelectedResources([]);
                setSelectedCreativeSpace(null);
                setBaseCartItems([]);
              }}
            >
              Start Over
            </Button>
          </div>
        </PageLayout>
      </>
    );
  }

  return null;
}