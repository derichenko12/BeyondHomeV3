import React, { useState } from "react";
import { Subregion } from "./subregionsData";
import { Button } from "./DesignSystem";

interface ReceiptData {
  // Region data
  subregion: Subregion;
  
  // Cost breakdown
  landCost: number;
  homeCost: number;
  foodSystemsCost: number;
  resourceSystemsCost: number;
  creativeSpaceCost: number;
  totalCost: number;
  annualCosts: number;
  
  // Time commitment
  weeklyHours: number;
  peakHours: number;
  
  // Selected systems
  selectedFoodSystems: string[];
  selectedResourceSystems: string[];
  creativeSpace: string | null;
  
  // Family and land info
  familySize: number;
  landArea: number;
  homeArea: number;
}

interface Props {
  receiptData: ReceiptData;
}

export default function ReceiptPrinter({ receiptData }: Props) {
  const [isPrinting, setIsPrinting] = useState(false);

  const formatReceipt = () => {
    const lines: string[] = [];
    const lineWidth = 28; // Increased for 58mm printer (was 32)
    
    // Helper to format number without spaces
    const formatNumber = (num: number): string => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    // Helper to center text
    const center = (text: string) => {
      if (text.length >= lineWidth) return text.substring(0, lineWidth);
      const padding = Math.floor((lineWidth - text.length) / 2);
      return " ".repeat(Math.max(0, padding)) + text;
    };
    
    // Helper to format line with dots
    const formatLine = (label: string, value: string) => {
      // Remove any spaces from value for consistent formatting
      value = value.replace(/\s/g, '');
      
      // Calculate available space
      const totalLength = lineWidth;
      const valueLength = value.length;
      const minDots = 2;
      
      // If value is too long, just return truncated version
      if (valueLength >= totalLength - minDots - 2) {
        console.warn(`Value too long: ${value} (${valueLength} chars)`);
        return label.substring(0, 10) + ".." + value;
      }
      
      const maxLabelLength = totalLength - valueLength - minDots;
      
      // Truncate label if too long
      if (label.length > maxLabelLength) {
        label = label.substring(0, maxLabelLength);
      }
      
      // Calculate dots to fill the space
      const dotsCount = totalLength - label.length - valueLength;
      const dots = ".".repeat(Math.max(minDots, dotsCount));
      
      const result = label + dots + value;
      
      // Final safety check
      return result.substring(0, lineWidth);
    };
    
    // Helper to wrap text
    const wrapText = (text: string, maxWidth: number = lineWidth): string[] => {
      const words = text.split(' ');
      const wrapped: string[] = [];
      let currentLine = '';
      
      words.forEach(word => {
        if (currentLine.length + word.length + 1 > maxWidth) {
          if (currentLine) wrapped.push(currentLine.trim());
          currentLine = word + ' ';
        } else {
          currentLine += word + ' ';
        }
      });
      
      if (currentLine.trim()) wrapped.push(currentLine.trim());
      return wrapped;
    };
    
    // Calculate financial cushion (30% of total)
    const financialCushion = Math.round(receiptData.totalCost * 0.3);
    const totalWithCushion = receiptData.totalCost + financialCushion;
    
    // Add BOM for proper encoding
    lines.push('\uFEFF'); // UTF-8 BOM
    
    // 1. DISCLAIMER
    lines.push(center("OFF-GRID REALITY CHECK"));
    lines.push(center("========================================"));
    lines.push("");
    lines.push(center("BEFORE YOU START"));
    lines.push("");
    
    const disclaimerText = "Living off-grid is not a romantic escape. It's hard work, endless projects, and serious time commitment. This lifestyle means building every system from the ground up. You might face regulations, isolation, climate challenges, and daily maintenance. But done right, you'll have something rare: life on your terms.";
    
    wrapText(disclaimerText).forEach(line => lines.push(line));
    lines.push("");
    lines.push("----------------------------------------");
    lines.push("");
    
    // 2. SELECTED REGION
    lines.push(center("YOUR CHOSEN LAND"));
    lines.push(center(receiptData.subregion.name.toUpperCase()));
    lines.push(center(receiptData.subregion.country));
    lines.push("");
    
    // Climate - wrap if needed
    const climate = receiptData.subregion.climate.join(", ");
    if (climate.length > lineWidth - 9) {
      lines.push("CLIMATE:");
      wrapText(climate, lineWidth - 2).forEach(line => lines.push("  " + line));
    } else {
      lines.push(`CLIMATE: ${climate}`);
    }
    
    // Landscape - wrap if needed
    const landscape = receiptData.subregion.landscape.join(", ");
    if (landscape.length > lineWidth - 11) {
      lines.push("LANDSCAPE:");
      wrapText(landscape, lineWidth - 2).forEach(line => lines.push("  " + line));
    } else {
      lines.push(`LANDSCAPE: ${landscape}`);
    }
    
    lines.push(`RAINFALL: ${receiptData.subregion.rainfall}mm/year`);
    lines.push(`LAND: €${receiptData.subregion.averagePricePerSqm}/m²`);
    
    // Energy if available
    if (receiptData.subregion.energy.length > 0) {
      const energy = receiptData.subregion.energy.join(", ");
      if (energy.length > lineWidth - 8) {
        lines.push("ENERGY:");
        wrapText(energy, lineWidth - 2).forEach(line => lines.push("  " + line));
      } else {
        lines.push(`ENERGY: ${energy}`);
      }
    }
    lines.push("");
    
    // Traditional crops
    const allCrops = [
      ...receiptData.subregion.vegetables,
      ...receiptData.subregion.fruitsAndNuts,
      ...receiptData.subregion.otherFoodProduction
    ].slice(0, 8); // Limit to 8 most important
    
    lines.push("TRADITIONAL CROPS:");
    const cropsText = allCrops.join(", ");
    wrapText(cropsText, lineWidth - 2).forEach(line => lines.push("  " + line));
    lines.push("");
    lines.push("--------------------------------");
    lines.push("");
    
    // 3. COST BREAKDOWN - DETAILED
    lines.push(center("INVESTMENT BREAKDOWN"));
    lines.push("");
    
    // Land cost
    lines.push(formatLine("Land", `€${formatNumber(receiptData.landCost)}`));
    
    // Home cost (if separate from license)
    const homeCostOnly = Math.round(receiptData.homeCost / (1 + receiptData.subregion.buildingLicensePercent / 100));
    const licenseCost = receiptData.homeCost - homeCostOnly;
    lines.push(formatLine("Home", `€${formatNumber(homeCostOnly)}`));
    lines.push(formatLine("License", `€${formatNumber(licenseCost)}`));
    
    // Food systems breakdown
    if (receiptData.selectedFoodSystems.length > 0) {
      lines.push("");
      lines.push("FOOD SYSTEMS:");
      const foodCostPerSystem = Math.round(receiptData.foodSystemsCost / receiptData.selectedFoodSystems.length);
      receiptData.selectedFoodSystems.forEach(system => {
        // Show each food system with shorter names
        let shortName = system;
        if (system.includes("Vegetable")) shortName = "Vegetables";
        else if (system.includes("Fruit")) shortName = "Fruits";
        else if (system.includes("Greenhouse")) shortName = "Greenhouse";
        else if (system.includes("Poultry")) shortName = "Poultry";
        else if (system.includes("Dairy")) shortName = "Dairy";
        else if (system.includes("Beekeeping")) shortName = "Bees";
        else if (system.includes("Food Forest")) shortName = "Food Forest";
        else if (system.length > 18) shortName = system.substring(0, 17);
        
        lines.push(formatLine(` ${shortName}`, `€${formatNumber(foodCostPerSystem)}`));
      });
    }
    
    // Resource systems breakdown
    if (receiptData.selectedResourceSystems.length > 0) {
      lines.push("");
      lines.push("INFRASTRUCTURE:");
      const resourceCostPerSystem = Math.round(receiptData.resourceSystemsCost / receiptData.selectedResourceSystems.length);
      receiptData.selectedResourceSystems.forEach(system => {
        // Show each resource system with shorter names
        let shortName = system;
        if (system.includes("Solar")) shortName = "Solar";
        else if (system.includes("Wind")) shortName = "Wind";
        else if (system.includes("Well")) shortName = "Well";
        else if (system.includes("Rainwater")) shortName = "Rainwater";
        else if (system.includes("Wood Stove")) shortName = "Wood Heat";
        else if (system.includes("Heat Pump")) shortName = "Heat Pump";
        else if (system.includes("Generator")) shortName = "Generator";
        else if (system.includes("Drip")) shortName = "Drip Irrigation";
        else if (system.length > 18) shortName = system.substring(0, 17);
        
        lines.push(formatLine(` ${shortName}`, `€${formatNumber(resourceCostPerSystem)}`));
      });
    }
    
    // Creative space
    if (receiptData.creativeSpaceCost > 0 && receiptData.creativeSpace) {
      lines.push("");
      lines.push("CREATIVE SPACE:");
      let shortName = receiptData.creativeSpace;
      if (shortName.includes("Studio")) shortName = "Studio";
      else if (shortName.includes("Cabin")) shortName = "Cabin";
      else if (shortName.includes("Platform")) shortName = "Platform";
      else if (shortName.length > 18) shortName = shortName.substring(0, 17);
      lines.push(formatLine(` ${shortName}`, `€${formatNumber(receiptData.creativeSpaceCost)}`));
    }
    
    lines.push("........................................");
    lines.push(formatLine("Subtotal", `€${formatNumber(receiptData.totalCost)}`));
    lines.push(formatLine("Buffer 30%", `€${formatNumber(financialCushion)}`));
    lines.push("========================================");
    lines.push(formatLine("TOTAL", `€${formatNumber(totalWithCushion)}`));
    lines.push("");
    
    // Annual costs breakdown
    if (receiptData.annualCosts > 0) {
      lines.push("ANNUAL COSTS:");
      lines.push(formatLine("Total/year", `€${formatNumber(receiptData.annualCosts)}`));
      lines.push(formatLine("Per month", `€${formatNumber(Math.round(receiptData.annualCosts / 12))}`));
      lines.push("");
    }
    
    // Time commitment with details
    if (receiptData.weeklyHours > 0) {
      lines.push("TIME COMMITMENT:");
      lines.push(formatLine("Average", `${receiptData.weeklyHours}h/week`));
      if (receiptData.peakHours > receiptData.weeklyHours) {
        lines.push(formatLine("Peak season", `${receiptData.peakHours}h/week`));
      }
      lines.push(formatLine("Annual hours", `${Math.round(receiptData.weeklyHours * 52)}h`));
    }
    lines.push("");
    lines.push("----------------------------------------");
    lines.push("");
    
    // 4. COMMUNITY & PROJECTS
    lines.push(center("COMMUNITY"));
    lines.push("");
    
    // Region-specific projects
    const regionalProjects: Record<string, string[]> = {
      andalusia: [
        "Suryalila Centre",
        "Los Molinos",
        "Beneficio",
        "OASIS Foundation"
      ],
      asturias: [
        "Eco Aldea Network",
        "Permacultura Cantabria",
        "Transition Groups",
        "WWOOF Spain"
      ],
      algarve: [
        "Tamera",
        "Mount of Oaks",
        "Vale da Lama",
        "A Rocha"
      ],
      "northern-portugal": [
        "Aldeia de Cabrum",
        "Awakened Life",
        "Permalab",
        "Serra do Açor"
      ],
      provence: [
        "Les Amanins",
        "Terre & Humanisme",
        "Mas de Beaulieu",
        "Longo Maï"
      ],
      brittany: [
        "Kerzello",
        "Keruzerh",
        "Ty Poul Farm",
        "Breton Network"
      ],
      bavaria: [
        "Schloss Tempelhof",
        "Lebensgarten",
        "Ökodorf Pestalozzi",
        "Transition Towns"
      ],
      brandenburg: [
        "Sieben Linden",
        "KuBiZ Projects",
        "Uferwerk",
        "Lebensraum"
      ],
      carinthia: [
        "Krameterhof",
        "Biotopia",
        "Alpine Permaculture",
        "Transition Kärnten"
      ],
      "south-bohemia": [
        "Permalot CZ",
        "Permakultura CS",
        "Camphill",
        "Sluňákov"
      ],
      dalarna: [
        "Stjärnsund",
        "Mundekulla",
        "Charlottendal",
        "Nordic Permaculture"
      ]
    };
    
    const projects = regionalProjects[receiptData.subregion.id] || [
      "Permaculture Groups",
      "Eco-Villages",
      "Transition Network",
      "WWOOF"
    ];
    
    projects.slice(0, 4).forEach(project => lines.push(`• ${project}`));
    lines.push("");
    lines.push("--------------------------------");
    lines.push("");
    
    // 5. RESOURCES
    lines.push(center("LEARN MORE"));
    lines.push("");
    lines.push("YOUTUBE:");
    lines.push("• Kirsten Dirksen");
    lines.push("• Happen Films");
    lines.push("• Self Sufficient Me");
    lines.push("");
    lines.push("BOOKS:");
    lines.push("• One Straw Revolution");
    lines.push("• Gaia's Garden");
    lines.push("• Market Gardener");
    lines.push("");
    lines.push("PODCASTS:");
    lines.push("• Permaculture Podcast");
    lines.push("• From the Field");
    lines.push("");
    lines.push("--------------------------------");
    lines.push("");
    
    // 6. SAVINGS PLAN
    lines.push(center("SAVINGS TIMELINE"));
    lines.push("");
    
    // Calculate monthly savings
    const calculateMonthlySavings = (years: number): number => {
      const months = years * 12;
      const monthlyReturn = 0.07 / 12;
      const factor = ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
      return Math.round(totalWithCushion / factor);
    };
    
    lines.push("Monthly savings needed:");
    lines.push("(7% annual return)");
    lines.push("");
    lines.push(formatLine("5 yrs", `€${formatNumber(calculateMonthlySavings(5))}/mo`));
    lines.push(formatLine("7 yrs", `€${formatNumber(calculateMonthlySavings(7))}/mo`));
    lines.push(formatLine("10 yrs", `€${formatNumber(calculateMonthlySavings(10))}/mo`));
    lines.push("");
    lines.push("--------------------------------");
    lines.push("");
    
    // 7. CALL TO ACTION
    lines.push(center("JOIN US"));
    lines.push("");
    lines.push("offgrid-calculator.com");
    lines.push("@offgridcalculator");
    lines.push("#MyOffGridJourney");
    lines.push("");
    lines.push(center("The land is waiting"));
    lines.push("");
    lines.push("================================");
    lines.push(center(new Date().toLocaleDateString()));
    lines.push(center("Keep • Frame • Live"));
    
    return lines.join("\n");
  };

  const printReceipt = () => {
    setIsPrinting(true);
    
    // Create print window
    const printWindow = window.open('', 'PRINT', 'height=600,width=400');
    
    if (!printWindow) {
      alert('Please allow popups for this website');
      setIsPrinting(false);
      return;
    }

    // HTML for printing with 58mm receipt printer styles
    printWindow.document.write(`
      <html>
        <head>
          <title>Off-Grid Receipt</title>
          <style>
            @media print {
              @page {
                size: 58mm 210mm;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
              }
              * {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
            @media screen {
              body {
                width: 58mm;
              }
            }
            body {
              font-family: 'Courier New', monospace;
              font-size: 8px;
              line-height: 1.1;
              padding: 2mm;
              width: 54mm;
              margin: 0 auto;
              background: white;
            }
            pre {
              margin: 0;
              white-space: pre;
              word-wrap: normal;
              overflow: hidden;
            }
          </style>
        </head>
        <body>
          <pre>${formatReceipt()}</pre>
          <script>
            window.onload = function() {
              // Попытка установить правильный размер бумаги через API браузера
              if (window.matchMedia) {
                window.matchMedia('print').addListener(function(mql) {
                  if (mql.matches) {
                    // Печать началась
                  }
                });
              }
              window.print();
              setTimeout(function() {
                window.close();
              }, 500);
            }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    setTimeout(() => {
      setIsPrinting(false);
    }, 1000);
  };

  const downloadReceiptAsText = () => {
    const receiptText = formatReceipt();
    const blob = new Blob([receiptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `offgrid-receipt-${receiptData.subregion.name.toLowerCase()}-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadReceiptAsHTML = () => {
    const receiptText = formatReceipt();
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Off-Grid Receipt - ${receiptData.subregion.name}</title>
    <style>
        @media print {
            @page {
                size: 58mm 210mm;
                margin: 0;
            }
            body {
                margin: 0;
                padding: 0;
            }
        }
        body {
            font-family: 'Courier New', monospace;
            font-size: 11px;
            line-height: 1.15;
            padding: 3mm;
            width: 52mm;
            margin: 0 auto;
            background: white;
        }
        pre {
            margin: 0;
            white-space: pre;
            word-wrap: normal;
            overflow: hidden;
        }
        .no-print {
            margin: 20px auto;
            max-width: 600px;
            padding: 20px;
            font-family: Arial, sans-serif;
            font-size: 14px;
        }
        @media print {
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="no-print">
        <h2>Off-Grid Receipt</h2>
        <p>Нажмите Cmd+P (или Ctrl+P) чтобы распечатать этот чек.</p>
        <p><strong>Настройки печати:</strong></p>
        <ul>
            <li>Принтер: YICHIP3121</li>
            <li>Размер бумаги: 57 × 297 мм (или самый близкий)</li>
            <li>Масштаб: По размеру страницы</li>
            <li>Поля: Нет</li>
        </ul>
    </div>
    <pre>${receiptText}</pre>
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `offgrid-receipt-${receiptData.subregion.name.toLowerCase()}-${new Date().toISOString().split("T")[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border border-black p-8 mt-8">
      <h3 className="text-base font-medium mb-4">Print Your Off-Grid Receipt</h3>
      
      <p className="text-xs text-gray-600 mb-6">
        Get a physical reminder of your off-grid plan. Print this receipt and keep it 
        as your commitment to a life of freedom and self-sufficiency.
      </p>
      
      <div className="space-y-4">
        <Button 
          onClick={printReceipt} 
          disabled={isPrinting}
          fullWidth
        >
          {isPrinting ? "Opening print dialog..." : "Print Receipt"}
        </Button>
        
        <button
          onClick={downloadReceiptAsHTML}
          className="w-full text-xs text-gray-600 underline hover:text-black transition-colors"
        >
          Скачать HTML файл для печати (рекомендуется)
        </button>
        
        <button
          onClick={downloadReceiptAsText}
          className="w-full text-xs text-gray-600 underline hover:text-black transition-colors"
        >
          Скачать как текстовый файл
        </button>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200">
        <h4 className="text-xs font-medium mb-2">Инструкция для печати на macOS:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• <strong>Метод 1</strong>: Нажмите "Print Receipt" и выберите размер 57×297мм</li>
          <li>• <strong>Метод 2</strong>: Скачайте HTML файл, откройте в браузере, нажмите Cmd+P</li>
          <li>• В настройках печати выберите "Книжная" ориентация</li>
          <li>• Масштаб: По размеру страницы</li>
          <li>• Поля: Нет</li>
        </ul>
        
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200">
          <p className="text-xs font-medium text-blue-800">Решение проблемы с пустым листом:</p>
          <p className="text-xs text-blue-700 mt-1">
            Если при печати текстового файла выходит пустой лист, используйте HTML файл - 
            он сохраняет форматирование и правильно печатается на термопринтере.
          </p>
        </div>
      </div>
      
      {/* Preview section */}
      <details className="mt-6">
        <summary className="text-xs text-gray-600 cursor-pointer hover:text-black">
          Preview receipt content
        </summary>
        <pre className="mt-4 p-4 bg-gray-50 text-xs font-mono overflow-x-auto whitespace-pre border border-gray-200">
          {formatReceipt()}
        </pre>
      </details>
    </div>
  );
}