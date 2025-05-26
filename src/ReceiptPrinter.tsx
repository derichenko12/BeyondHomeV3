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
    const lineWidth = 40; // Standard receipt width
    
    // Helper to center text
    const center = (text: string) => {
      const padding = Math.floor((lineWidth - text.length) / 2);
      return " ".repeat(Math.max(0, padding)) + text;
    };
    
    // Helper to format line with dots
    const formatLine = (label: string, value: string) => {
      const dots = ".".repeat(Math.max(1, lineWidth - label.length - value.length));
      return `${label}${dots}${value}`;
    };
    
    // 1. DISCLAIMER
    lines.push(center("OFF-GRID REALITY CHECK"));
    lines.push(center("========================"));
    lines.push("");
    lines.push("This is not a promise, but a map.");
    lines.push("Real costs will be higher.");
    lines.push("Real time will be longer.");
    lines.push("Real challenges will surprise you.");
    lines.push("But real freedom awaits those");
    lines.push("who start anyway.");
    lines.push("");
    lines.push("----------------------------------------");
    lines.push("");
    
    // 2. SELECTED REGION
    lines.push(center("YOUR CHOSEN LAND"));
    lines.push(center(`${receiptData.subregion.name}, ${receiptData.subregion.country}`));
    lines.push("");
    lines.push(`Climate: ${receiptData.subregion.climate.join(", ")}`);
    lines.push(`Landscape: ${receiptData.subregion.landscape.join(", ")}`);
    lines.push(`Rainfall: ${receiptData.subregion.rainfall}mm/year`);
    lines.push(`Land price: €${receiptData.subregion.averagePricePerSqm}/m²`);
    lines.push("");
    lines.push("Traditional crops:");
    const crops = [...receiptData.subregion.vegetables, ...receiptData.subregion.fruitsAndNuts].slice(0, 6);
    lines.push(crops.join(", "));
    lines.push("");
    lines.push("----------------------------------------");
    lines.push("");
    
    // 3. COST BREAKDOWN
    lines.push(center("INVESTMENT BREAKDOWN"));
    lines.push("");
    lines.push(formatLine("Land", `€${receiptData.landCost.toLocaleString()}`));
    lines.push(formatLine("Home & License", `€${receiptData.homeCost.toLocaleString()}`));
    if (receiptData.foodSystemsCost > 0) {
      lines.push(formatLine("Food Systems", `€${receiptData.foodSystemsCost.toLocaleString()}`));
    }
    if (receiptData.resourceSystemsCost > 0) {
      lines.push(formatLine("Infrastructure", `€${receiptData.resourceSystemsCost.toLocaleString()}`));
    }
    if (receiptData.creativeSpaceCost > 0) {
      lines.push(formatLine("Creative Space", `€${receiptData.creativeSpaceCost.toLocaleString()}`));
    }
    lines.push("========================================");
    lines.push(formatLine("TOTAL INVESTMENT", `€${receiptData.totalCost.toLocaleString()}`));
    lines.push("");
    if (receiptData.annualCosts > 0) {
      lines.push(formatLine("Annual costs", `€${receiptData.annualCosts}/year`));
    }
    if (receiptData.weeklyHours > 0) {
      lines.push(formatLine("Time commitment", `${receiptData.weeklyHours}h/week`));
      if (receiptData.peakHours > receiptData.weeklyHours) {
        lines.push(formatLine("Peak season", `${receiptData.peakHours}h/week`));
      }
    }
    lines.push("");
    lines.push("----------------------------------------");
    lines.push("");
    
    // 4. PLACES & PROJECTS NEARBY
    lines.push(center("COMMUNITY & PROJECTS"));
    lines.push("");
    lines.push("• Ecovillage Network Europa");
    lines.push("• Local Permaculture Groups");
    lines.push("• Regional Seed Exchange");
    lines.push("• Workaway Opportunities");
    lines.push("• WWOOF Farms in Area");
    lines.push("");
    lines.push("----------------------------------------");
    lines.push("");
    
    // 5. RECOMMENDED COMPANIES
    lines.push(center("TRUSTED PARTNERS"));
    lines.push("");
    lines.push("LAND & LEGAL:");
    lines.push("• Local Real Estate Agencies");
    lines.push("• Rural Property Specialists");
    lines.push("• Permaculture Design Consultants");
    lines.push("");
    lines.push("BUILDING:");
    lines.push("• Eco-Construction Companies");
    lines.push("• Natural Building Workshops");
    lines.push("• Solar Installation Services");
    lines.push("");
    lines.push("----------------------------------------");
    lines.push("");
    
    // 6. MEDIA RESOURCES
    lines.push(center("INSPIRATION & LEARNING"));
    lines.push("");
    lines.push("YOUTUBE:");
    lines.push("• Self Sufficient Me");
    lines.push("• Swedish Homestead");
    lines.push("• Happen Films");
    lines.push("");
    lines.push("PODCASTS:");
    lines.push("• The Survival Podcast");
    lines.push("• From the Field");
    lines.push("• Homesteady");
    lines.push("");
    lines.push("----------------------------------------");
    lines.push("");
    
    // 7. BOOKS & LEARNING PATH
    lines.push(center("ESSENTIAL READING"));
    lines.push("");
    lines.push("FOUNDATION:");
    lines.push("• One Straw Revolution - Fukuoka");
    lines.push("• Gaia's Garden - Toby Hemenway");
    lines.push("• The Market Gardener - JM Fortier");
    lines.push("");
    lines.push("ADVANCED:");
    lines.push("• Permaculture Design Manual");
    lines.push("• The Resilient Farm");
    lines.push("• Water Harvesting Earthworks");
    lines.push("");
    lines.push("----------------------------------------");
    lines.push("");
    
    // 8. INVESTMENT PLAN
    lines.push(center("5-YEAR ROADMAP"));
    lines.push("");
    lines.push("YEAR 1: Land & Basic Shelter");
    lines.push(`  Budget: €${Math.round(receiptData.totalCost * 0.4).toLocaleString()}`);
    lines.push("");
    lines.push("YEAR 2: Home & Infrastructure");
    lines.push(`  Budget: €${Math.round(receiptData.totalCost * 0.3).toLocaleString()}`);
    lines.push("");
    lines.push("YEAR 3-5: Food & Creative Systems");
    lines.push(`  Budget: €${Math.round(receiptData.totalCost * 0.3).toLocaleString()}`);
    lines.push("");
    lines.push("----------------------------------------");
    lines.push("");
    
    // 9. CALL TO ACTION
    lines.push(center("JOIN THE MOVEMENT"));
    lines.push("");
    lines.push("This receipt is your first step.");
    lines.push("Share your journey:");
    lines.push("");
    lines.push("→ offgrid-calculator.com/community");
    lines.push("→ @offgridcalculator");
    lines.push("→ #MyOffGridJourney");
    lines.push("");
    lines.push(center("The land is waiting for you."));
    lines.push("");
    lines.push("========================================");
    lines.push(center(new Date().toLocaleDateString()));
    lines.push(center("Keep this. Frame it. Live it."));
    
    return lines.join("\n");
  };

  const printReceipt = () => {
    setIsPrinting(true);
    
    // Создаем новое окно для печати
    const printWindow = window.open('', 'PRINT', 'height=600,width=400');
    
    if (!printWindow) {
      alert('Please allow popups for this website');
      setIsPrinting(false);
      return;
    }

    // HTML для печати с правильными стилями для чековой ленты
    printWindow.document.write(`
      <html>
        <head>
          <title>Off-Grid Receipt</title>
          <style>
            @media print {
              @page {
                size: 80mm 297mm; /* Ширина чековой ленты */
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
              }
            }
            body {
              font-family: 'Courier New', monospace;
              font-size: 10pt;
              line-height: 1.2;
              padding: 10px;
              width: 300px;
              margin: 0 auto;
            }
            pre {
              margin: 0;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
          </style>
        </head>
        <body>
          <pre>${formatReceipt()}</pre>
          <script>
            window.onload = function() {
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
    a.download = `offgrid-receipt-${new Date().toISOString().split("T")[0]}.txt`;
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
          onClick={downloadReceiptAsText}
          className="w-full text-xs text-gray-600 underline hover:text-black transition-colors"
        >
          Download as text file instead
        </button>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200">
        <h4 className="text-xs font-medium mb-2">Printer Setup Tips:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Select your receipt printer in the print dialog</li>
          <li>• Paper size: 80mm × 297mm (or "Roll Paper")</li>
          <li>• Margins: None or Minimum</li>
          <li>• Scale: 100% (don't fit to page)</li>
        </ul>
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