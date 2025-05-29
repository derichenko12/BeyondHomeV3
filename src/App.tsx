// src/App.tsx
import React, { Suspense, lazy } from "react";
import { CartProvider } from "./CartContext";

// Lazy load the main component
const OffGridCJM = lazy(() => import("./OffGridCJM"));

// Loading component
const Loading = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-pulse">
        <div className="h-4 w-48 bg-gray-700 rounded mb-2"></div>
        <div className="h-4 w-32 bg-gray-700 rounded"></div>
      </div>
    </div>
  </div>
);

// src/App.tsx
function App() {
  return (
    <CartProvider>
      <Suspense fallback={<Loading />}>
        <OffGridCJM />
      </Suspense>
    </CartProvider>
  );
}

export default App;