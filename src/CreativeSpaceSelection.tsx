import React, { useState, useEffect } from "react";
import { CartItem } from "./CartContext";
import {
  ProgressBar,
  PageHeader,
  PageLayout,
  Button,
  STEPS,
} from "./DesignSystem";

export interface CreativeSpace {
  id: string;
  name: string;
  description: string;
  minCost: number;
  maxCost: number;
  area: number;
}

interface CustomSpace {
  name: string;
  budget: number;
}

interface Props {
  onContinue: (space: CreativeSpace | CustomSpace | null) => void;
  onUpdateCart: (items: CartItem[]) => void;
  onBack?: () => void;
  existingCartItems: CartItem[];
}

const templates: CreativeSpace[] = [
  {
    id: "podcast-studio",
    name: "Podcast & Sound Studio",
    description: "A focused, sound-isolated space for your creative work. Perfect for music, content creation, editing, or design. Great for zoning in, layering sound, or recording something honest at 2 a.m.",
    minCost: 2500,
    maxCost: 4000,
    area: 16,
  },
  {
    id: "pottery-studio",
    name: "Pottery Studio",
    description: "A tactile, hands-on space for shaping, grounding, and making with clay. Perfect for throwing on the wheel, hand-building, and quietly waiting while things dry.",
    minCost: 3000,
    maxCost: 5000,
    area: 20,
  },
  {
    id: "writing-cabin",
    name: "Writing & Thinking Cabin",
    description: "A silent room of your own for writing, reading, or just thinking clearly. Perfect for journaling, long-form focus, letters you may never send, or outlining something raw and real.",
    minCost: 1120,
    maxCost: 1120,
    area: 12,
  },
  {
    id: "sport-yoga",
    name: "Sport & Yoga Platform",
    description: "An open-air, shaded surface for expressive movement. Perfect for yoga, dance, tai chi, or just moving your body.",
    minCost: 1500,
    maxCost: 3000,
    area: 20,
  },
  {
    id: "zen-garden",
    name: "Zen Garden",
    description: "A quiet visual poem in the corner of your land. Perfect for stillness, raking patterns in gravel, observing the light shift across stones. Nothing happens here — and that's the point.",
    minCost: 800,
    maxCost: 1800,
    area: 12,
  },
  {
    id: "chilling-pond",
    name: "Chilling Pond",
    description: "A living mirror nestled into your environment. Perfect for slowing down, watching ripples, seeing dragonflies, or just existing beside something calm.",
    minCost: 1500,
    maxCost: 3000,
    area: 10,
  },
];

