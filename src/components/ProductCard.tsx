import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, items } = useCart();
  const { showToast } = useToast();
  const [imageError, setImageError] = useState(false);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  const cartItem = items.find((item) => item.product.id === product.id);
  const currentQuantityInCart = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock <= 0;
  const isMaxStockReached = isOutOfStock || currentQuantityInCart >= product.stock;

  const handleAddToCart = () => {
    if (isMaxStockReached) return;

    const result = addItem(product, 1);
    if (result.success) {
      showToast({
        title: 'Added to cart',
        detail: product.name,
        actionLabel: 'View Cart',
        actionTo: '/cart',
      });
      setIsAddedFeedback(true);
      setTimeout(() => setIsAddedFeedback(false), 1200);
    }
  };

  const stockTone = isOutOfStock ? 'text-danger' : product.stock <= 5 ? 'text-warning' : 'text-ink-2';

  const buttonLabel = isAddedFeedback
    ? 'Added'
    : isOutOfStock
    ? 'Out of Stock'
    : isMaxStockReached
    ? 'Max Limit'
    : 'Add to Cart';

  return (
    <article
      data-testid={`product-card-${product.id}`}
      className="card-hover flex flex-col h-full bg-surface rounded-[22px] overflow-hidden"
    >
      <div className="relative aspect-[4/3] w-full bg-fill overflow-hidden">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            data-testid={`product-image-${product.id}`}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImageError(true)}
            className={`card-image w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-6 text-sm text-ink-3">
            {product.name}
          </div>
        )}

        {product.tag && (
          <span
            data-testid={`product-tag-${product.id}`}
            className="absolute top-3 left-3 text-xs text-ink bg-surface/90 backdrop-blur px-2.5 py-1 rounded-full"
          >
            {product.tag}
          </span>
        )}

        {isOutOfStock && (
          <span
            data-testid={`product-sold-out-${product.id}`}
            className="absolute top-3 right-3 text-xs text-danger bg-surface/90 backdrop-blur px-2.5 py-1 rounded-full"
          >
            Sold Out
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-6">
        <h3 data-testid={`product-name-${product.id}`} className="text-[19px] leading-snug text-ink">
          {product.name}
        </h3>
        <p data-testid={`product-description-${product.id}`} className="text-sm text-ink-2 mt-1 line-clamp-2">
          {product.description}
        </p>

        <p data-testid={`product-price-${product.id}`} className="text-[17px] text-ink tabular-nums mt-4">
          {product.formattedPrice}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-[13px] tabular-nums">
            <span data-testid={`product-stock-${product.id}`} className={stockTone}>
              Stock: {product.stock}
            </span>
            {currentQuantityInCart > 0 && (
              <span data-testid={`product-in-cart-${product.id}`} className="text-ink-2">
                {' '}({currentQuantityInCart} in cart)
              </span>
            )}
          </p>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isMaxStockReached}
            data-testid={`add-to-cart-${product.id}`}
            className="btn btn-primary"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </article>
  );
};
