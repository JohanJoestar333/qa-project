import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItemRow } from '../components/CartItemRow';
import { OrderSummary } from '../components/OrderSummary';

export const CartPage: React.FC = () => {
  const { items, summary, clearCart } = useCart();
  const navigate = useNavigate();

  const isEmpty = items.length === 0;

  return (
    <div data-testid="cart-page" className="max-w-5xl mx-auto px-5 pt-14 pb-20">
      <header className="flex items-end justify-between gap-4 mb-10">
        <div>
          <h1 data-testid="cart-title" className="text-[32px] sm:text-[40px] leading-[1.1] text-ink">
            Review Your Cart
          </h1>
          <p data-testid="cart-subtitle" className="text-[15px] text-ink-2 mt-2">
            Free standard shipping and free returns.
          </p>
        </div>

        {!isEmpty && (
          <button
            type="button"
            onClick={clearCart}
            data-testid="cart-clear-button"
            className="link text-[15px] shrink-0"
          >
            Empty Cart
          </button>
        )}
      </header>

      {isEmpty ? (
        <div data-testid="cart-empty-state" className="bg-surface rounded-[22px] px-6 py-16 text-center max-w-lg mx-auto">
          <h2 className="text-[24px] text-ink">Your Cart is Empty</h2>
          <p data-testid="cart-empty-message" className="text-[15px] text-ink-2 mt-2 mb-8">
            Add something from the catalog to get started.
          </p>
          <Link to="/products" data-testid="continue-shopping-button" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-7 bg-surface rounded-[22px] p-6">
            <div data-testid="cart-items-list" className="divide-y divide-line">
              {items.map((item) => (
                <CartItemRow key={item.product.id} item={item} />
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-line flex items-baseline justify-between">
              <span className="text-[15px] text-ink-2">Cart Subtotal</span>
              <span data-testid="cart-subtotal" className="text-[19px] font-semibold text-ink tabular-nums">
                {summary.formattedSubtotal}
              </span>
            </div>

            <div className="mt-5">
              <Link to="/products" data-testid="continue-shopping-button" className="link text-[15px]">
                Continue Shopping
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <OrderSummary summary={summary} />

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              data-testid="proceed-to-checkout-button"
              className="btn btn-primary btn-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
