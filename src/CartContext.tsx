import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

// Import CartItem type from your existing Cart component
export interface CartItem {
  label: string;
  value: number;
  type?: "money" | "time";
  unit?: string;
}

interface CartContextType {
  items: CartItem[];
  addItems: (items: CartItem[]) => void;
  removeItems: (labels: string[]) => void;
  clearCart: () => void;
  updateCart: (items: CartItem[]) => void;
  total: number;
  timeTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItems = useCallback((newItems: CartItem[]) => {
    setItems((prev) => [...prev, ...newItems]);
  }, []);

  const removeItems = useCallback((labels: string[]) => {
    setItems((prev) => prev.filter((item) => !labels.includes(item.label)));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const updateCart = useCallback((newItems: CartItem[]) => {
    // Проверяем, действительно ли изменились items
    setItems((prevItems) => {
      // Сравниваем по содержимому, а не по ссылке
      const itemsChanged = JSON.stringify(prevItems) !== JSON.stringify(newItems);
      return itemsChanged ? newItems : prevItems;
    });
  }, []);

  const { total, timeTotal } = useMemo(() => {
    const moneyItems = items.filter((item) => item.type !== "time");
    const timeItems = items.filter((item) => item.type === "time");

    // Only count average hours for timeTotal (not peak hours)
    const avgTimeItems = timeItems.filter((item) =>
      item.label.includes("(avg)")
    );

    return {
      total: moneyItems.reduce((sum, item) => sum + item.value, 0),
      timeTotal: avgTimeItems.reduce((sum, item) => sum + item.value, 0),
    };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addItems,
      removeItems,
      clearCart,
      updateCart,
      total,
      timeTotal,
    }),
    [items, addItems, removeItems, clearCart, updateCart, total, timeTotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};