import { useState } from "react";
import { tagsData } from "./tagsData";
import {
  ProgressBar,
  PageHeader,
  PageLayout,
  CategorySection,
  TagButton,
  Button,
  STEPS,
} from "./DesignSystem";

interface Tag {
  label: string;
  conflict: string[];
}

interface TagSelectorProps {
  archetype: "sage" | "balance" | "nomad";
  onContinue: (tags: string[]) => void;
}

const TagSelector = ({ archetype, onContinue }: TagSelectorProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Explicitly type categories
  const categories: Record<string, Tag[]> = tagsData[archetype].categories;

  const toggleTag = (tag: string, conflictTags: string[]) => {
    const allTags: Tag[] = Object.values(categories).flat();

    if (selectedTags.includes(tag)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    } else {
      // Remove all tags that conflict with the selected tag
      const toRemove = new Set(conflictTags);

      // Also remove all tags for which this tag is a conflict
      selectedTags.forEach((selected) => {
        const selectedTag = allTags.find((t) => t.label === selected);
        if (selectedTag?.conflict.includes(tag)) {
          toRemove.add(selected);
        }
      });

      const updated = selectedTags.filter((t) => !toRemove.has(t));
      setSelectedTags([...updated, tag]);
    }
  };

  return (
    <PageLayout>
      <ProgressBar
        currentStep={STEPS.TAGS.number}
        totalSteps={STEPS.TAGS.total}
        stepLabel={STEPS.TAGS.label}
      />

      <PageHeader
        title="What kind of life do you want to grow?"
        subtitle="Choose the elements that matter most to your off-grid lifestyle. We'll find regions that match your vision."
      />

      <div className="space-y-8">
        {Object.entries(categories).map(([categoryName, tags]) => (
          <CategorySection key={categoryName} title={categoryName}>
            {tags.map(({ label, conflict }) => {
              const selected = selectedTags.includes(label);

              const allTags: Tag[] = Object.values(categories).flat();

              const isConflicted = selectedTags.some((selected) => {
                const selectedTag = allTags.find((t) => t.label === selected);
                return (
                  selectedTag?.conflict.includes(label) ||
                  conflict.includes(selected)
                );
              });

              return (
                <TagButton
                  key={label}
                  label={label}
                  selected={selected}
                  disabled={isConflicted && !selected}
                  onClick={() =>
                    !isConflicted || selected
                      ? toggleTag(label, conflict)
                      : () => {}
                  }
                />
              );
            })}
          </CategorySection>
        ))}
      </div>

      <div className="mt-8">
        <Button onClick={() => onContinue(selectedTags)} disabled={false}>
          Continue with {selectedTags.length} preference
          {selectedTags.length !== 1 ? "s" : ""}
        </Button>
      </div>
    </PageLayout>
  );
};

export default TagSelector;
