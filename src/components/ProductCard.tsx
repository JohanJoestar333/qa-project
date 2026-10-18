import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { getProductColor } from '../data/products';
import { ColorSwatches } from './ColorSwatches';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { getQuantityInCart } = useCart();
  const [colorId, setColorId] = useState(product.colors[0].id);
  const [imageError, setImageError] = useState(false);

  const color = getProductColor(product, colorId);
  const productPath = `/products/${product.id}?color=${color.id}`;

  const currentQuantityInCart = getQuantityInCart(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleColorSelect = (nextColorId: string) => {
    setColorId(nextColorId);
    setImageError(false);
  };

  const stockTone = isOutOfStock ? 'text-danger' : product.stock <= 5 ? 'text-warning' : 'text-ink-2';

  return (
    <article
      data-testid={`product-card-${product.id}`}
      className="card-hover flex flex-col h-full bg-surface rounded-[22px] overflow-hidden"
    >
      <Link
        to={productPath}
        data-testid={`product-link-${product.id}`}
        aria-label={`View ${product.name}`}
        className="relative block aspect-[4/3] w-full bg-fill overflow-hidden"
      >
        {!imageError ? (
          <img
            key={color.id}
            src={color.image}
            alt={`${product.name} in ${color.name}`}
            data-testid={`product-image-${product.id}`}
            loading="lazy"
            onError={() => setImageError(true)}
            className={`card-image fade-in w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
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
      </Link>

      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-[19px] leading-snug text-ink">
          <Link to={productPath} data-testid={`product-name-${product.id}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <p data-testid={`product-description-${product.id}`} className="text-sm text-ink-2 mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p data-testid={`product-price-${product.id}`} className="text-[17px] text-ink tabular-nums">
            {product.formattedPrice}
          </p>
          <ColorSwatches
            colors={product.colors}
            selectedId={color.id}
            onSelect={handleColorSelect}
            testIdPrefix={`card-color-${product.id}`}
          />
        </div>

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

          {isOutOfStock ? (
            <button type="button" disabled data-testid={`select-options-${product.id}`} className="btn btn-primary">
              Out of Stock
            </button>
          ) : (
            <Link to={productPath} data-testid={`select-options-${product.id}`} className="btn btn-primary">
              Select Options
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};
