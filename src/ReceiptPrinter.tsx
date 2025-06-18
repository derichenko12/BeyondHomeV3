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

  // Helper to format numbers
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Helper to format line with dots - consistent 38 chars width
  const formatLine = (label: string, value: string, width: number = 38) => {
    const totalLength = width;
    const labelLength = label.length;
    const valueLength = value.length;
    const dotsNeeded = totalLength - labelLength - valueLength;
    
    if (dotsNeeded < 2) {
      // If not enough space, truncate label
      const maxLabel = totalLength - valueLength - 2;
      return label.substring(0, maxLabel) + ".." + value;
    }
    
    return label + ".".repeat(dotsNeeded) + value;
  };

  // Generate HTML receipt
  const generateHTMLReceipt = () => {
    const financialCushion = Math.round(receiptData.totalCost * 0.3);
    const totalWithCushion = receiptData.totalCost + financialCushion;
    const homeCostOnly = Math.round(receiptData.homeCost / (1 + receiptData.subregion.buildingLicensePercent / 100));
    const licenseCost = receiptData.homeCost - homeCostOnly;

    const calculateMonthlySavings = (years: number): number => {
      const months = years * 12;
      const monthlyReturn = 0.07 / 12;
      const factor = ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
      return Math.round(totalWithCushion / factor);
    };

    // Get traditional crops - safely handle missing properties
    const allCrops = [
      ...(receiptData.subregion.gardens || []),
      ...(receiptData.subregion.otherFoodSources || [])
    ].slice(0, 8);

    // Regional projects
    const regionalProjects: Record<string, string[]> = {
      andalusia: ["Suryalila Centre", "Los Molinos", "Beneficio", "OASIS Foundation"],
      asturias: ["Eco Aldea Network", "Permacultura Cantabria", "Transition Groups", "WWOOF Spain"],
      algarve: ["Tamera", "Mount of Oaks", "Vale da Lama", "A Rocha"],
      "northern-portugal": ["Aldeia de Cabrum", "Awakened Life", "Permalab", "Serra do Açor"],
      provence: ["Les Amanins", "Terre & Humanisme", "Mas de Beaulieu", "Longo Maï"],
      brittany: ["Kerzello", "Keruzerh", "Ty Poul Farm", "Breton Network"],
      bavaria: ["Schloss Tempelhof", "Lebensgarten", "Ökodorf Pestalozzi", "Transition Towns"],
      brandenburg: ["Sieben Linden", "KuBiZ Projects", "Uferwerk", "Lebensraum"],
      carinthia: ["Krameterhof", "Biotopia", "Alpine Permaculture", "Transition Kärnten"],
      "south-bohemia": ["Permalot CZ", "Permakultura CS", "Camphill", "Sluňákov"],
      dalarna: ["Stjärnsund", "Mundekulla", "Charlottendal", "Nordic Permaculture"]
    };

    const projects = regionalProjects[receiptData.subregion.id] || ["Permaculture Groups", "Eco-Villages", "Transition Network", "WWOOF"];

    // Generate random position for dot
    const frameWidthMM = 52;
    const frameHeightMM = 65; // 4:5 ratio
    const margin = 3;
    const dotX = Math.random() * (frameWidthMM - margin * 2) + margin;
    const dotY = Math.random() * (frameHeightMM - margin * 2) + margin;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Off-Grid Receipt</title>
        <style>
          @font-face {
            font-family: 'ReceiptBody';
            src: url('/fonts/receipt-body.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
          
          @font-face {
            font-family: 'ReceiptHeading';
            src: url('/fonts/receipt-heading.woff2');
                 url('/fonts/receipt-heading.woff2');
            font-weight: medium;
            font-style: medium;
          }
          
          body {
            font-family: 'ReceiptBody';
            font-size: 12px;
            line-height: 1.2;
            margin: 0;
            padding: 0;
            background: white;
            width: 57mm;
          }
          * {
            font-family: 'ReceiptBody' !important;
          }
          .receipt {
            width: 57mm;
            padding: 0;
            margin: 0;
          }
          h1, h2, h3 {
            margin: 0;
            padding: 0;
            font-family: 'ReceiptHeading' !important;
            font-weight: normal !important;
            -webkit-font-smoothing: none;
            -moz-osx-font-smoothing: unset;
          }
          p {
            margin: 0;
            padding: 0;
            font-family: 'ReceiptBody';
          }
          h1 {
            font-size: 12px;
            text-align: center;
            margin: 3px 0;
          }
          h2 {
            font-size: 12px;
            text-align: center;
            margin: 3px 0;
          }
          h3 {
            font-size: 12px;
            text-align: center;
            margin: 3px 0;
          }
          p {
            font-size: 12px;
            margin: 2px 0;
          }
          .divider {
            text-align: center;
            margin: 2px 0;
            font-size: 12px;
            overflow: hidden;
            white-space: nowrap;
          }
          .section {
            margin: 4px 0;
          }
          .row {
            font-size: 12px;
            margin: 2px 0;
            white-space: pre;
            font-family: 'ReceiptBody';
          }
          strong {
            font-family: 'ReceiptHeading' !important;
            font-weight: normal !important;
          }
          .center { text-align: center; }
          .small { font-size: 12px; }
          .indent { margin-left: 5px; }
          img.region-photo {
            width: 100%;
            max-width: 57mm;
            height: auto;
            margin: 2px 0;
            display: block;
          }
          
          /* Frame with dot */
          .frame-container {
            width: 52mm;
            height: 65mm;
            border: 0.5px solid black;
            position: relative;
            margin: 5mm auto;
            box-sizing: border-box;
          }
          .dot {
            position: absolute;
            width: 4px;
            height: 4px;
            left: ${dotX}mm;
            top: ${dotY}mm;
            background: black;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          @media print {
            @page {
              size: 57mm 297mm;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              width: 57mm !important;
              max-width: 57mm !important;
            }
            .receipt {
              width: 57mm !important;
              max-width: 57mm !important;
              padding: 0 !important;
              margin: 0 !important;
            }
          }
          
          /* Специально для термопринтеров */
          @media print and (max-width: 80mm) {
            body, .receipt {
              width: 57mm !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <!-- Logo -->
          <div class="section">
            <img src="/loam-logo.svg" 
                 alt="Loam" 
                 style="width: 100%; max-width: 57mm; height: auto; margin: 0 0 8px 0;"
                 onerror="this.style.display='none';" />
          </div>
          
          <!-- Header -->
          <h1>OFF-GRID REALITY CHECK</h1>
          <div class="divider">======================================</div>
          
          <!-- Disclaimer -->
          <div class="section">
            <h3>BEFORE YOU START</h3>
            <p class="small">Living off-grid is not a romantic escape. It's hard work, endless projects, and serious time commitment. This lifestyle means building every system from the ground up. You might face regulations, isolation, climate challenges, and daily maintenance. But done right, you'll have something rare: life on your terms.</p>
            
            <p class="small" style="margin-top: 5px;">We can't plan or purchase freedom. I once believed this tool could offer a first step — a map, a price, a plan for escaping mainstream system and living a self-sufficient life. And maybe it still can. But what it cannot do is give a path to freedom.</p>
            
            <p class="small" style="margin-top: 5px;">Because a homestead is still a structure. Still a system. Still labor, risk, repetition, money involved. And if the hunger behind it stays the same — then all that changes is the view from the window.</p>
            
            <p class="small" style="margin-top: 5px;">Freedom is not a place. It's a rhythm. It begins not after savings, not after land, but the moment you stop running. If we have to be somewhere that is not here, we are far from being free. This receipt shows that no matter where we live, we'll carry the weight of what we are holding — stress, rent, exhaustion, constant dislocation.</p>
            
            <p class="small" style="margin-top: 5px;">Choosing to walk toward a homestead is still a beautiful direction. But let it be a quiet unfolding — not an escape. Let it be a return to your own rhythm. Let it grow out of attention and curiosity — not from expectations, not from fantasies, not from fear. Let it root in the unconditional: in care, in love, in stillness. Witness how things bloom when nothing is forced.</p>
            
            <p class="small" style="margin-top: 5px;">I think if we manage to find our tune — it won't matter if the land comes or not. With no expectations freedom no longer depends on where we live or what we have. If freedom can't be estimated with money, maybe it can with how close our life feels to who we are.</p>
          </div>
          
          <div class="divider">--------------------------------------</div>
          
          <!-- Region Section -->
          <div class="section">
            <h2>YOUR CHOSEN LAND</h2>
            <h1>${receiptData.subregion.name.toUpperCase()}</h1>
            <p class="center">${receiptData.subregion.country}</p>
            
            <!-- Region Image Here -->
            <img src="/regions/${receiptData.subregion.id}.png" 
                 alt="${receiptData.subregion.name}" 
                 class="region-photo"
                 style="margin-bottom: 8px;"
                 onerror="this.style.display='none';" />
            
            <p><strong>CLIMATE:</strong> ${(receiptData.subregion.climate || []).join(", ")}</p>
            <p><strong>LANDSCAPE:</strong> ${(receiptData.subregion.landscape || []).join(", ")}</p>
            <p><strong>RAINFALL:</strong> ${receiptData.subregion.rainfall}mm/year</p>
            <p><strong>LAND:</strong> ${receiptData.subregion.averagePricePerSqm}€/m²</p>
            
            ${allCrops.length > 0 ? `
            <p><strong>TRADITIONAL CROPS:</strong></p>
            <p class="indent small">${allCrops.join(", ")}</p>
            ` : ''}
          </div>
          
          <div class="divider">----------------------------------</div>
          
          <!-- Investment Breakdown -->
          <div class="section">
            <h3>INVESTMENT BREAKDOWN</h3>
            
            <div class="row">${formatLine("Land", formatNumber(receiptData.landCost) + "€")}</div>
            <div class="row">${formatLine("Home", formatNumber(homeCostOnly) + "€")}</div>
            <div class="row">${formatLine("License", formatNumber(licenseCost) + "€")}</div>
            
            ${receiptData.selectedFoodSystems.length > 0 ? `
              <p style="margin-top: 5px;"><strong>FOOD SYSTEMS:</strong></p>
              ${receiptData.selectedFoodSystems.map(system => {
                const shortName = system.replace("Vegetable Garden", "Vegetables")
                  .replace("Food Forest", "Forest")
                  .replace("Fruit Orchard", "Orchard")
                  .replace("Beekeeping", "Bees");
                return `<div class="row indent">${formatLine(shortName, formatNumber(Math.round(receiptData.foodSystemsCost / receiptData.selectedFoodSystems.length)) + "€", 36)}</div>`;
              }).join('')}
            ` : ''}
            
            ${receiptData.selectedResourceSystems.length > 0 ? `
              <p style="margin-top: 5px;"><strong>INFRASTRUCTURE:</strong></p>
              ${receiptData.selectedResourceSystems.map(system => {
                const shortName = system.replace("Solar Power System", "Solar")
                  .replace("Water Well", "Well")
                  .replace("Rainwater Harvesting", "Rainwater")
                  .replace("Wood Stove", "Wood Heat")
                  .replace("Water Filtration System", "Water Filter")
                  .replace("Backup Generator", "Generator");
                return `<div class="row indent">${formatLine(shortName, formatNumber(Math.round(receiptData.resourceSystemsCost / receiptData.selectedResourceSystems.length)) + "€", 36)}</div>`;
              }).join('')}
            ` : ''}
            
            ${receiptData.creativeSpaceCost > 0 && receiptData.creativeSpace ? `
              <p style="margin-top: 5px;"><strong>CREATIVE SPACE:</strong></p>
              <div class="row indent">${formatLine(receiptData.creativeSpace, formatNumber(receiptData.creativeSpaceCost) + "€", 36)}</div>
            ` : ''}
            
            <div class="row" style="margin-top: 3px;">......................................</div>
            
            <div class="row">${formatLine("Subtotal", formatNumber(receiptData.totalCost) + "€")}</div>
            <div class="row">${formatLine("Buffer 30%", formatNumber(financialCushion) + "€")}</div>
            
            <div class="divider">======================================</div>
            
            <div class="row" style="font-weight: bold;">${formatLine("TOTAL", formatNumber(totalWithCushion) + "€")}</div>
            
            ${receiptData.annualCosts > 0 ? `
              <p style="margin-top: 5px;"><strong>ANNUAL COSTS:</strong></p>
              <div class="row">${formatLine("Total/year", formatNumber(receiptData.annualCosts) + "€")}</div>
              <div class="row">${formatLine("Per month", formatNumber(Math.round(receiptData.annualCosts / 12)) + "€")}</div>
            ` : ''}
            
            ${receiptData.weeklyHours > 0 ? `
              <p style="margin-top: 5px;"><strong>TIME COMMITMENT:</strong></p>
              <div class="row">${formatLine("Average", receiptData.weeklyHours + "h/week")}</div>
              ${receiptData.peakHours > receiptData.weeklyHours ? `
                <div class="row">${formatLine("Peak season", receiptData.peakHours + "h/week")}</div>
              ` : ''}
              <div class="row">${formatLine("Annual hours", Math.round(receiptData.weeklyHours * 52) + "h")}</div>
            ` : ''}
          </div>
          
          <div class="divider">------------------------------</div>
          
          <!-- Community -->
          <div class="section">
            <h3>COMMUNITY</h3>
            ${projects.slice(0, 4).map(project => `<p class="small">• ${project}</p>`).join('')}
          </div>
          
          <div class="divider">------------------------------</div>
          
          <!-- Resources -->
          <div class="section">
            <h3>LEARN MORE</h3>
            <p class="small"><strong>YOUTUBE:</strong></p>
            <p class="small">• Kirsten Dirksen</p>
            <p class="small">• Happen Films</p>
            <p class="small">• Self Sufficient Me</p>
            
            <p class="small" style="margin-top: 3px;"><strong>BOOKS:</strong></p>
            <p class="small">• One Straw Revolution</p>
            <p class="small">• Gaia's Garden</p>
            <p class="small">• Market Gardener</p>
            
            <p class="small" style="margin-top: 3px;"><strong>PODCASTS:</strong></p>
            <p class="small">• Permaculture Podcast</p>
            <p class="small">• From the Field</p>
          </div>
          
          <div class="divider">------------------------------</div>
          
          <!-- Savings Plan -->
          <div class="section">
            <h3>SAVINGS TIMELINE</h3>
            <p class="small" style="margin-top: 2px;">Monthly savings needed:</p>
            <p class="small">(7% annual return)</p>
            <div class="row">${formatLine("5 yrs", formatNumber(calculateMonthlySavings(5)) + "€/mo")}</div>
            <div class="row">${formatLine("7 yrs", formatNumber(calculateMonthlySavings(7)) + "€/mo")}</div>
            <div class="row">${formatLine("10 yrs", formatNumber(calculateMonthlySavings(10)) + "€/mo")}</div>
          </div>
          
          <div class="divider">------------------------------</div>
          
          <!-- Footer without Join Us -->
          <div class="section center">
            <p style="margin-top: 5px;"><strong>The land is waiting</strong></p>
            
            <div class="divider">======================================</div>
            <p class="small">${new Date().toLocaleDateString()}</p>
            <p><strong>Keep • Frame • Live</strong></p>
          </div>
          
          <!-- Frame with random dot -->
          <div class="frame-container">
            <div class="dot"></div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const printReceipt = () => {
    setIsPrinting(true);
    
    const printWindow = window.open('', 'PRINT', 'height=800,width=400');
    
    if (!printWindow) {
      alert('Please allow popups for this website');
      setIsPrinting(false);
      return;
    }

    const htmlContent = generateHTMLReceipt();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load
    setTimeout(() => {
      printWindow.print();
      setTimeout(() => {
        printWindow.close();
        setIsPrinting(false);
      }, 1000);
    }, 500);
  };

  const downloadReceiptAsHTML = () => {
    const htmlContent = generateHTMLReceipt();
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `offgrid-receipt-${receiptData.subregion.name.toLowerCase()}-${new Date().toISOString().split("T")[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadReceiptAsText = () => {
    // Generate text version without images for backup
    const lines: string[] = [];
    const lineWidth = 28;
    
    const center = (text: string) => {
      if (text.length >= lineWidth) return text.substring(0, lineWidth);
      const padding = Math.floor((lineWidth - text.length) / 2);
      return " ".repeat(Math.max(0, padding)) + text;
    };
    
    // Simple text version...
    lines.push(center("OFF-GRID RECEIPT"));
    lines.push(center(`${receiptData.subregion.name}, ${receiptData.subregion.country}`));
    lines.push(center(new Date().toLocaleDateString()));
    lines.push("");
    lines.push(`Total: ${receiptData.totalCost.toLocaleString()}€`);
    lines.push(`Land: ${(receiptData.landArea / 10000).toFixed(1)} ha`);
    lines.push(`Family: ${receiptData.familySize} people`);
    
    const textContent = lines.join("\n");
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `offgrid-receipt-${receiptData.subregion.name.toLowerCase()}-${new Date().toISOString().split("T")[0]}.txt`;
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
          Download HTML receipt (with image)
        </button>
        
        <button
          onClick={downloadReceiptAsText}
          className="w-full text-xs text-gray-600 underline hover:text-black transition-colors"
        >
          Download text receipt (backup)
        </button>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200">
        <h4 className="text-xs font-medium mb-2">Printing tips:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Receipt width: 58mm</li>
          <li>• Image will appear after region name</li>
          <li>• If image doesn't print, use HTML download</li>
          <li>• Frame with random dot at the end</li>
        </ul>
      </div>
    </div>
  );
}