export default function CreativeSpaceSelection({
  onContinue,
  onUpdateCart,
  onBack,
  existingCartItems,
}: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customSpace, setCustomSpace] = useState<CustomSpace>({
    name: "",
    budget: 0,
  });
  const [skipSpace, setSkipSpace] = useState(false);

  // Update cart when selection changes
  useEffect(() => {
    const cartItems: CartItem[] = [];
    
    if (selectedTemplate) {
      const template = templates.find(t => t.id === selectedTemplate);
      if (template) {
        cartItems.push({
          label: `${template.name} Setup`,
          value: Math.round((template.minCost + template.maxCost) / 2),
          type: "money",
        });
      }
    } else if (showCustomForm && customSpace.name && customSpace.budget > 0) {
      cartItems.push({
        label: `${customSpace.name} Setup`,
        value: customSpace.budget,
        type: "money",
      });
    }
    
    onUpdateCart([...existingCartItems, ...cartItems]);
  }, [selectedTemplate, showCustomForm, customSpace, existingCartItems, onUpdateCart]);

  const handleContinue = () => {
    if (skipSpace) {
      onContinue(null);
    } else if (selectedTemplate) {
      const template = templates.find(t => t.id === selectedTemplate);
      if (template) {
        onContinue(template);
      }
    } else if (showCustomForm && customSpace.name && customSpace.budget > 0) {
      onContinue(customSpace);
    }
  };

  const canContinue = skipSpace || selectedTemplate || (showCustomForm && customSpace.name && customSpace.budget > 0);

  return (
    <PageLayout maxWidth="6xl">
      <ProgressBar
        currentStep={STEPS.CREATIVE.number}
        totalSteps={STEPS.CREATIVE.total}
        stepLabel={STEPS.CREATIVE.label}
      />

      <PageHeader
        title="Hobbies & Creative Interests"
        subtitle="Some people use their cabin for painting. Others run community radio stations. This space is a frame — you choose the picture. What do you imagine doing here?"
      />

      {/* Skip option */}
      <div className="mb-8">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={skipSpace}
            onChange={(e) => {
              setSkipSpace(e.target.checked);
              if (e.target.checked) {
                setSelectedTemplate(null);
                setShowCustomForm(false);
              }
            }}
            className="w-4 h-4"
          />
          <span className="text-[10px] font-mono">Skip creative space (I'll figure this out later)</span>
        </label>
      </div>

      {!skipSpace && (
        <>
          {/* Custom space option - moved to top */}
          <div className="mb-12">
            <div
              onClick={() => {
                setShowCustomForm(!showCustomForm);
                if (!showCustomForm) {
                  setSelectedTemplate(null);
                }
              }}
              className={`border-2 p-6 cursor-pointer transition-all ${
                showCustomForm
                  ? "border-black bg-gray-50"
                  : "border-gray-300 hover:border-black"
              }`}
              style={{ borderWidth: '0.5px' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <h4 className="text-[10px] font-mono uppercase">CREATE YOUR OWN SPACE</h4>
              </div>
              
              {!showCustomForm ? (
                <p className="text-[10px] font-mono text-gray-600">
                  Have something else in mind? Design your own creative space.
                </p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase block mb-2">
                      WHAT'S THE NAME?
                    </label>
                    <input
                      type="text"
                      value={customSpace.name}
                      onChange={(e) => setCustomSpace({ ...customSpace, name: e.target.value })}
                      placeholder="Enter the name of your space"
                      className="w-full px-3 py-2 border border-gray-300 text-[10px] font-mono focus:border-black focus:outline-none"
                      onClick={(e) => e.stopPropagation()}
                      style={{ borderWidth: '0.5px' }}
                    />
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-mono uppercase block mb-2">
                      WHAT'S THE BUDGET?
                    </label>
                    <input
                      type="number"
                      value={customSpace.budget || ""}
                      onChange={(e) => setCustomSpace({ ...customSpace, budget: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 text-[10px] font-mono focus:border-black focus:outline-none"
                      onClick={(e) => e.stopPropagation()}
                      style={{ borderWidth: '0.5px' }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Templates */}
          <div className="border-t border-gray-300 pt-8" style={{ borderWidth: '0.5px' }}>
            <h3 className="text-[16px] font-mono uppercase mb-6">TEMPLATES</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => {
                    // Toggle selection - allow deselect
                    if (selectedTemplate === template.id) {
                      setSelectedTemplate(null);
                    } else {
                      setSelectedTemplate(template.id);
                      setShowCustomForm(false);
                    }
                  }}
                  className={`border-2 p-6 cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? "border-black bg-gray-50"
                      : "border-gray-300 hover:border-black"
                  }`}
                  style={{ borderWidth: '0.5px' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-[10px] font-mono uppercase">{template.name}</h4>
                  </div>
                  
                  <p className="text-[10px] font-mono text-gray-600 mb-4 leading-relaxed">
                    {template.description}
                  </p>
                  
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-gray-500">
                      €{template.minCost.toLocaleString()}-€{template.maxCost.toLocaleString()}
                    </span>
                    <span className="text-gray-500">{template.area} m²</span>
                  </div>
                  
                  {selectedTemplate === template.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200" style={{ borderWidth: '0.5px' }}>
                      <div className="text-[10px] font-mono uppercase text-black">✓ SELECTED</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Action buttons */}
      <div className="flex justify-between items-center mt-12">
        {onBack && <Button onClick={onBack}>← Back</Button>}
        <div className={onBack ? "" : "ml-auto"}>
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
          >
            {skipSpace
              ? "Skip to summary"
              : selectedTemplate
              ? "Continue with selected space"
              : showCustomForm && customSpace.name
              ? `Continue with ${customSpace.name}`
              : "Select or create a space"}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}