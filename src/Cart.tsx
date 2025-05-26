import React, { useState } from "react";
import { useCart } from "./CartContext";

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, total } = useCart();

  // Separate fixed costs, annual costs, and time commitments
  const fixedItems = items.filter(
    (item) => item.type !== "time" && !item.label.includes("Annual")
  );
  const annualItems = items.filter(
    (item) => item.type !== "time" && item.label.includes("Annual")
  );
  const timeItems = items.filter((item) => item.type === "time");

  // Separate average and peak time items
  const avgTimeItems = timeItems.filter((item) => item.label.includes("(avg)"));
  const peakTimeItems = timeItems.filter((item) => item.label.includes("(peak)"));
  // Resource time items (neither avg nor peak)
  const resourceTimeItems = timeItems.filter(
    (item) => !item.label.includes("(avg)") && !item.label.includes("(peak)")
  );

  const fixedTotal = fixedItems.reduce((sum, item) => sum + item.value, 0);
  const annualTotal = annualItems.reduce((sum, item) => sum + item.value, 0);
  const avgTimeTotal = avgTimeItems.reduce((sum, item) => sum + item.value, 0);
  const peakTimeTotal = peakTimeItems.reduce((sum, item) => sum + item.value, 0);
  const resourceTimeTotal = resourceTimeItems.reduce((sum, item) => sum + item.value, 0);
  const totalWeeklyTime = avgTimeTotal + resourceTimeTotal;

  return (
    <div className="fixed top-8 right-8 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-black hover:bg-gray-50 transition-colors"
      >
        <span className="text-xs">Cart</span>
        <span className="text-xs font-medium">(€{total.toLocaleString()})</span>
        {totalWeeklyTime > 0 && (
          <span className="text-xs text-gray-600">• {totalWeeklyTime} hrs/week</span>
        )}
        <svg
          className={`w-3 h-3 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-black p-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-3">
            {/* Fixed costs section */}
            {fixedItems.length > 0 && (
              <div>
                <h4 className="text-xs font-medium mb-2">Initial Investment</h4>
                {fixedItems.map((item, index) => (
                  <div
                    key={`fixed-${index}`}
                    className="flex justify-between text-xs mb-1"
                  >
                    <span>{item.label}</span>
                    <span className="font-medium">
                      €{item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Annual costs section */}
            {annualItems.length > 0 && (
              <div>
                <h4 className="text-xs font-medium mb-2 text-gray-600">
                  Annual Maintenance
                </h4>
                {annualItems.map((item, index) => (
                  <div
                    key={`annual-${index}`}
                    className="flex justify-between text-xs mb-1 text-gray-600"
                  >
                    <span>{item.label.replace(" Annual", "")}</span>
                    <span className="font-medium">
                      €{item.value.toLocaleString()}/year
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Time commitment section */}
            {(avgTimeItems.length > 0 || resourceTimeItems.length > 0) && (
              <div>
                <h4 className="text-xs font-medium mb-2 text-blue-700">
                  Time Commitment
                </h4>
                
                {/* Food system times */}
                {avgTimeItems.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-1">Food Systems:</p>
                    {avgTimeItems.map((item, index) => {
                      const systemName = item.label.replace(" Time (avg)", "");
                      const peakItem = peakTimeItems.find(p => p.label.includes(systemName));
                      
                      return (
                        <div
                          key={`time-${index}`}
                          className="flex justify-between text-xs mb-1 text-blue-700 pl-2"
                        >
                          <span>{systemName}</span>
                          <span className="font-medium">
                            {item.value} hrs (peak: {peakItem?.value || item.value} hrs)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* Resource system times */}
                {resourceTimeItems.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Infrastructure:</p>
                    {resourceTimeItems.map((item, index) => (
                      <div
                        key={`resource-time-${index}`}
                        className="flex justify-between text-xs mb-1 text-blue-700 pl-2"
                      >
                        <span>{item.label.replace(" Time", "")}</span>
                        <span className="font-medium">
                          {item.value} hrs/week
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {items.length > 0 && (
              <>
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Total Investment</span>
                    <span>€{fixedTotal.toLocaleString()}</span>
                  </div>
                  {annualTotal > 0 && (
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>Annual costs</span>
                      <span>€{annualTotal.toLocaleString()}/year</span>
                    </div>
                  )}
                  {totalWeeklyTime > 0 && (
                    <div className="flex justify-between text-xs text-blue-700 mt-1">
                      <span>Total time</span>
                      <span>
                        {totalWeeklyTime} hrs/week 
                        {peakTimeTotal > 0 && ` (peak: ${peakTimeTotal + resourceTimeTotal} hrs)`}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}

            {items.length === 0 && (
              <p className="text-xs text-gray-500">Your cart is empty</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}