import { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  customization?: { [key: string]: string };
  groupOrder?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (index: number) => void;
  clear: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(newItem: Omit<CartItem, 'quantity'>) {
    setItems(prev => {
      const existing = prev.find(item => item.productId === newItem.productId && JSON.stringify(item.customization) === JSON.stringify(newItem.customization));
      if (existing) {
        return prev.map(item =>
          item.productId === newItem.productId && JSON.stringify(item.customization) === JSON.stringify(newItem.customization)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  }

  function removeItem(index: number) {
    setItems(prev => prev.filter((_, i) => i !== index));
  }

  function clear() {
    setItems([]);
  }

  const total = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}