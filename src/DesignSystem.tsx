import React from "react";

// ========================
// WIREFRAME DESIGN SYSTEM
// Monospace only, 10px and 16px, minimal strokes
// ========================

const TYPE = {
  small: "text-[10px] font-mono leading-relaxed", // 10px - body text, labels
  base: "text-[16px] font-mono leading-relaxed", // 16px - headers
  smallCaps: "text-[10px] font-mono uppercase tracking-wider", // 10px uppercase
  baseCaps: "text-[16px] font-mono uppercase tracking-wider", // 16px uppercase
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
    <div className="flex justify-between items-center py-8 border-b border-black" style={{ borderWidth: '0.5px' }}>
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
      <div className={`${TYPE.smallCaps}`}>
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
      <h1 className={`${TYPE.baseCaps} mb-4 max-w-2xl`}>{title}</h1>
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
    <div className={`${maxWidthClass} mx-auto px-8 pb-16 font-mono`}>{children}</div>
  );
};

interface CardProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => {
  return <div className="border border-black p-8 my-8" style={{ borderWidth: '0.5px' }}>{children}</div>;
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
  const baseClasses = `${TYPE.smallCaps} border border-black px-6 py-3 transition-colors`;
  const stateClasses = disabled
    ? "text-gray-400 border-gray-400 cursor-not-allowed"
    : "hover:bg-black hover:text-white";
  const widthClasses = fullWidth ? "w-full" : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${stateClasses} ${widthClasses}`}
      style={{ borderWidth: '0.5px' }}
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
          ? "text-gray-400 border-gray-400 cursor-not-allowed"
          : "border-gray-400 hover:border-black"
      }`}
      style={{ borderWidth: '0.5px' }}
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
          : "border-gray-400 hover:border-black"
      }`}
      style={{ borderWidth: '0.5px' }}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-6">
        <h3 className={`${TYPE.baseCaps}`}>{title}</h3>
        {badge && (
          <div className={`${TYPE.smallCaps} px-3 py-1 bg-black text-white`}>
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
      <h2 className={`${TYPE.baseCaps} mb-4`}>{title}</h2>
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
          : "border-gray-400 hover:border-black"
      }`}
      style={{ borderWidth: '0.5px' }}
    >
      <div className={`${TYPE.smallCaps} mb-2`}>{label}</div>
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
    <div className="border border-black p-8 my-8" style={{ borderWidth: '0.5px' }}>
      <h4 className={`${TYPE.baseCaps} mb-4`}>{title}</h4>
      {children}
    </div>
  );
};

// ========================
// STEPS - Updated for combined land & home step
// ========================

export const STEPS = {
  WELCOME: { number: 1, label: "Welcome", total: 9 },
  TAGS: { number: 2, label: "Preferences", total: 9 },
  SUBREGIONS: { number: 3, label: "Location", total: 9 },
  FAMILY: { number: 4, label: "Family Size", total: 9 },
  LAND_AND_HOME: { number: 5, label: "Land & Home", total: 9 },
  FOOD: { number: 6, label: "Food Production", total: 9 },
  RESOURCES: { number: 7, label: "Resources", total: 9 },
  CREATIVE: { number: 8, label: "Creative Space", total: 9 },
  RECEIPT: { number: 9, label: "Summary", total: 9 },
} as const;