import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getLineId } from '../data/products';
import { formatCurrency, TAX_RATE_PERCENT } from '../utils/currency';

export const OrderConfirmationPage: React.FC = () => {
  const { lastOrder } = useCart();

  if (!lastOrder) {
    return <Navigate to="/products" replace />;
  }

  const formattedDate = new Date(lastOrder.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div data-testid="order-confirmation-page" className="max-w-2xl mx-auto px-5 pt-16 pb-20">
      <header className="text-center mb-12">
        <h1 data-testid="order-confirmation-title" className="text-[32px] sm:text-[40px] leading-[1.1] text-ink">
          Thank you for your order.
        </h1>
        <p className="text-[15px] text-ink-2 mt-3">
          A confirmation has been sent to your account email address.
        </p>
        <p className="text-[15px] text-ink-2 mt-1">
          Order Number:{' '}
          <span data-testid="order-confirmation-number" className="text-ink tabular-nums">
            {lastOrder.orderNumber}
          </span>
        </p>
      </header>

      <div className="bg-surface rounded-[22px] p-6 sm:p-8">
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-5 pb-6 border-b border-line text-[14px]">
          <div>
            <dt className="text-ink-3">Order Date</dt>
            <dd data-testid="order-confirmation-date" className="text-ink mt-0.5">
              {formattedDate}
            </dd>
          </div>
          <div>
            <dt className="text-ink-3">Status</dt>
            <dd data-testid="order-confirmation-status" className="text-success mt-0.5">
              Confirmed (Processing)
            </dd>
          </div>
          <div>
            <dt className="text-ink-3">Payment</dt>
            <dd data-testid="order-confirmation-payment" className="text-ink mt-0.5">
              Visa ending in 4242
            </dd>
          </div>
        </dl>

        <section className="py-6">
          <h2 className="text-[19px] text-ink mb-4">Purchased Items</h2>
          <div data-testid="order-confirmation-items" className="divide-y divide-line">
            {lastOrder.items.map((item) => {
              const lineId = getLineId(item.id, item.colorId, item.sizeId);
              return (
                <div
                  key={lineId}
                  data-testid={`confirmed-item-${lineId}`}
                  className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={item.image}
                      alt={`${item.name} in ${item.colorName}, size ${item.sizeName}`}
                      className="w-14 h-14 rounded-xl object-cover bg-fill shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-[15px] text-ink">{item.name}</p>
                      <p className="text-[13px] text-ink-2">
                        Color:{' '}
                        <span data-testid={`confirmed-item-color-${lineId}`}>{item.colorName}</span>
                      </p>
                      <p className="text-[13px] text-ink-2">
                        Size:{' '}
                        <span data-testid={`confirmed-item-size-${lineId}`}>{item.sizeName}</span>
                      </p>
                      <p className="text-[13px] text-ink-2">
                        Qty: <span className="tabular-nums">{item.quantity}</span> × {formatCurrency(item.unitPriceCents)}
                      </p>
                    </div>
                  </div>
                  <span className="text-[15px] text-ink tabular-nums shrink-0">
                    {formatCurrency(item.subtotalCents)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-line">
          <div data-testid="order-confirmation-address" className="text-[14px] text-ink-2 leading-relaxed">
            <h3 className="text-[15px] font-semibold text-ink mb-2">Delivering to</h3>
            <p className="text-ink">{lastOrder.address.recipient}</p>
            <p>{lastOrder.address.street}</p>
            <p>
              {lastOrder.address.city}, {lastOrder.address.state} {lastOrder.address.zip}
            </p>
            <p>{lastOrder.address.country}</p>
          </div>

          <dl className="space-y-2 text-[14px]">
            <div className="flex justify-between">
              <dt className="text-ink-2">Subtotal</dt>
              <dd data-testid="order-confirmation-subtotal" className="text-ink tabular-nums">
                {formatCurrency(lastOrder.subtotalCents)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-2">Shipping</dt>
              <dd data-testid="order-confirmation-shipping" className="text-ink tabular-nums">
                {formatCurrency(lastOrder.shippingCents)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-2">Tax ({TAX_RATE_PERCENT}%)</dt>
              <dd data-testid="order-confirmation-tax" className="text-ink tabular-nums">
                {formatCurrency(lastOrder.taxCents)}
              </dd>
            </div>
            <div className="pt-3 mt-1 border-t border-line flex justify-between items-baseline">
              <dt className="text-[15px] font-semibold text-ink">Total Paid</dt>
              <dd data-testid="order-confirmation-total" className="text-[17px] font-semibold text-ink tabular-nums">
                {formatCurrency(lastOrder.totalCents)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/products"
          data-testid="continue-shopping-after-order-button"
          className="btn btn-primary"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};
