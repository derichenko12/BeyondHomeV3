import React, { Suspense, lazy } from "react";
import { CartProvider } from "./CartContext";

// Lazy load the main component
const OffGridCJM = lazy(() => import("./OffGridCJM"));

// Loading component
const Loading = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-pulse">
        <div className="h-4 w-48 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-32 bg-gray-300 rounded"></div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Suspense fallback={<Loading />}>
          <OffGridCJM />
        </Suspense>
      </div>
    </CartProvider>
  );
}

export default App;
