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
  const formatLine = (label: string, value: string, width: number = 33) => {
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
    const homeCostOnly = Math.round(
      receiptData.homeCost /
        (1 + receiptData.subregion.buildingLicensePercent / 100)
    );
    const licenseCost = receiptData.homeCost - homeCostOnly;

    const calculateMonthlySavings = (years: number): number => {
      const months = years * 12;
      const monthlyReturn = 0.07 / 12;
      const factor = (Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn;
      return Math.round(totalWithCushion / factor);
    };

    // Get traditional crops - safely handle missing properties
    const allCrops = [
      ...(receiptData.subregion.gardens || []),
      ...(receiptData.subregion.otherFoodSources || []),
    ].slice(0, 8);

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
            src: url('/fonts/receipt-heading.woff2') format('woff2');
            font-weight: normal;
            font-style: normal;
          }
          
          body {
            font-family: 'ReceiptBody';
            font-size: 12px;
            line-height: 1.2;
            margin: 0;
            padding: 0;
            background: white;
            width: 70mm;
          }
          * {
            font-family: 'ReceiptBody' !important;
          }
          .receipt {
            width: 70mm;
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
            font-size: 16px;
            text-align: center;
            margin: 10px 0;
          }
          h3 {
            font-size: 16px;
            text-align: center;
            margin: 10px 0;
          }
          p {
            font-size: 12px;
            margin: 2px 0;
            text-align: justify;
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
            width: 110%;
            max-width: 100mm;
            height: auto;
            margin: 0px 0px;
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
              size: 70mm 297mm;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              width: 70mm !important;
              max-width: 70mm !important;
            }
            .receipt {
              width: 70mm !important;
              max-width: 70mm !important;
              padding: 0 !important;
              margin: 0 !important;
            }
          }
          
          /* Специально для термопринтеров */
          @media print and (max-width: 80mm) {
            body, .receipt {
              width: 70mm !important;
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
                 style="width: 100%; max-width: 70mm; height: auto; margin: 0 0 8px 0;"
                 onerror="this.style.display='none';" />
          </div>
          
          <!-- Header -->
          <div class="divider">======================================</div>
          
          <!-- Manifesto -->
          <div class="section">
            <h3>MANIFESTO</h3>
            
            <div style="margin-top: 8px;">
              <h3>CHAPTER 1: THE ILLUSION OF CHOICE</h3>
            </div>
            
            <div style="margin-top: 6px;">
              <h3>1.1 SYSTEM VS SELF</h3>
              <p class="small" style="margin-top: 4px;">The core issue with the mainstream living system is not just economic — it's existential. We live in a structure designed for productivity, not for presence. For growth, not for grounding. Housing is unaffordable. Food is industrial. Time feels like something we rent, not something we own. We are exhausted. Forced to work more to afford less. To stare at screens rather than a sunrise. Cut off from the land, from quiet, from each other and from ourselves.</p>
            </div>
            
            <div style="margin-top: 6px;">
              <h3>1.2 THE PERFORMANCE OF INDEPENDENCE</h3>
              <p class="small" style="margin-top: 4px;">The system is designed to disguise dependence as choice. But as long as we're paying to stay in, we're not free. We're participants in a loop that rewards productivity with temporary comfort. We are told we're free — because we can change locations, subscribe to health, decorate our rented homes, and choose between ten brands of organic yogurt. We never own the means of living. We rent them — monthly. We rent water. We pay for warmth. We subscribe to the right to rest. Clean water falls from the sky. The sun rises for free. Soil wants to grow and give things. All of this exists in abundance — until someone claims it, brands it, and sells it back to us. To need permission for what once required none — is not progress. It's a quiet kind of theft.</p>
            </div>
            
            <div style="margin-top: 6px;">
              <h3>1.3 BURNOUT AS DEFAULT</h3>
              <p class="small" style="margin-top: 4px;">Most people today spend over 90% of their lives indoors. We sit, on average, 10–12 hours a day, even though the human body is designed to walk 6–12 kilometers daily. We spend up to 70% of our waking hours in front of a screen — not creating, not resting, just consuming. We tell ourselves we're "busy" — but what are we busy with? Scrolling? Commuting? Fixing the damage of the very lifestyle we were sold? We dream of rest, of breath, of sunlight — but we budget for efficiency and dopamine to keep the machine running.</p>
            </div>
            
            <div style="margin-top: 6px;">
              <h3>1.4 THE FALSE HOPE OF BUYING OUT</h3>
              <p class="small" style="margin-top: 4px;">A dream of escape becomes tempting — a cabin in the woods, a solar-powered greenhouse, a piece of land where everything finally feels quiet and yours. These aren't bad dreams. They're beautiful, often necessary. But freedom is not the same as independence, and building an alternative system won't heal the inner reasons we wanted out. The truth is: anxiety, restlessness, comparison — they don't disappear when you move off-grid. They follow. A homestead can offer resilience, rhythm, even joy. But it can't guarantee peace unless you're cultivating it within. Choosing to step outside the system is not a final destination, but a direction. A slow re-alignment. It asks for clarity, patience, and an ongoing reorganization of life — not driven by urgency, but by care. This is not a shortcut to a better life. It's a commitment to walk through your life differently. Step by step. Root before fruit.</p>
            </div>
            
            <div style="margin-top: 8px;">
              <h3>CHAPTER 2: RECLAIMING OURSELVES</h3>
            </div>
            
            <div style="margin-top: 6px;">
              <h3>2.1 FROM SYSTEMIC DEPENDENCY TO REGENERATIVE AUTONOMY</h3>
              <p class="small" style="margin-top: 4px;">Goal #1 To shift from surviving in an extractive system to designing life around well-being, resilience, creative expression, community and meaning.</p>
              <p class="small">Goal #2 To build a toolset that will help people understand a real price of independence. Not just the money, but also time and effort.</p>
              <p class="small">Goal #3 To build a community for sharing, learning, inspiring and growing.</p>
            </div>
            
            <div style="margin-top: 6px;">
              <h3>2.2 WHAT EXACTLY WE'RE BUILDING</h3>
              <p class="small" style="margin-top: 4px;">Loam is not a lifestyle brand. It's an ecosystem of tools, platforms, experiments. We're building: A tool that helps you estimate the real cost of living off-grid and gives you specific guidelines and steps on how to achieve it. A curated platform with essays, interviews, articles and guides designed for learning. A goal of this would be to bring different people and make some real things happen. To speculate: It can be an offline collective project. It can grow to a residency network. It can become a one-of-a-kind online school. It can be a library of knowledge that is grown by the community effort. A place to get skills, build things, get knowledge.</p>
            </div>
            
            <div style="margin-top: 6px;">
              <h3>2.3 HOW LOAM WILL GROW</h3>
              <p class="small" style="margin-top: 4px;">Loam is not a finished product. It's a growing infrastructure — built with care, tested through use, and shaped by the people it serves. We see it not as a destination, but as a living system that expands over time: deeper, not faster. We'll improve Loam in cycles, not sprints — releasing updates only after listening, testing, and reflecting on what's truly useful. Our first priority is clarity: better data, smarter calculators, more transparent breakdowns of what off-grid life really involves — region by region, system by system. As usage grows, we'll expand Loam's capacities: A land, law, infrastructure and permaculture database that becomes more accurate. A modular system builder where users can plan everything to build a sustainable homestead. A knowledge base maintained through real-life feedback, fieldnotes, and open-source collaboration. A shared public map of homestead projects, visits, and experiments. Creative lab for testing new ideas. We want to grow it as a space where different types of knowledge can meet — regenerative farmers, off-grid builders, designers, researchers, craftspeople, artists, people who never thought they could live differently, but are ready to try. Our long-term vision is to let people using Loam shape it. We will open more of its architecture to community curation — not just comments or feedback, but code, guides, glossaries, datasets, reference maps. Think of it as an evolving archive of lived alternatives — maintained with precision and care. Loam will never scale for growth's sake. We will grow only if that growth creates more clarity, more possibility, and more tools for real autonomy.</p>
            </div>
            
            <div style="margin-top: 6px;">
              <h3>2.4 INVITATION</h3>
              <p class="small" style="margin-top: 4px;">This project is still small. But it works. It's coded so that you can already use it: choose a region, calculate your needs, get a plan. If any part of it speaks to you — if you've felt the same hunger, the same tiredness, the same longing to live differently — I invite you to join. Not to follow, but to participate. Not to consume, but to learn. Not to dream of freedom, but to begin practicing it — together. Let's see what kind of things becomes possible — when we stop waiting for permission.</p>
            </div>
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
            
            <p><strong>CLIMATE:</strong> ${(
              receiptData.subregion.climate || []
            ).join(", ")}</p>
            <p><strong>LANDSCAPE:</strong> ${(
              receiptData.subregion.landscape || []
            ).join(", ")}</p>
            <p><strong>RAINFALL:</strong> ${
              receiptData.subregion.rainfall
            }mm/year</p>
            <p><strong>LAND:</strong> ${
              receiptData.subregion.averagePricePerSqm
            }€/m²</p>
            
            ${
              allCrops.length > 0
                ? `
            <p style="margin-top: 4px;"><strong>TRADITIONAL CROPS:</strong></p>
            <p class="indent small">${allCrops.join(", ")}</p>
            `
                : ""
            }
          </div>
          
          <div class="divider">----------------------------------</div>
          
          <!-- Investment Breakdown -->
          <div class="section">
            <h3>INVESTMENT BREAKDOWN</h3>
            
            <div style="margin-top: 6px;">
              <div class="row">${formatLine(
                "Land",
                formatNumber(receiptData.landCost) + "€"
              )}</div>
              <div class="row">${formatLine(
                "Home",
                formatNumber(homeCostOnly) + "€"
              )}</div>
              <div class="row">${formatLine(
                "License",
                formatNumber(licenseCost) + "€"
              )}</div>
            </div>
            
            ${
              receiptData.selectedFoodSystems.length > 0
                ? `
              <p style="margin-top: 6px;"><strong>FOOD SYSTEMS:</strong></p>
              ${receiptData.selectedFoodSystems
                .map((system) => {
                  const shortName = system
                    .replace("Vegetable Garden", "Vegetables")
                    .replace("Food Forest", "Forest")
                    .replace("Fruit Orchard", "Orchard")
                    .replace("Beekeeping", "Bees");
                  return `<div class="row indent">${formatLine(
                    shortName,
                    formatNumber(
                      Math.round(
                        receiptData.foodSystemsCost /
                          receiptData.selectedFoodSystems.length
                      )
                    ) + "€",
                    33
                  )}</div>`;
                })
                .join("")}
            `
                : ""
            }
            
            ${
              receiptData.selectedResourceSystems.length > 0
                ? `
              <p style="margin-top: 6px;"><strong>INFRASTRUCTURE:</strong></p>
              ${receiptData.selectedResourceSystems
                .map((system) => {
                  const shortName = system
                    .replace("Solar Power System", "Solar")
                    .replace("Water Well", "Well")
                    .replace("Rainwater Harvesting", "Rainwater")
                    .replace("Wood Stove", "Wood Heat")
                    .replace("Water Filtration System", "Water Filter")
                    .replace("Backup Generator", "Generator");
                  return `<div class="row indent">${formatLine(
                    shortName,
                    formatNumber(
                      Math.round(
                        receiptData.resourceSystemsCost /
                          receiptData.selectedResourceSystems.length
                      )
                    ) + "€",
                    33
                  )}</div>`;
                })
                .join("")}
            `
                : ""
            }
            
            ${
              receiptData.creativeSpaceCost > 0 && receiptData.creativeSpace
                ? `
              <p style="margin-top: 6px;"><strong>CREATIVE SPACE:</strong></p>
              <div class="row indent">${formatLine(
                receiptData.creativeSpace,
                formatNumber(receiptData.creativeSpaceCost) + "€",
                33
              )}</div>
            `
                : ""
            }
            
            ${(receiptData.selectedFoodSystems.length > 0 || receiptData.selectedResourceSystems.length > 0 || (receiptData.creativeSpaceCost > 0 && receiptData.creativeSpace)) ? `
            <div class="row" style="margin-top: 6px;">......................................</div>
            ` : ''}
            
            <div class="row">${formatLine(
              "Subtotal",
              formatNumber(receiptData.totalCost) + "€"
            )}</div>
            <div class="row">${formatLine(
              "Buffer 30%",
              formatNumber(financialCushion) + "€"
            )}</div>
            
            <div class="divider" style="margin-top: 4px;">======================================</div>
            
            <div class="row" style="font-weight: bold;">${formatLine(
              "TOTAL",
              formatNumber(totalWithCushion) + "€"
            )}</div>
            
            ${
              receiptData.annualCosts > 0
                ? `
              <p style="margin-top: 6px;"><strong>ANNUAL COSTS:</strong></p>
              <div class="row">${formatLine(
                "Total/year",
                formatNumber(receiptData.annualCosts) + "€"
              )}</div>
              <div class="row">${formatLine(
                "Per month",
                formatNumber(Math.round(receiptData.annualCosts / 12)) + "€"
              )}</div>
            `
                : ""
            }
            
            ${
              receiptData.weeklyHours > 0
                ? `
              <p style="margin-top: 6px;"><strong>TIME COMMITMENT:</strong></p>
              <div class="row">${formatLine(
                "Average",
                receiptData.weeklyHours + "h/week"
              )}</div>
              ${
                receiptData.peakHours > receiptData.weeklyHours
                  ? `
                <div class="row">${formatLine(
                  "Peak season",
                  receiptData.peakHours + "h/week"
                )}</div>
              `
                  : ""
              }
              <div class="row">${formatLine(
                "Annual hours",
                Math.round(receiptData.weeklyHours * 52) + "h"
              )}</div>
            `
                : ""
            }
          </div>
          
          <div class="divider">------------------------------</div>
          
          <div class="divider">------------------------------</div>
          
          <!-- Guide -->
          <div class="section">
            <h3>GUIDE</h3>
            <p class="small" style="margin-top: 6px;"><strong>1. Visit places. Stay curious.</strong> Do the research. Read anything that sparks interest. Try to find the root of things. Use the reading list as a starting point — not as homework, but as a door.</p>
            <p class="small" style="margin-top: 4px;"><strong>2. Ask yourself honestly why you're doing this.</strong> Look beyond aesthetics and ambition. Try to name the true longing underneath — safety, space, rhythm, repair.</p>
            <p class="small" style="margin-top: 4px;"><strong>3. Find someone who's walking a similar path — and reach out.</strong> That's what the Loam community is for. We're all figuring it out. You're not alone here.</p>
            <p class="small" style="margin-top: 4px;"><strong>4. Start building one system, even if it's small.</strong> Grow herbs on a balcony. Try collecting rainwater or cooking differently. Start where you are, with what you have. You have to get curious about it and get proactive if you want to fall in love with it.</p>
            <p class="small" style="margin-top: 4px;"><strong>5. Name what feels too far or too hard right now.</strong> Not to avoid it, but to stop pretending. Once it's visible — it becomes workable.</p>
            <p class="small" style="margin-top: 4px;"><strong>6. Check if the plan is still serving you.</strong> Update it, pause it, rewrite it. It's not a performance — it's a tool.</p>
            <p class="small" style="margin-top: 4px;"><strong>7. Trust that your life is leading somewhere.</strong> You and I feel the same longing because we are designed to create and grow, not just consume and be a part of the machine.</p>
          </div>
          
          <div class="divider">------------------------------</div>

          <!-- Resources -->
          <div class="section">
            <h3>READING LIST TO GET STARTED</h3>
            <p class="small" style="margin-top: 6px;"><strong>BOOKS:</strong></p>
            <p class="small">• Wilding</p>
            <p class="small">• One River</p>
            <p class="small">• Vaster than Sky, Greater than Space</p>
            <p class="small">• Braiding Sweetgrass</p>
            <p class="small">• The Unsettling of America</p>
            <p class="small">• The Spell of the Sensuous</p>
            <p class="small">• Making Home</p>
            
          </div>
          
          <div class="divider">------------------------------</div>
          
          <!-- Savings Plan -->
          <div class="section">
            <h3>SAVINGS TIMELINE</h3>
            <p class="small" style="margin-top: 4px;">Monthly savings needed:</p>
            <p class="small">(7% annual return)</p>
            <div style="margin-top: 4px;">
              <div class="row">${formatLine(
                "5 yrs",
                formatNumber(calculateMonthlySavings(5)) + "€/mo"
              )}</div>
              <div class="row">${formatLine(
                "7 yrs",
                formatNumber(calculateMonthlySavings(7)) + "€/mo"
              )}</div>
              <div class="row">${formatLine(
                "10 yrs",
                formatNumber(calculateMonthlySavings(10)) + "€/mo"
              )}</div>
            </div>
          </div>
          
          <div class="divider">------------------------------</div>
          
          <!-- Footer -->
          <div class="section center">
            <div class="divider">======================================</div>
            <p class="small">${new Date().toLocaleDateString()}</p>
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

    const printWindow = window.open("", "PRINT", "height=800,width=400");

    if (!printWindow) {
      alert("Please allow popups for this website");
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
    a.download = `offgrid-receipt-${receiptData.subregion.name.toLowerCase()}-${
      new Date().toISOString().split("T")[0]
    }.html`;
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
    lines.push(
      center(`${receiptData.subregion.name}, ${receiptData.subregion.country}`)
    );
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
    a.download = `offgrid-receipt-${receiptData.subregion.name.toLowerCase()}-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border border-black p-8 mt-8">
      <h3 className="text-base font-medium mb-4">
        Print Your Off-Grid Receipt
      </h3>

      <p className="text-xs text-gray-600 mb-6">
        Get a physical reminder of your off-grid plan. Print this receipt and
        keep it as your commitment to a life of freedom and self-sufficiency.
      </p>

      <div className="space-y-4">
        <Button onClick={printReceipt} disabled={isPrinting} fullWidth>
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
