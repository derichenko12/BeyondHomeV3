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
            ...subregion.vegetables,
            ...subregion.fruitsAndNuts,
            ...subregion.otherFoodProduction,
            ...subregion.climate,
            ...subregion.landscape,
            ...subregion.energy,
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

                <div className="space-y-1 text-[10px] font-mono text-gray-500">
                  <p>
                    <strong>REGION:</strong>{" "}
                    <span className="text-gray-600">{subregion.region}</span>
                  </p>
                  <p>
                    <strong>CLIMATE:</strong>{" "}
                    {subregion.climate?.map((c) => (
                      <span
                        key={c}
                        className={`mr-1 ${
                          selectedTags.includes(c)
                            ? "text-black font-bold"
                            : "text-gray-500"
                        }`}
                      >
                        {c}
                      </span>
                    ))}
                  </p>

                  <p>
                    <strong>LANDSCAPE:</strong>{" "}
                    {subregion.landscape?.map((l) => (
                      <span
                        key={l}
                        className={`mr-1 ${
                          selectedTags.includes(l)
                            ? "text-black font-bold"
                            : "text-gray-500"
                        }`}
                      >
                        {l}
                      </span>
                    ))}
                  </p>

                  <p>
                    <strong>ENERGY:</strong>{" "}
                    {subregion.energy?.map((e) => (
                      <span
                        key={e}
                        className={`mr-1 ${
                          selectedTags.includes(e)
                            ? "text-black font-bold"
                            : "text-gray-500"
                        }`}
                      >
                        {e}
                      </span>
                    ))}
                  </p>

                  <p>
                    <strong>VEGETABLES:</strong>{" "}
                    {subregion.vegetables?.map((v) => (
                      <span
                        key={v}
                        className={`mr-1 ${
                          selectedTags.includes(v)
                            ? "text-black font-bold"
                            : "text-gray-500"
                        }`}
                      >
                        {v}
                      </span>
                    ))}
                  </p>

                  <p>
                    <strong>FRUITS & NUTS:</strong>{" "}
                    {subregion.fruitsAndNuts?.map((f) => (
                      <span
                        key={f}
                        className={`mr-1 ${
                          selectedTags.includes(f)
                            ? "text-black font-bold"
                            : "text-gray-500"
                        }`}
                      >
                        {f}
                      </span>
                    ))}
                  </p>

                  <p>
                    <strong>OTHER FOOD:</strong>{" "}
                    {subregion.otherFoodProduction?.map((o) => (
                      <span
                        key={o}
                        className={`mr-1 ${
                          selectedTags.includes(o)
                            ? "text-black font-bold"
                            : "text-gray-500"
                        }`}
                      >
                        {o}
                      </span>
                    ))}
                  </p>
                </div>

                <p className="text-[10px] font-mono text-gray-400 mt-2">
                  <strong>RAINFALL:</strong> {subregion.rainfall} mm/year —
                  <strong> LAND:</strong> €{subregion.averagePricePerSqm} / m²
                </p>

                {selectedSubregion === subregion.id && (
                  <div className="mt-4">
                    <Button
                      onClick={(e) => {
                        if (e) e.stopPropagation();
                        onContinue();
                      }}
                      fullWidth
                    >
                      CONTINUE WITH {subregion.name.toUpperCase()}
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