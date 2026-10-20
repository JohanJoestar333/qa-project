import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Minus, Plus } from 'lucide-react';
import { Accordion } from '../components/Accordion';
import { ColorSwatches } from '../components/ColorSwatches';
import { ProductCard } from '../components/ProductCard';
import { Reveal } from '../components/Reveal';
import { SizeSelector } from '../components/SizeSelector';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { getProductColor, getProductSize } from '../data/products';

const SHIPPING_AND_RETURNS =
  'Standard shipping is free on every order, and returns are free too. Tax of 10% is added at checkout.';

export const ProductPage: React.FC = () => {
  const { productId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, getQuantityInCart, addItem } = useCart();
  const { showToast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [showSizeError, setShowSizeError] = useState(false);
  const buyBoxRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);

  const product = products.find((p) => p.id === productId);
  const quantityInCart = product ? getQuantityInCart(product.id) : 0;
  const remaining = product ? Math.max(product.stock - quantityInCart, 0) : 0;

  useEffect(() => {
    setQuantity(1);
  }, [productId]);

  // Keep the chosen quantity within what is still available
  useEffect(() => {
    if (quantity > Math.max(remaining, 1)) setQuantity(Math.max(remaining, 1));
  }, [quantity, remaining]);

  // Load the other color photos up front so switching colors is instant
  useEffect(() => {
    product?.colors.forEach((color) => {
      const preload = new Image();
      preload.src = color.image;
    });
  }, [product]);

  // Show the slim buy bar once the main Add to Cart button has scrolled out of view above the screen
  useEffect(() => {
    const node = buyBoxRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 60),
      { rootMargin: '-60px 0px 0px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [productId, Boolean(product)]);

  if (!product) {
    return (
      <div data-testid="product-not-found" className="max-w-lg mx-auto px-5 pt-24 pb-20 text-center">
        <h1 className="text-[32px] leading-tight text-ink">Product not found</h1>
        <p className="text-[15px] text-ink-2 mt-2 mb-8">We could not find the product you were looking for.</p>
        <Link to="/products" data-testid="product-not-found-link" className="btn btn-primary">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const color = getProductColor(product, searchParams.get('color'));
  // No default size: the shopper has to choose one before adding to the cart
  const size = getProductSize(product, searchParams.get('size')) ?? null;
  const isOutOfStock = product.stock <= 0;
  const isMaxStockReached = remaining <= 0;
  const stockTone = isOutOfStock ? 'text-danger' : product.stock <= 5 ? 'text-warning' : 'text-ink-2';

  // Color and size live in the URL so a choice survives a reload and can be shared as a link
  const updateParam = (key: string, value: string) => {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        next.set(key, value);
        return next;
      },
      { replace: true },
    );
  };

  const handleColorSelect = (colorId: string) => updateParam('color', colorId);

  const handleSizeSelect = (sizeId: string) => {
    updateParam('size', sizeId);
    setShowSizeError(false);
  };

  const handleAddToCart = () => {
    if (!size) {
      setShowSizeError(true);
      sizeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const result = addItem(product, color.id, size.id, quantity);
    if (!result.success) return;

    showToast({
      title: 'Added to cart',
      detail: `${product.name}, ${color.name}, ${size.name}`,
      actionLabel: 'View Cart',
      actionTo: '/cart',
    });
    setQuantity(1);
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 1200);
  };

  const buttonLabel = isAddedFeedback
    ? 'Added'
    : isOutOfStock
    ? 'Out of Stock'
    : isMaxStockReached
    ? 'Max Limit'
    : 'Add to Cart';

  const stepperButton =
    'w-9 h-9 flex items-center justify-center rounded-full text-ink hover:bg-surface transition-colors disabled:text-ink-3 disabled:hover:bg-transparent disabled:cursor-not-allowed';

  const otherProducts = products.filter((p) => p.id !== product.id);

  const accordionItems = [
    {
      id: 'details',
      title: 'Details',
      content: (
        <ul data-testid="product-details-list" className="list-disc pl-5 space-y-1.5 marker:text-ink-3">
          {product.details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      ),
    },
    {
      id: 'care',
      title: 'Care',
      content: <p data-testid="product-care-text">{product.care}</p>,
    },
    {
      id: 'shipping',
      title: 'Shipping and returns',
      content: <p data-testid="product-shipping-text">{SHIPPING_AND_RETURNS}</p>,
    },
  ];

  return (
    <div data-testid="product-page" className="max-w-5xl mx-auto px-5 pt-8 pb-20">
      <div
        data-testid="product-sticky-bar"
        aria-hidden={!showStickyBar}
        className={`fixed top-12 inset-x-0 z-30 bg-nav backdrop-blur-xl backdrop-saturate-150 border-b border-line transition-[transform,opacity,visibility] duration-300 ${
          showStickyBar ? 'translate-y-0 opacity-100 visible' : '-translate-y-full opacity-0 invisible'
        }`}
      >
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
          <p className="min-w-0 truncate text-[15px] text-ink">
            {product.name}{' '}
            <span className="text-ink-2">
              {color.name}
              {size ? `, ${size.name}` : ''}
            </span>
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <span className="hidden sm:inline text-[15px] text-ink tabular-nums">{product.formattedPrice}</span>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isMaxStockReached}
              tabIndex={showStickyBar ? 0 : -1}
              data-testid="product-sticky-add-to-cart"
              className="btn btn-primary"
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>

      <Link
        to="/products"
        data-testid="product-back-link"
        className="link text-[15px] inline-flex items-center gap-0.5 mb-6"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={2} />
        Catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
        <div className="md:col-span-7">
          <div className="relative aspect-[4/3] bg-fill rounded-[22px] overflow-hidden">
            <img
              key={color.id}
              src={color.image}
              alt={`${product.name} in ${color.name}`}
              data-testid="product-page-image"
              className={`fade-in w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
            />

            {product.tag && (
              <span
                data-testid="product-page-tag"
                className="absolute top-4 left-4 text-xs text-ink bg-surface/90 backdrop-blur px-2.5 py-1 rounded-full"
              >
                {product.tag}
              </span>
            )}
          </div>

          <div data-testid="product-thumbnails" className="grid grid-cols-3 gap-3 mt-3">
            {product.colors.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={option.id === color.id}
                aria-label={`Show ${option.name}`}
                onClick={() => handleColorSelect(option.id)}
                data-testid={`product-thumb-${option.id}`}
                className="thumb"
              >
                <img src={option.image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-5 md:sticky md:top-32">
          <h1 data-testid="product-page-name" className="text-[32px] sm:text-[44px] leading-[1.08] text-ink">
            {product.name}
          </h1>
          <p data-testid="product-page-price" className="text-[21px] text-ink tabular-nums mt-3">
            {product.formattedPrice}
          </p>
          <p data-testid="product-page-description" className="text-[15px] text-ink-2 mt-4 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-8">
            <p className="text-[15px] text-ink-2">
              Color:{' '}
              <span data-testid="product-selected-color" className="text-ink">
                {color.name}
              </span>
            </p>
            <div className="mt-3">
              <ColorSwatches
                colors={product.colors}
                selectedId={color.id}
                onSelect={handleColorSelect}
                testIdPrefix="product-color"
                size="large"
              />
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[15px] text-ink-2">
              Size:{' '}
              <span data-testid="product-selected-size" className="text-ink">
                {size ? size.name : 'None selected'}
              </span>
            </p>
            <div className="mt-3">
              <SizeSelector
                ref={sizeRef}
                sizes={product.sizes}
                selectedId={size ? size.id : null}
                onSelect={handleSizeSelect}
                hasError={showSizeError}
                testIdPrefix="product-size"
              />
            </div>
            {showSizeError && (
              <p data-testid="product-size-error" role="alert" className="mt-2 text-[13px] text-danger">
                Please select a size.
              </p>
            )}
          </div>

          <p className="text-[13px] tabular-nums mt-8">
            <span data-testid="product-page-stock" className={stockTone}>
              Stock: {product.stock}
            </span>
            {quantityInCart > 0 && (
              <span data-testid="product-page-in-cart" className="text-ink-2">
                {' '}({quantityInCart} in cart)
              </span>
            )}
          </p>

          <div ref={buyBoxRef} className="mt-3 flex items-center gap-4">
            <div className="flex items-center rounded-full bg-fill p-0.5 shrink-0">
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                disabled={quantity <= 1}
                data-testid="product-quantity-decrease"
                aria-label="Decrease quantity"
                className={stepperButton}
              >
                <Minus className="w-3.5 h-3.5" strokeWidth={2} />
              </button>

              <span
                data-testid="product-quantity-value"
                className="w-10 text-center text-[15px] text-ink tabular-nums select-none"
              >
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => setQuantity((current) => Math.min(remaining, current + 1))}
                disabled={quantity >= remaining}
                data-testid="product-quantity-increase"
                aria-label="Increase quantity"
                className={stepperButton}
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isMaxStockReached}
              data-testid="product-page-add-to-cart"
              className="btn btn-primary btn-lg flex-1"
            >
              {buttonLabel}
            </button>
          </div>

          <p className="text-[13px] text-ink-3 mt-6">Free standard shipping and free returns.</p>
        </div>
      </div>

      <Reveal className="mt-24 sm:mt-32">
        <section data-testid="product-about" aria-label="About this item" className="max-w-2xl mx-auto text-center">
          <h2 className="text-[15px] text-ink-2">About this item</h2>
          <p
            data-testid="product-about-text"
            className="mt-4 text-[24px] sm:text-[28px] leading-[1.25] tracking-tight text-ink"
          >
            {product.longDescription}
          </p>
        </section>
      </Reveal>

      <Reveal className="mt-16 sm:mt-20">
        <div className="max-w-2xl mx-auto">
          <Accordion items={accordionItems} defaultOpenId="details" testIdPrefix="product-accordion" />
        </div>
      </Reveal>

      <section aria-label="More from CloudSoft" className="mt-24 sm:mt-32">
        <h2 className="text-[24px] text-ink mb-6">More from CloudSoft</h2>
        <div data-testid="related-products" className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {otherProducts.map((other) => (
            <ProductCard key={other.id} product={other} />
          ))}
        </div>
      </section>
    </div>
  );
};
