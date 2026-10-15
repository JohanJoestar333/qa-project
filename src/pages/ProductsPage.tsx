import React from 'react';
import { ProductCard } from '../components/ProductCard';
import { Reveal } from '../components/Reveal';
import { useCart } from '../context/CartContext';
import { TAX_RATE_PERCENT } from '../utils/currency';

export const ProductsPage: React.FC = () => {
  const { products } = useCart();

  return (
    <div data-testid="products-page" className="max-w-5xl mx-auto px-5 pt-14 pb-20">
      <header className="mb-12">
        <h1 data-testid="products-title" className="text-[40px] sm:text-[56px] leading-[1.07] text-ink">
          CloudSoft
        </h1>
        <p className="text-[19px] sm:text-[21px] text-ink-2 mt-3 max-w-xl leading-snug">
          Hoodies, sweatshirts and tees in soft, heavyweight cotton.
        </p>
      </header>

      <section aria-label="Product Catalog">
        <div data-testid="product-list" className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {products.map((product, index) => (
            <Reveal key={product.id} delayMs={index * 80} className="h-full">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      <p data-testid="catalog-shipping-note" className="mt-10 text-[13px] text-ink-3">
        Free standard shipping on every order. {TAX_RATE_PERCENT}% tax is added at checkout.
      </p>
    </div>
  );
};
