import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { SAVED_DELIVERY_ADDRESS, SAVED_PAYMENT_METHOD } from '../data/mockUser';
import { OrderSummary } from '../components/OrderSummary';
import { getLineId, getProductColor, getProductSize } from '../data/products';
import { formatCurrency, calculateItemSubtotal } from '../utils/currency';

export const CheckoutPage: React.FC = () => {
  const { items, summary, createOrder } = useCart();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isEmpty = items.length === 0;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (isEmpty) {
      setErrorMessage('Your cart is empty. Please add items before checking out.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = createOrder();

    if (result.success && result.order) {
      navigate('/order-confirmation', { replace: true });
    } else {
      setErrorMessage(result.error || 'Failed to process order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div data-testid="checkout-page" className="max-w-5xl mx-auto px-5 pt-14 pb-20">
      <header className="mb-10">
        <Link
          to="/cart"
          data-testid="return-to-cart-link"
          className="link text-[15px] inline-block mb-3"
        >
          Return to Cart
        </Link>
        <h1 data-testid="checkout-title" className="text-[32px] sm:text-[40px] leading-[1.1] text-ink">
          Checkout
        </h1>
      </header>

      {(errorMessage || isEmpty) && (
        <div
          data-testid="checkout-error-message"
          role="alert"
          className="mb-6 px-5 py-4 rounded-2xl bg-danger-soft text-danger flex items-start justify-between gap-4"
        >
          <div>
            <h4 className="text-[15px] font-semibold">Cannot Proceed to Order</h4>
            <p className="text-[14px] mt-0.5">
              {errorMessage || 'Your cart is empty. Please add items before checking out.'}
            </p>
          </div>
          <Link
            to="/products"
            data-testid="checkout-go-to-catalog-link"
            className="text-[14px] underline whitespace-nowrap shrink-0"
          >
            Go to Catalog
          </Link>
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-7 space-y-5">
            <section className="bg-surface rounded-[22px] p-6">
              <h3 className="text-[19px] text-ink mb-4">Delivery Address</h3>
              <div
                data-testid="checkout-delivery-address"
                className="text-[15px] text-ink-2 leading-relaxed"
              >
                <p className="text-ink">
                  {SAVED_DELIVERY_ADDRESS.recipient}{' '}
                  <span className="text-ink-3">({SAVED_DELIVERY_ADDRESS.label})</span>
                </p>
                <p>{SAVED_DELIVERY_ADDRESS.street}</p>
                <p>
                  {SAVED_DELIVERY_ADDRESS.city}, {SAVED_DELIVERY_ADDRESS.state} {SAVED_DELIVERY_ADDRESS.zip}
                </p>
                <p>{SAVED_DELIVERY_ADDRESS.country}</p>
              </div>
              <p data-testid="checkout-delivery-note" className="text-[13px] text-ink-3 mt-4">
                Standard delivery is included ($0.00).
              </p>
            </section>

            <section className="bg-surface rounded-[22px] p-6">
              <h3 className="text-[19px] text-ink mb-4">Payment Method</h3>
              <div
                data-testid="checkout-payment-method"
                className="text-[15px] text-ink-2 leading-relaxed"
              >
                <p className="text-ink">
                  {SAVED_PAYMENT_METHOD.label}{' '}
                  <span className="text-ink-2 tabular-nums">{SAVED_PAYMENT_METHOD.displayedNumber}</span>
                </p>
                <p>
                  Cardholder: {SAVED_PAYMENT_METHOD.cardholder}
                </p>
                <p>
                  Expires: <span className="tabular-nums">{SAVED_PAYMENT_METHOD.expiration}</span>
                </p>
              </div>
              <p data-testid="checkout-payment-note" className="text-[13px] text-ink-3 mt-4">
                This is a simulated payment method. No real transaction takes place.
              </p>
            </section>

            <section className="bg-surface rounded-[22px] p-6">
              <h3 className="text-[19px] text-ink mb-4">Items in This Order</h3>

              {items.length > 0 ? (
                <div data-testid="checkout-items-list" className="divide-y divide-line">
                  {items.map((item) => {
                    const color = getProductColor(item.product, item.colorId);
                    const sizeName = getProductSize(item.product, item.sizeId)?.name ?? item.sizeId.toUpperCase();
                    const lineId = getLineId(item.product.id, color.id, item.sizeId);
                    return (
                      <div
                        key={lineId}
                        data-testid={`checkout-item-${lineId}`}
                        className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={color.image}
                            alt={`${item.product.name} in ${color.name}`}
                            className="w-14 h-14 rounded-xl object-cover bg-fill shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-[15px] text-ink truncate">{item.product.name}</p>
                            <p className="text-[13px] text-ink-2">
                              Color:{' '}
                              <span data-testid={`checkout-item-color-${lineId}`}>{color.name}</span>
                            </p>
                            <p className="text-[13px] text-ink-2">
                              Size:{' '}
                              <span data-testid={`checkout-item-size-${lineId}`}>{sizeName}</span>
                            </p>
                            <p className="text-[13px] text-ink-2">
                              Qty:{' '}
                              <span data-testid={`checkout-item-quantity-${lineId}`} className="tabular-nums">
                                {item.quantity}
                              </span>{' '}
                              × {item.product.formattedPrice}
                            </p>
                          </div>
                        </div>
                        <span
                          data-testid={`checkout-item-subtotal-${lineId}`}
                          className="text-[15px] text-ink tabular-nums shrink-0"
                        >
                          {formatCurrency(calculateItemSubtotal(item.product.priceCents, item.quantity))}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p data-testid="checkout-empty-items-message" className="text-[15px] text-ink-3">
                  No items in your cart.
                </p>
              )}
            </section>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <OrderSummary summary={summary} />

            <button
              type="submit"
              disabled={isSubmitting || isEmpty}
              data-testid="place-order-button"
              className="btn btn-primary btn-lg"
            >
              {isSubmitting ? 'Processing Order...' : `Place Order (${summary.formattedTotal})`}
            </button>

            <div className="text-center">
              <Link to="/cart" data-testid="return-to-cart-button" className="link text-[14px]">
                Return to Cart
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
