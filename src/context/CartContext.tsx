import React, { createContext, useContext, useEffect, useState } from 'react';
import { SAVED_DELIVERY_ADDRESS, SAVED_PAYMENT_METHOD } from '../data/mockUser';
import { INITIAL_PRODUCTS, getProductById, getProductColor, getProductSize } from '../data/products';
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
  getQuantityInCart: (productId: string) => number;
  addItem: (product: Product, colorId: string, sizeId: string, quantity?: number) => ActionResult;
  increaseQuantity: (productId: string, colorId: string, sizeId: string) => void;
  decreaseQuantity: (productId: string, colorId: string, sizeId: string) => void;
  removeItem: (productId: string, colorId: string, sizeId: string) => void;
  clearCart: () => void;
  createOrder: () => { success: boolean; order?: Order; error?: string };
  lastOrder: Order | null;
  clearLastOrder: () => void;
  resetStock: () => void;
}

const CART_STORAGE_KEY = 'qacart_cart_lines_v2';
const LAST_ORDER_STORAGE_KEY = 'qacart_last_order';
const STOCK_STORAGE_KEY = 'qacart_product_stock';

const CartContext = createContext<CartContextType | undefined>(undefined);

interface StoredCartLine {
  productId: string;
  colorId: string;
  sizeId: string;
  quantity: number;
}

const loadProducts = (): Product[] => {
  const savedStock = loadJson<Record<string, number>>(STOCK_STORAGE_KEY, {});
  return INITIAL_PRODUCTS.map((product) => ({
    ...product,
    stock: typeof savedStock[product.id] === 'number' ? savedStock[product.id] : product.stock,
  }));
};

// The cart is saved as plain lines and rebuilt from the catalog, so product data is never stale.
const loadItems = (): CartItem[] => {
  const lines = loadJson<StoredCartLine[]>(CART_STORAGE_KEY, []);
  return lines.flatMap((line) => {
    const product = getProductById(line.productId);
    const size = product && getProductSize(product, line.sizeId);
    if (!product || !size) return [];
    return [{ product, colorId: getProductColor(product, line.colorId).id, sizeId: size.id, quantity: line.quantity }];
  });
};

const loadLastOrder = (): Order | null => {
  const saved = loadJson<Order | null>(LAST_ORDER_STORAGE_KEY, null);
  // Orders saved before sizes existed have no size, so they are dropped
  if (!saved || saved.items.some((item) => !item.sizeId)) return null;
  return {
    ...saved,
    items: saved.items.map((item) => {
      const product = getProductById(item.id);
      if (!product) return item;
      const color = getProductColor(product, item.colorId);
      return { ...item, colorId: color.id, colorName: color.name, image: color.image };
    }),
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
    const lines: StoredCartLine[] = items.map((item) => ({
      productId: item.product.id,
      colorId: item.colorId,
      sizeId: item.sizeId,
      quantity: item.quantity,
    }));
    saveJson(CART_STORAGE_KEY, lines);
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

  // Stock is shared by all colors of a product, so quantities are counted per product.
  const getQuantityInCart = (productId: string): number => {
    return items
      .filter((item) => item.product.id === productId)
      .reduce((total, item) => total + item.quantity, 0);
  };

  const isSameLine = (item: CartItem, productId: string, colorId: string, sizeId: string) =>
    item.product.id === productId && item.colorId === colorId && item.sizeId === sizeId;

  const addItem = (product: Product, colorId: string, sizeId: string, quantity: number = 1): ActionResult => {
    const stock = getStock(product.id);

    if (stock <= 0) {
      return { success: false, message: 'This item is currently out of stock.' };
    }

    const inCart = getQuantityInCart(product.id);

    if (inCart + quantity > stock) {
      return {
        success: false,
        message:
          inCart > 0
            ? `Cannot add more. Maximum available stock (${stock}) reached.`
            : `Quantity exceeds available stock (${stock}).`,
      };
    }

    const existing = items.find((item) => isSameLine(item, product.id, colorId, sizeId));

    if (existing) {
      setItems(items.map((item) => (item === existing ? { ...item, quantity: item.quantity + quantity } : item)));
    } else {
      setItems([...items, { product, colorId, sizeId, quantity }]);
    }
    return { success: true };
  };

  const increaseQuantity = (productId: string, colorId: string, sizeId: string) => {
    if (getQuantityInCart(productId) >= getStock(productId)) return;
    setItems((current) =>
      current.map((item) =>
        isSameLine(item, productId, colorId, sizeId) ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  // Decreasing from 1 removes the line
  const decreaseQuantity = (productId: string, colorId: string, sizeId: string) => {
    setItems((current) =>
      current.flatMap((item) => {
        if (!isSameLine(item, productId, colorId, sizeId)) return [item];
        return item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : [];
      }),
    );
  };

  const removeItem = (productId: string, colorId: string, sizeId: string) => {
    setItems((current) => current.filter((item) => !isSameLine(item, productId, colorId, sizeId)));
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

    for (const product of products) {
      const quantity = getQuantityInCart(product.id);
      if (quantity > product.stock) {
        return { success: false, error: `Insufficient stock for ${product.name}. Only ${product.stock} available.` };
      }
    }

    setProducts((current) =>
      current.map((product) => {
        const quantity = getQuantityInCart(product.id);
        return quantity > 0 ? { ...product, stock: Math.max(0, product.stock - quantity) } : product;
      }),
    );

    const orderItems: OrderItem[] = items.map((item) => {
      const color = getProductColor(item.product, item.colorId);
      const size = getProductSize(item.product, item.sizeId);
      return {
        id: item.product.id,
        colorId: color.id,
        colorName: color.name,
        sizeId: item.sizeId,
        sizeName: size?.name ?? item.sizeId.toUpperCase(),
        name: item.product.name,
        quantity: item.quantity,
        unitPriceCents: item.product.priceCents,
        subtotalCents: calculateItemSubtotal(item.product.priceCents, item.quantity),
        image: color.image,
      };
    });

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
        getQuantityInCart,
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
