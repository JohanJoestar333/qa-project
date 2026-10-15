import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { CartItem } from '../types';
import { useCart } from '../context/CartContext';
import { formatCurrency, calculateItemSubtotal } from '../utils/currency';

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { increaseQuantity, decreaseQuantity, removeItem, products } = useCart();
  const [imageError, setImageError] = useState(false);

  const { product, quantity } = item;
  const liveStock = products.find((p) => p.id === product.id)?.stock ?? product.stock;
  const lineSubtotalCents = calculateItemSubtotal(product.priceCents, quantity);
  const isMaxStock = quantity >= liveStock;

  const stepperButton =
    'w-8 h-8 flex items-center justify-center rounded-full text-ink hover:bg-surface transition-colors disabled:text-ink-3 disabled:hover:bg-transparent disabled:cursor-not-allowed';

  return (
    <div
      data-testid={`cart-item-${product.id}`}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 first:pt-0 last:pb-0"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="group w-20 h-20 rounded-2xl bg-fill overflow-hidden shrink-0">
          {!imageError && (
            <img
              src={product.image}
              alt={product.name}
              data-testid={`cart-item-image-${product.id}`}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          )}
        </div>

        <div className="min-w-0">
          <h4 data-testid={`cart-item-name-${product.id}`} className="text-[17px] text-ink truncate">
            {product.name}
          </h4>
          <p data-testid={`cart-item-sku-${product.id}`} className="text-[13px] text-ink-2 mt-0.5">
            {product.id}
          </p>
          <p className="text-[13px] text-ink-2">
            Unit Price:{' '}
            <span data-testid={`cart-item-unit-price-${product.id}`} className="tabular-nums">
              {product.formattedPrice}
            </span>
          </p>
          <p className="text-[13px] text-ink-3">
            Current stock:{' '}
            <span data-testid={`cart-item-stock-${product.id}`} className="tabular-nums">
              {liveStock}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
        <div className="flex items-center rounded-full bg-fill p-0.5">
          <button
            type="button"
            onClick={() => decreaseQuantity(product.id)}
            data-testid={`decrease-quantity-${product.id}`}
            aria-label={`Decrease quantity of ${product.name}`}
            className={stepperButton}
          >
            <Minus className="w-3.5 h-3.5" strokeWidth={2} />
          </button>

          <span
            data-testid={`cart-item-quantity-${product.id}`}
            className="w-9 text-center text-[15px] text-ink tabular-nums select-none"
          >
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => increaseQuantity(product.id)}
            disabled={isMaxStock}
            data-testid={`increase-quantity-${product.id}`}
            aria-label={`Increase quantity of ${product.name}`}
            className={stepperButton}
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>

        <span
          data-testid={`cart-item-subtotal-${product.id}`}
          className="text-[17px] text-ink tabular-nums min-w-[72px] text-right"
        >
          {formatCurrency(lineSubtotalCents)}
        </span>

        <button
          type="button"
          onClick={() => removeItem(product.id)}
          data-testid={`remove-item-${product.id}`}
          aria-label={`Remove ${product.name} from cart`}
          className="text-[13px] link"
        >
          Remove
        </button>
      </div>
    </div>
  );
};
