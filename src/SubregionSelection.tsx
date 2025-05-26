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
        title="Choose Your Perfect Region"
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

          return (
            <SelectionCard
              key={subregion.id}
              title={`${subregion.name}, ${subregion.country}`}
              description={subregion.description}
              selected={selectedSubregion === subregion.id}
              onClick={() => onSelect(subregion.id)}
              badge={matchingTags > 0 ? `${matchingTags} matches` : undefined}
            >
              <div className="space-y-1 text-xs text-gray-500">
                <p>
                  <strong>Region:</strong>{" "}
                  <span className="text-gray-600">{subregion.region}</span>
                </p>
                <p>
                  <strong>Climate:</strong>{" "}
                  {subregion.climate?.map((c) => (
                    <span
                      key={c}
                      className={`mr-1 ${
                        selectedTags.includes(c)
                          ? "text-black font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {c}
                    </span>
                  ))}
                </p>

                <p>
                  <strong>Landscape:</strong>{" "}
                  {subregion.landscape?.map((l) => (
                    <span
                      key={l}
                      className={`mr-1 ${
                        selectedTags.includes(l)
                          ? "text-black font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {l}
                    </span>
                  ))}
                </p>

                <p>
                  <strong>Energy:</strong>{" "}
                  {subregion.energy?.map((e) => (
                    <span
                      key={e}
                      className={`mr-1 ${
                        selectedTags.includes(e)
                          ? "text-black font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {e}
                    </span>
                  ))}
                </p>

                <p>
                  <strong>Vegetables:</strong>{" "}
                  {subregion.vegetables?.map((v) => (
                    <span
                      key={v}
                      className={`mr-1 ${
                        selectedTags.includes(v)
                          ? "text-black font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {v}
                    </span>
                  ))}
                </p>

                <p>
                  <strong>Fruits & Nuts:</strong>{" "}
                  {subregion.fruitsAndNuts?.map((f) => (
                    <span
                      key={f}
                      className={`mr-1 ${
                        selectedTags.includes(f)
                          ? "text-black font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {f}
                    </span>
                  ))}
                </p>

                <p>
                  <strong>Other Food:</strong>{" "}
                  {subregion.otherFoodProduction?.map((o) => (
                    <span
                      key={o}
                      className={`mr-1 ${
                        selectedTags.includes(o)
                          ? "text-black font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {o}
                    </span>
                  ))}
                </p>
              </div>

              <p className="text-xs text-gray-400 mt-2">
                <strong>Rainfall:</strong> {subregion.rainfall} mm/year —
                <strong> Land:</strong> €{subregion.averagePricePerSqm} / m²
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
                    Continue with {subregion.name}
                  </Button>
                </div>
              )}
            </SelectionCard>
          );
        })}
      </div>
    </PageLayout>
  );
}
