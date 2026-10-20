import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import { CartItem } from '../types';
import { useCart } from '../context/CartContext';
import { getLineId, getProductColor, getProductSize } from '../data/products';
import { formatCurrency, calculateItemSubtotal } from '../utils/currency';

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { increaseQuantity, decreaseQuantity, removeItem, getQuantityInCart, products } = useCart();
  const [imageError, setImageError] = useState(false);

  const { product, quantity, colorId, sizeId } = item;
  const color = getProductColor(product, colorId);
  const size = getProductSize(product, sizeId);
  const sizeName = size?.name ?? sizeId.toUpperCase();
  const lineId = getLineId(product.id, color.id, sizeId);
  const productPath = `/products/${product.id}?color=${color.id}&size=${sizeId}`;

  const liveStock = products.find((p) => p.id === product.id)?.stock ?? product.stock;
  const lineSubtotalCents = calculateItemSubtotal(product.priceCents, quantity);
  // Stock is shared by every color of the same product
  const isMaxStock = getQuantityInCart(product.id) >= liveStock;

  const stepperButton =
    'w-8 h-8 flex items-center justify-center rounded-full text-ink hover:bg-surface transition-colors disabled:text-ink-3 disabled:hover:bg-transparent disabled:cursor-not-allowed';

  return (
    <div
      data-testid={`cart-item-${lineId}`}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 first:pt-0 last:pb-0"
    >
      <div className="flex items-center gap-4 min-w-0">
        <Link to={productPath} tabIndex={-1} aria-hidden="true" className="group block w-20 h-20 rounded-2xl bg-fill overflow-hidden shrink-0">
          {!imageError && (
            <img
              src={color.image}
              alt={`${product.name} in ${color.name}`}
              data-testid={`cart-item-image-${lineId}`}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          )}
        </Link>

        <div className="min-w-0">
          <h4 className="text-[17px] text-ink truncate">
            <Link to={productPath} data-testid={`cart-item-name-${lineId}`} className="hover:underline">
              {product.name}
            </Link>
          </h4>
          <p className="text-[13px] text-ink-2 mt-0.5">
            Color:{' '}
            <span data-testid={`cart-item-color-${lineId}`} className="text-ink">
              {color.name}
            </span>
          </p>
          <p className="text-[13px] text-ink-2">
            Size:{' '}
            <span data-testid={`cart-item-size-${lineId}`} className="text-ink">
              {sizeName}
            </span>
          </p>
          <p data-testid={`cart-item-sku-${lineId}`} className="text-[13px] text-ink-2">
            {product.id}
          </p>
          <p className="text-[13px] text-ink-2">
            Unit Price:{' '}
            <span data-testid={`cart-item-unit-price-${lineId}`} className="tabular-nums">
              {product.formattedPrice}
            </span>
          </p>
          <p className="text-[13px] text-ink-3">
            Current stock:{' '}
            <span data-testid={`cart-item-stock-${lineId}`} className="tabular-nums">
              {liveStock}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
        <div className="flex items-center rounded-full bg-fill p-0.5">
          <button
            type="button"
            onClick={() => decreaseQuantity(product.id, color.id, sizeId)}
            data-testid={`decrease-quantity-${lineId}`}
            aria-label={`Decrease quantity of ${product.name} in ${color.name}, size ${sizeName}`}
            className={stepperButton}
          >
            <Minus className="w-3.5 h-3.5" strokeWidth={2} />
          </button>

          <span
            data-testid={`cart-item-quantity-${lineId}`}
            className="w-9 text-center text-[15px] text-ink tabular-nums select-none"
          >
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => increaseQuantity(product.id, color.id, sizeId)}
            disabled={isMaxStock}
            data-testid={`increase-quantity-${lineId}`}
            aria-label={`Increase quantity of ${product.name} in ${color.name}, size ${sizeName}`}
            className={stepperButton}
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>

        <span
          data-testid={`cart-item-subtotal-${lineId}`}
          className="text-[17px] text-ink tabular-nums min-w-[72px] text-right"
        >
          {formatCurrency(lineSubtotalCents)}
        </span>

        <button
          type="button"
          onClick={() => removeItem(product.id, color.id, sizeId)}
          data-testid={`remove-item-${lineId}`}
          aria-label={`Remove ${product.name} in ${color.name}, size ${sizeName} from cart`}
          className="text-[13px] link"
        >
          Remove
        </button>
      </div>
    </div>
  );
};
