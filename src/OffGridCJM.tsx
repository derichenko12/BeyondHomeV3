import { useState, useEffect, useCallback } from "react";
import TagSelector from "./TagSelector";
import { subregionsData, Subregion } from "./subregionsData";
import SubregionSelection from "./SubregionSelection";
import FamilySizeSelection from "./FamilySizeSelection";
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
  | "family"
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
  const [familySize, setFamilySize] = useState<number>(2);
  const [landArea, setLandArea] = useState<number>(5000); // m²
  const [landPrice, setLandPrice] = useState<number>(0);
  const [homeArea, setHomeArea] = useState<number>(0);
  const [selectedFoodSystems, setSelectedFoodSystems] = useState<
    SelectedFoodSystem[]
  >([]);
  const [selectedResources, setSelectedResources] = useState<SelectedResourceData[]>([]);
  const [selectedCreativeSpace, setSelectedCreativeSpace] = useState<CreativeSpace | { name: string; budget: number; icon: string } | null>(null);
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
            title="Start your Off-Grid Journey"
            subtitle="Choose the life you want to live — sustainable, free, and close to nature. This calculator helps you build your off-grid life from scratch: land, food, energy, housing."
          />

          <div className="text-center">
            <Button onClick={() => setStep("tags")}>Begin</Button>
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
        const allTags = [
          ...subregion.vegetables,
          ...subregion.fruitsAndNuts,
          ...subregion.otherFoodProduction,
          ...subregion.climate,
          ...subregion.landscape,
          ...subregion.energy,
        ];
        const score = allTags.filter((tag) =>
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
            if (selectedSubregion) setStep("family");
          }}
        />
      </>
    );
  }

  if (step === "family") {
    return (
      <>
        {renderCart()}
        <FamilySizeSelection
          onContinue={(size) => {
            setFamilySize(size);
            const recommendedAreas: Record<number, number> = {
              1: 3000,
              2: 5000,
              4: 7000,
              6: 10000,
            };
            setLandArea(recommendedAreas[size] || 5000);
            setStep("land");
          }}
          onBack={() => setStep("subregions")}
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
          onBack={() => setStep("family")}
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

    // Get selected region info
    const subregion = subregionsData.find((r) => r.id === selectedSubregion);

    // Calculate investment plan
    const annualReturn = 0.08; // 8% average return
    const investmentPlans = [
      { years: 5, monthly: Math.round(totalWithCushion / (((1 + annualReturn/12) ** (5 * 12) - 1) / (annualReturn/12))) },
      { years: 7, monthly: Math.round(totalWithCushion / (((1 + annualReturn/12) ** (7 * 12) - 1) / (annualReturn/12))) },
      { years: 10, monthly: Math.round(totalWithCushion / (((1 + annualReturn/12) ** (10 * 12) - 1) / (annualReturn/12))) },
      { years: 15, monthly: Math.round(totalWithCushion / (((1 + annualReturn/12) ** (15 * 12) - 1) / (annualReturn/12))) },
    ];

    return (
      <>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @media print {
                body * {
                  visibility: hidden;
                }
                #printable-receipt, #printable-receipt * {
                  visibility: visible;
                }
                #printable-receipt {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                }
                .no-print {
                  display: none !important;
                }
                .print-break {
                  page-break-before: always;
                }
              }
            `,
          }}
        />
        <div className="no-print">{renderCart()}</div>
        <div id="printable-receipt">
          <PageLayout maxWidth="4xl">
            <div className="no-print">
              <ProgressBar
                currentStep={STEPS.RECEIPT.number}
                totalSteps={STEPS.RECEIPT.total}
                stepLabel={STEPS.RECEIPT.label}
              />
            </div>

            <PageHeader
              title="Your Off-Grid Plan"
              subtitle="Complete roadmap for your sustainable living journey"
            />

          {/* 1. Disclaimer */}
          <div className="bg-gray-100 p-8 mb-8">
            <h3 className="text-base font-medium mb-4">Disclaimer. Before you start.</h3>
            <div className="text-xs text-gray-700 space-y-3">
              <p>
                Living off-grid is not a romantic escape. It's hard work, endless projects, and serious time commitment. 
                This lifestyle means building every system — water, energy, food, shelter — from the ground up. 
                It takes time, effort, preparation, patience, practice and knowledge.
              </p>
              <p>You might face:</p>
              <ul className="space-y-1 ml-4">
                <li>— Regulations that may block building on your land.</li>
                <li>— Isolation, where even basic deliveries become complex logistics.</li>
                <li>— Climate challenges, from droughts to storms.</li>
                <li>— Maintenance, because solar panels, filters, septic tanks — they all break.</li>
                <li>— Daily labor, from watering plants to harvesting food to fixing pipes.</li>
                <li>— And many, many other unpredictable things.</li>
              </ul>
              <p>
                No checklist can fully prepare you for this. But it is natural that stepping on a path to freedom 
                involves risks, uncertainty and overcoming fear. But if done right — you will be offered something 
                rare & unique: a life on your own terms, outside the logic of burnout and endless consumption 
                within a capitalistic system.
              </p>
            </div>
          </div>

          {/* 2. Selected Region */}
          {subregion && (
            <div className="border border-black p-8 mb-8">
              <h3 className="text-base font-medium mb-4">
                Your Chosen Region: {subregion.name}, {subregion.country}
              </h3>
              <div className="space-y-4 text-xs">
                <p className="text-gray-700">{subregion.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Climate:</span> {subregion.climate.join(", ")}
                  </div>
                  <div>
                    <span className="font-medium">Landscape:</span> {subregion.landscape.join(", ")}
                  </div>
                  <div>
                    <span className="font-medium">Rainfall:</span> {subregion.rainfall}mm/year
                  </div>
                  <div>
                    <span className="font-medium">Land price:</span> €{subregion.averagePricePerSqm}/m²
                  </div>
                </div>

                <div>
                  <span className="font-medium">Traditional crops:</span>{" "}
                  {[...subregion.vegetables, ...subregion.fruitsAndNuts].slice(0, 8).join(", ")}
                </div>
              </div>
            </div>
          )}

          {/* 3. Cost Breakdown */}
          <div className="border border-black p-8 mb-8">
            <h3 className="text-base font-medium mb-6">Investment Breakdown</h3>
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
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>€{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 -mx-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Financial Cushion (30%)</span>
                  <span className="font-medium">€{financialCushion.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-600">
                  Essential buffer for unexpected costs, delays, mistakes, and learning curve. 
                  Off-grid projects always cost more than planned. This cushion helps you sleep at night.
                </p>
              </div>

              <div className="border-t border-gray-300 pt-3">
                <div className="flex justify-between text-base font-medium">
                  <span>Total Investment Needed</span>
                  <span>€{totalWithCushion.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Time commitment summary */}
          {(avgTimeItems.length > 0 || resourceTimeItems.length > 0) && (
            <div className="border border-black p-8 mb-8">
              <h3 className="text-base font-medium mb-4">Time Commitment</h3>
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

          {/* 4. Nearby Communities */}
          <div className="border border-gray-300 p-8 mb-8">
            <h3 className="text-base font-medium mb-4">Communities & Projects Nearby</h3>
            <p className="text-xs text-gray-600 mb-4">
              You're not alone. Connect with these permaculture projects and eco-communities in your region:
            </p>
            <div className="text-xs text-gray-500">
              [Communities data will be loaded from regionalCommunities.ts]
            </div>
          </div>

          {/* 5. Recommended Companies */}
          <div className="border border-gray-300 p-8 mb-8">
            <h3 className="text-base font-medium mb-4">Recommended Suppliers</h3>
            <div className="space-y-2 text-xs text-gray-500">
              <p>[Modular home builders in your region]</p>
              <p>[Solar installation companies]</p>
              <p>[Water system specialists]</p>
              <p>[Permaculture consultants]</p>
            </div>
          </div>

          {/* 6. Media Resources */}
          <div className="border border-gray-300 p-8 mb-8">
            <h3 className="text-base font-medium mb-4">Learn from Others</h3>
            <p className="text-xs text-gray-600 mb-4">
              Documentaries, YouTube channels, and podcasts to inspire and educate:
            </p>
            <div className="text-xs text-gray-500">
              [Media resources will be loaded from mediaResources.ts]
            </div>
          </div>

          {/* 7. Books & Learning Path */}
          <div className="border border-gray-300 p-8 mb-8">
            <h3 className="text-base font-medium mb-4">Essential Reading</h3>
            <p className="text-xs text-gray-600 mb-4">
              Build your knowledge foundation with these books:
            </p>
            <div className="text-xs text-gray-500">
              [Book recommendations will be loaded from bookResources.ts]
            </div>
          </div>

          {/* 8. Investment Plan */}
          <div className="border border-black p-8 mb-8">
            <h3 className="text-base font-medium mb-4">Investment Timeline</h3>
            <p className="text-xs text-gray-600 mb-4">
              Based on 8% average annual return from index funds. Start investing monthly to reach your goal:
            </p>
            <div className="space-y-3">
              {investmentPlans.map((plan) => (
                <div key={plan.years} className="flex justify-between items-center">
                  <span className="text-sm">{plan.years} years</span>
                  <span className="text-sm font-medium">
                    €{plan.monthly}/month → €{totalWithCushion.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              *Based on historical average returns. Actual returns will vary. Consider consulting a financial advisor.
            </p>
          </div>

          {/* 9. Newsletter Signup */}
          <div className="bg-gray-100 p-8 text-center no-print">
            <h3 className="text-base font-medium mb-4">Continue Your Journey</h3>
            <p className="text-xs text-gray-600 mb-6">
              Get monthly updates on off-grid living, new communities, and practical tips
            </p>
            <div className="inline-flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="px-4 py-2 border border-gray-300 text-sm"
                disabled
              />
              <Button onClick={() => {}}>Subscribe</Button>
            </div>
          </div>

          <div className="text-center mt-12 space-y-4 no-print">
            <div className="flex justify-center gap-4">
              <Button onClick={() => window.print()}>
                Print Receipt
              </Button>
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
                Start New Calculation
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Print this receipt to save your off-grid plan for future reference
            </p>
          </div>
          </PageLayout>
        </div>
      </>
    );
  }

  return null;
}