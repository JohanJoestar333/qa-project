import React, { createContext, useContext, useEffect, useState } from 'react';
import { SAVED_DELIVERY_ADDRESS, SAVED_PAYMENT_METHOD } from '../data/mockUser';
import { INITIAL_PRODUCTS, getProductById } from '../data/products';
import { CartItem, CartSummary, Order, OrderItem, Product } from '../types';
import { calculateCartSummary, calculateItemSubtotal } from '../utils/currency';
import { loadJson, removeKey, saveJson } from '../utils/storage';

interface ActionResult {
  success: boolean;
  message?: string;
}

interface CartContextType {
  products: Product[];
  items: CartItem[];
  summary: CartSummary;
  addItem: (product: Product, quantity?: number) => ActionResult;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  createOrder: () => { success: boolean; order?: Order; error?: string };
  lastOrder: Order | null;
  clearLastOrder: () => void;
  resetStock: () => void;
}

const CART_STORAGE_KEY = 'qacart_items';
const LAST_ORDER_STORAGE_KEY = 'qacart_last_order';
const STOCK_STORAGE_KEY = 'qacart_product_stock';

const CartContext = createContext<CartContextType | undefined>(undefined);

// Image paths can change between releases, so always use the current one from the catalog.
const currentImage = (productId: string, savedImage: string): string =>
  getProductById(productId)?.image ?? savedImage;

const loadProducts = (): Product[] => {
  const savedStock = loadJson<Record<string, number>>(STOCK_STORAGE_KEY, {});
  return INITIAL_PRODUCTS.map((product) => ({
    ...product,
    stock: typeof savedStock[product.id] === 'number' ? savedStock[product.id] : product.stock,
  }));
};

const loadItems = (): CartItem[] =>
  loadJson<CartItem[]>(CART_STORAGE_KEY, []).map((item) => ({
    ...item,
    product: { ...item.product, image: currentImage(item.product.id, item.product.image) },
  }));

const loadLastOrder = (): Order | null => {
  const saved = loadJson<Order | null>(LAST_ORDER_STORAGE_KEY, null);
  if (!saved) return null;
  return {
    ...saved,
    items: saved.items.map((item) => ({ ...item, image: currentImage(item.id, item.image) })),
  };
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(loadProducts);
  const [items, setItems] = useState<CartItem[]>(loadItems);
  const [lastOrder, setLastOrder] = useState<Order | null>(loadLastOrder);

  useEffect(() => {
    const stockById: Record<string, number> = {};
    products.forEach((product) => {
      stockById[product.id] = product.stock;
    });
    saveJson(STOCK_STORAGE_KEY, stockById);
  }, [products]);

  useEffect(() => {
    saveJson(CART_STORAGE_KEY, items);
  }, [items]);

  useEffect(() => {
    if (lastOrder) {
      saveJson(LAST_ORDER_STORAGE_KEY, lastOrder);
    } else {
      removeKey(LAST_ORDER_STORAGE_KEY);
    }
  }, [lastOrder]);

  const summary = calculateCartSummary(items);

  const getStock = (productId: string): number => {
    return products.find((product) => product.id === productId)?.stock ?? 0;
  };

  const addItem = (product: Product, quantity: number = 1): ActionResult => {
    const stock = getStock(product.id);

    if (stock <= 0) {
      return { success: false, message: 'This item is currently out of stock.' };
    }

    const existing = items.find((item) => item.product.id === product.id);

    if (existing) {
      const newQuantity = existing.quantity + quantity;
      if (newQuantity > stock) {
        return { success: false, message: `Cannot add more. Maximum available stock (${stock}) reached.` };
      }
      setItems(items.map((item) => (item === existing ? { ...item, quantity: newQuantity } : item)));
      return { success: true };
    }

    if (quantity > stock) {
      return { success: false, message: `Quantity exceeds available stock (${stock}).` };
    }

    setItems([...items, { product: { ...product, stock }, quantity }]);
    return { success: true };
  };

  const increaseQuantity = (productId: string) => {
    const stock = getStock(productId);
    setItems((current) =>
      current.map((item) =>
        item.product.id === productId && item.quantity < stock
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  // Decreasing from 1 removes the item
  const decreaseQuantity = (productId: string) => {
    setItems((current) =>
      current.flatMap((item) => {
        if (item.product.id !== productId) return [item];
        return item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : [];
      }),
    );
  };

  const removeItem = (productId: string) => {
    setItems((current) => current.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setItems([]);

  const clearLastOrder = () => setLastOrder(null);

  const resetStock = () => {
    setProducts(INITIAL_PRODUCTS);
    removeKey(STOCK_STORAGE_KEY);
  };

  const createOrder = (): { success: boolean; order?: Order; error?: string } => {
    if (items.length === 0) {
      return { success: false, error: 'Your cart is empty. Please add items before checking out.' };
    }

    for (const item of items) {
      const stock = getStock(item.product.id);
      if (item.quantity > stock) {
        return { success: false, error: `Insufficient stock for ${item.product.name}. Only ${stock} available.` };
      }
    }

    setProducts((current) =>
      current.map((product) => {
        const purchased = items.find((item) => item.product.id === product.id);
        return purchased ? { ...product, stock: Math.max(0, product.stock - purchased.quantity) } : product;
      }),
    );

    const orderItems: OrderItem[] = items.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      unitPriceCents: item.product.priceCents,
      subtotalCents: calculateItemSubtotal(item.product.priceCents, item.quantity),
      image: item.product.image,
    }));

    const order: Order = {
      orderNumber: `QA-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      items: orderItems,
      subtotalCents: summary.subtotalCents,
      shippingCents: summary.shippingCents,
      taxCents: summary.taxCents,
      totalCents: summary.totalCents,
      address: SAVED_DELIVERY_ADDRESS,
      paymentMethod: SAVED_PAYMENT_METHOD,
    };

    setLastOrder(order);
    setItems([]);
    return { success: true, order };
  };

  return (
    <CartContext.Provider
      value={{
        products,
        items,
        summary,
        addItem,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        clearCart,
        createOrder,
        lastOrder,
        clearLastOrder,
        resetStock,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
