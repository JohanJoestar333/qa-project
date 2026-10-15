import React from 'react';
import { CartSummary } from '../types';
import { TAX_RATE_PERCENT } from '../utils/currency';

interface OrderSummaryProps {
  summary: CartSummary;
  showTitle?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ summary, showTitle = true }) => {
  return (
    <div data-testid="checkout-order-summary" className="bg-surface rounded-[22px] p-6">
      {showTitle && <h3 className="text-[19px] text-ink mb-5">Order Summary</h3>}

      <dl className="space-y-3 text-[15px]">
        <div className="flex justify-between items-baseline">
          <dt data-testid="checkout-subtotal-label" className="text-ink-2">
            Subtotal ({summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'})
          </dt>
          <dd data-testid="checkout-subtotal" className="text-ink tabular-nums">
            {summary.formattedSubtotal}
          </dd>
        </div>

        <div className="flex justify-between items-baseline">
          <dt className="text-ink-2">Shipping</dt>
          <dd data-testid="checkout-shipping" className="text-ink tabular-nums">
            {summary.formattedShipping}
          </dd>
        </div>

        <div className="flex justify-between items-baseline">
          <dt className="text-ink-2">Estimated Tax ({TAX_RATE_PERCENT}%)</dt>
          <dd data-testid="checkout-tax" className="text-ink tabular-nums">
            {summary.formattedTax}
          </dd>
        </div>

        <div className="pt-4 mt-1 border-t border-line flex justify-between items-baseline">
          <dt className="text-[19px] font-semibold text-ink">Total</dt>
          <dd data-testid="checkout-total" className="text-[19px] font-semibold text-ink tabular-nums">
            {summary.formattedTotal}
          </dd>
        </div>
      </dl>
    </div>
  );
};
