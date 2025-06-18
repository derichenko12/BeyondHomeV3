import { Subregion } from "./subregionsData";
import {
  ProgressBar,
  PageHeader,
  PageLayout,
  SelectionCard,
  Button,
  STEPS,
} from "./DesignSystem";

interface Props {
  subregions: (Subregion & { score: number })[];
  selectedTags: string[];
  selectedSubregion: string | null;
  onSelect: (id: string) => void;
  onContinue: () => void;
}

// Map subregion IDs to their image files
const regionImages: Record<string, string> = {
  andalusia: "/regions/andalusia.png",
  asturias: "/regions/asturias.png",
  algarve: "/regions/algarve.png",
  "northern-portugal": "/regions/northern-portugal.png",
  provence: "/regions/provence.png",
  brittany: "/regions/brittany.png",
  bavaria: "/regions/bavaria.png",
  brandenburg: "/regions/brandenburg.png",
  carinthia: "/regions/carinthia.png",
  "south-bohemia": "/regions/south-bohemia.png",
  dalarna: "/regions/dalarna.png",
};

export default function SubregionSelection({
  subregions,
  selectedTags,
  selectedSubregion,
  onSelect,
  onContinue,
}: Props) {
  return (
    <PageLayout maxWidth="6xl">
      <ProgressBar
        currentStep={STEPS.SUBREGIONS.number}
        totalSteps={STEPS.SUBREGIONS.total}
        stepLabel={STEPS.SUBREGIONS.label}
      />
      <PageHeader
        title="CHOOSE YOUR PERFECT REGION"
        subtitle="Find the region that matches your preferences and growing goals."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subregions.map((subregion) => {
          const matchingTags = [
            ...subregion.landscape,
            ...subregion.climate,
            ...subregion.gardens,
            ...subregion.otherFoodSources,
          ].filter((tag) => selectedTags.includes(tag)).length;

          const imagePath = regionImages[subregion.id] || "/regions/andalusia.png";

          return (
            <div
              key={subregion.id}
              className={`border cursor-pointer transition-colors overflow-hidden ${
                selectedSubregion === subregion.id
                  ? "border-black bg-gray-50"
                  : "border-gray-400 hover:border-black"
              }`}
              style={{ borderWidth: '0.5px' }}
              onClick={() => onSelect(subregion.id)}
            >
              {/* Region image at the top - 16:9 aspect ratio */}
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <img 
                  src={imagePath} 
                  alt={subregion.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: "grayscale(100%) contrast(1.2)" }}
                />
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-[16px] font-mono uppercase">{`${subregion.name}, ${subregion.country}`}</h3>
                  {matchingTags > 0 && (
                    <div className="text-[10px] font-mono uppercase px-3 py-1 bg-black text-white">
                      {matchingTags} matches
                    </div>
                  )}
                </div>

                <p className="text-[10px] font-mono text-gray-600 mb-8 leading-relaxed">
                  {subregion.description}
                </p>

                <div className="space-y-3 text-[10px] font-mono">
                  <div className="flex items-start gap-3">
                    <span className="text-gray-500 font-medium min-w-[90px]">CLIMATE:</span>
                    <div className="flex flex-wrap gap-2">
                      {subregion.climate?.map((c) => (
                        <span
                          key={c}
                          className={`px-3 py-1 border rounded-full ${
                            selectedTags.includes(c)
                              ? "border-black bg-gray-100 text-black font-medium"
                              : "border-gray-300 text-gray-600"
                          }`}
                        >
                          {c.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-gray-500 font-medium min-w-[90px]">LANDSCAPE:</span>
                    <div className="flex flex-wrap gap-2">
                      {subregion.landscape?.map((l) => (
                        <span
                          key={l}
                          className={`px-3 py-1 border rounded-full ${
                            selectedTags.includes(l)
                              ? "border-black bg-gray-100 text-black font-medium"
                              : "border-gray-300 text-gray-600"
                          }`}
                        >
                          {l.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-gray-500 font-medium min-w-[90px]">PERFECT FOR:</span>
                    <div className="flex flex-wrap gap-2">
                      {[...subregion.gardens, ...subregion.otherFoodSources].map((item) => (
                        <span
                          key={item}
                          className={`px-3 py-1 border rounded-full ${
                            selectedTags.includes(item)
                              ? "border-black bg-gray-100 text-black font-medium"
                              : "border-gray-300 text-gray-600"
                          }`}
                        >
                          {item.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <span className="text-gray-500 font-medium min-w-[90px]">LAND PRICE:</span>
                    <span className="text-gray-600">€{subregion.averagePricePerSqm} / M²</span>
                  </div>
                </div>

                {selectedSubregion === subregion.id && (
                  <div className="mt-6">
                    <Button
                      onClick={(e) => {
                        if (e) e.stopPropagation();
                        onContinue();
                      }}
                      fullWidth
                    >
                      CHOOSE {subregion.name.toUpperCase()}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}