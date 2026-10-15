import { CartItem, CartSummary } from '../types';

export const TAX_RATE_PERCENT = 10;

// Prices are stored as integer cents so totals never pick up floating point errors.
export const formatCurrency = (cents: number): string => `$${(cents / 100).toFixed(2)}`;

export const calculateItemSubtotal = (priceCents: number, quantity: number): number => {
  return priceCents * quantity;
};

export const calculateCartSummary = (items: CartItem[]): CartSummary => {
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  const subtotalCents = items.reduce(
    (sum, item) => sum + calculateItemSubtotal(item.product.priceCents, item.quantity),
    0,
  );

  const shippingCents = 0; // Standard shipping is always free
  const taxCents = Math.round((subtotalCents * TAX_RATE_PERCENT) / 100);
  const totalCents = subtotalCents + shippingCents + taxCents;

  return {
    itemCount,
    subtotalCents,
    shippingCents,
    taxCents,
    totalCents,
    formattedSubtotal: formatCurrency(subtotalCents),
    formattedShipping: formatCurrency(shippingCents),
    formattedTax: formatCurrency(taxCents),
    formattedTotal: formatCurrency(totalCents),
  };
};
