import React from "react";

// ========================
// RADICAL MINIMALISM SYSTEM
// Only typography, spacing, composition
// ========================

const TYPE = {
  small: "text-xs leading-relaxed", // 12px - body text, labels
  base: "text-base leading-relaxed", // 16px - headers, emphasis
} as const;

// ========================
// PROGRESS BAR
// ========================

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  stepLabel,
}) => {
  return (
    <div className="flex justify-between items-center py-8 border-b border-black">
      <div className="flex space-x-1">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`w-8 h-1 ${
              index < currentStep ? "bg-black" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <div className={`${TYPE.small} uppercase tracking-wider`}>
        {stepLabel} {currentStep}/{totalSteps}
      </div>
    </div>
  );
};

// ========================
// HEADERS
// ========================

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="py-12">
      <h1 className={`${TYPE.base} font-medium mb-4 max-w-2xl`}>{title}</h1>
      {subtitle && (
        <p className={`${TYPE.small} text-gray-600 max-w-xl`}>{subtitle}</p>
      )}
    </div>
  );
};

// ========================
// LAYOUT
// ========================

interface PageLayoutProps {
  children: React.ReactNode;
  maxWidth?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  maxWidth = "4xl",
}) => {
  const maxWidthClass = maxWidth === "6xl" ? "max-w-6xl" : "max-w-4xl";
  return (
    <div className={`${maxWidthClass} mx-auto px-8 pb-16`}>{children}</div>
  );
};

interface CardProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => {
  return <div className="border border-black p-8 my-8">{children}</div>;
};

// ========================
// INTERACTIONS
// ========================

interface ButtonProps {
  children: React.ReactNode;
  onClick: (e?: any) => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  fullWidth = false,
}) => {
  const baseClasses = `${TYPE.small} border border-black px-6 py-3 transition-colors`;
  const stateClasses = disabled
    ? "text-gray-400 border-gray-200 cursor-not-allowed"
    : "hover:bg-black hover:text-white";
  const widthClasses = fullWidth ? "w-full" : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${stateClasses} ${widthClasses}`}
    >
      {children}
    </button>
  );
};

interface TagButtonProps {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export const TagButton: React.FC<TagButtonProps> = ({
  label,
  selected,
  disabled = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${TYPE.small} px-4 py-2 border transition-colors ${
        selected
          ? "bg-black text-white border-black"
          : disabled
          ? "text-gray-400 border-gray-200 cursor-not-allowed"
          : "border-gray-300 hover:border-black"
      }`}
    >
      {label}
    </button>
  );
};

// ========================
// CONTENT
// ========================

interface SelectionCardProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  children?: React.ReactNode;
  badge?: string;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  title,
  description,
  selected,
  onClick,
  children,
  badge,
}) => {
  return (
    <div
      className={`border cursor-pointer transition-colors p-8 ${
        selected
          ? "border-black bg-gray-50"
          : "border-gray-300 hover:border-black"
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-6">
        <h3 className={`${TYPE.base} font-medium`}>{title}</h3>
        {badge && (
          <div className={`${TYPE.small} px-3 py-1 bg-black text-white`}>
            {badge}
          </div>
        )}
      </div>

      <p className={`${TYPE.small} text-gray-600 mb-8 leading-relaxed`}>
        {description}
      </p>

      {children}
    </div>
  );
};

interface CategorySectionProps {
  title: string;
  children: React.ReactNode;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  children,
}) => {
  return (
    <div className="mb-8">
      <h2 className={`${TYPE.base} font-medium mb-4`}>{title}</h2>
      <div className="flex flex-wrap gap-3">{children}</div>
    </div>
  );
};

interface QuickOptionProps {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export const QuickOption: React.FC<QuickOptionProps> = ({
  label,
  description,
  selected,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-6 border transition-colors text-left ${
        selected
          ? "border-black bg-gray-50"
          : "border-gray-300 hover:border-black"
      }`}
    >
      <div className={`${TYPE.base} font-medium mb-2`}>{label}</div>
      <div className={`${TYPE.small} text-gray-600`}>{description}</div>
    </button>
  );
};

interface SummaryBoxProps {
  title: string;
  children: React.ReactNode;
}

export const SummaryBox: React.FC<SummaryBoxProps> = ({ title, children }) => {
  return (
    <div className="border border-black p-8 my-8">
      <h4 className={`${TYPE.base} font-medium mb-4`}>{title}</h4>
      {children}
    </div>
  );
};

// ========================
// STEPS
// ========================

export const STEPS = {
  WELCOME: { number: 1, label: "Welcome", total: 10 },
  TAGS: { number: 2, label: "Preferences", total: 10 },
  SUBREGIONS: { number: 3, label: "Location", total: 10 },
  FAMILY: { number: 4, label: "Family Size", total: 10 },
  LAND: { number: 5, label: "Land", total: 10 },
  LIVING: { number: 6, label: "Living Space", total: 10 },
  FOOD: { number: 7, label: "Food Production", total: 10 },
  RESOURCES: { number: 8, label: "Resources", total: 10 },
  CREATIVE: { number: 9, label: "Creative Space", total: 10 },
  RECEIPT: { number: 10, label: "Summary", total: 10 },
} as const;
