// src/DesignSystem.tsx
import React from "react";

// ========================
// TYPOGRAPHY WITH CUSTOM FONTS
// ========================

const TYPE = {
  // Размеры
  xs: "text-xs", // 12px
  sm: "text-sm", // 14px
  base: "text-base", // 16px
  lg: "text-lg", // 18px
  xl: "text-xl", // 20px
  "2xl": "text-2xl", // 24px
  
  // Веса шрифтов
  light: "font-light", // 300
  regular: "font-normal", // 400
  medium: "font-medium", // 500
  bold: "font-bold", // 700
  
  // Композиции для разных случаев
  small: "text-xs leading-relaxed font-normal", // 12px - body text, labels
  body: "text-sm leading-relaxed font-normal", // 14px - основной текст
  headline: "text-base leading-tight font-medium", // 16px - заголовки
  title: "text-xl leading-tight font-light", // 20px - большие заголовки
  display: "text-2xl leading-tight font-light", // 24px - акцентные заголовки
} as const;

// ========================
// COLORS FOR GLASSMORPHISM
// ========================

const COLORS = {
  // Для использования в glassmorphism UI
  glass: {
    white: "bg-white/10 backdrop-blur-md",
    dark: "bg-black/10 backdrop-blur-md",
    border: "border-white/20",
  },
  // Текст
  text: {
    primary: "text-gray-900",
    secondary: "text-gray-600",
    tertiary: "text-gray-400",
    inverse: "text-white",
    inverseSecondary: "text-white/70",
  }
} as const;

// ========================
// HEADERS
// ========================

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  inverse?: boolean; // для использования на темном фоне
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, inverse = false }) => {
  return (
    <div className="py-12 fade-in">
      <h1 className={`font-custom ${TYPE.display} mb-4 max-w-2xl ${inverse ? COLORS.text.inverse : COLORS.text.primary}`}>
        {title}
      </h1>
      {subtitle && (
        <p className={`font-custom ${TYPE.body} max-w-xl ${inverse ? COLORS.text.inverseSecondary : COLORS.text.secondary}`}>
          {subtitle}
        </p>
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
    <div className={`${maxWidthClass} mx-auto px-8 pb-16 text-white`}>{children}</div>
  );
};

// ========================
// CARDS WITH GLASSMORPHISM
// ========================

interface CardProps {
  children: React.ReactNode;
  variant?: "light" | "dark";
}

export const Card: React.FC<CardProps> = ({ children, variant = "light" }) => {
  const bgClass = variant === "light" 
    ? "bg-white/10 backdrop-blur-md border-white/20" 
    : "bg-black/10 backdrop-blur-md border-black/20";
    
  return (
    <div className={`${bgClass} border rounded-2xl p-8 my-8 transition-all hover:bg-white/15`}>
      {children}
    </div>
  );
};

// ========================
// BUTTONS
// ========================

interface ButtonProps {
  children: React.ReactNode;
  onClick: (e?: any) => void;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: "primary" | "secondary" | "glass";
  size?: "small" | "medium" | "large";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  variant = "primary",
  size = "medium",
}) => {
  // Размеры
  const sizeClasses = {
    small: `${TYPE.small} px-4 py-2`,
    medium: `${TYPE.body} px-6 py-3`,
    large: `${TYPE.headline} px-8 py-4`,
  };

  // Варианты
  const variantClasses = {
    primary: disabled
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-white text-black hover:bg-gray-100",
    secondary: disabled
      ? "border border-gray-300 text-gray-400 cursor-not-allowed"
      : "border border-white text-white hover:bg-white hover:text-black",
    glass: disabled
      ? "bg-white/5 backdrop-blur-sm border border-white/10 text-white/50 cursor-not-allowed"
      : "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20",
  };

  const baseClasses = `
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    rounded-full
    transition-all
    duration-200
    ${fullWidth ? "w-full" : ""}
    font-medium
  `;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {children}
    </button>
  );
};

// ========================
// TAG BUTTONS
// ========================

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
      className={`
        ${TYPE.small} 
        px-4 py-2 
        rounded-full 
        border 
        transition-all
        duration-200
        ${
          selected
            ? "bg-white text-black border-white"
            : disabled
            ? "text-white/30 border-white/20 cursor-not-allowed"
            : "border-white/40 text-white/80 hover:border-white hover:text-white"
        }
      `}
    >
      {label}
    </button>
  );
};

// ========================
// SELECTION CARDS
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
      className={`
        border 
        rounded-2xl 
        cursor-pointer 
        transition-all
        duration-200
        p-8 
        ${
          selected
            ? "border-white bg-white/20 backdrop-blur-md"
            : "border-white/30 bg-white/10 backdrop-blur-sm hover:border-white/50 hover:bg-white/15"
        }
      `}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-6">
        <h3 className={`${TYPE.headline} text-white`}>{title}</h3>
        {badge && (
          <div className={`${TYPE.small} px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white`}>
            {badge}
          </div>
        )}
      </div>

      <p className={`${TYPE.body} text-white/70 mb-8 leading-relaxed`}>
        {description}
      </p>

      {children}
    </div>
  );
};

// ========================
// CATEGORY SECTIONS
// ========================

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
      <h2 className={`${TYPE.headline} ${COLORS.text.inverse} mb-4`}>{title}</h2>
      <div className="flex flex-wrap gap-3">{children}</div>
    </div>
  );
};

// ========================
// QUICK OPTIONS
// ========================

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
      className={`
        p-6 
        rounded-2xl
        border 
        transition-all
        duration-200
        text-left 
        ${
          selected
            ? "border-white bg-white/20 backdrop-blur-md"
            : "border-white/30 bg-white/10 backdrop-blur-sm hover:border-white/50"
        }
      `}
    >
      <div className={`${TYPE.headline} text-white mb-2`}>{label}</div>
      <div className={`${TYPE.small} text-white/60`}>{description}</div>
    </button>
  );
};

// ========================
// SUMMARY BOX
// ========================

interface SummaryBoxProps {
  title: string;
  children: React.ReactNode;
}

export const SummaryBox: React.FC<SummaryBoxProps> = ({ title, children }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 my-8">
      <h4 className={`${TYPE.headline} text-white mb-4`}>{title}</h4>
      {children}
    </div>
  );
};

// ========================
// PROGRESS BAR (DEPRECATED - kept for compatibility)
// ========================

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = () => {
  // Оставляем пустым, так как навигация теперь в ModalContainer
  return null;
};

// ========================
// STEPS (kept for compatibility)
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