import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { PRECONFIGURED_USER } from '../data/mockUser';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { THEME_STORAGE_KEY } from '../context/ThemeContext';
import { SESSION_STORAGE_KEY } from '../context/AuthContext';
import { TAX_RATE_PERCENT } from '../utils/currency';

const CHECKS = [
  'Stock decrements immediately after an order',
  'Empty inputs trigger inline validation',
  'Invalid email format shows an error',
  'Unregistered user shows login-error-message',
  'Wrong password shows login-error-message',
  `Tax is ${TAX_RATE_PERCENT}%, calculated in integer cents`,
  'Checkout with an empty cart is blocked',
  'After an order the cart is emptied and an order number is generated',
];

export const QAHelperDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { clearCart, clearLastOrder, resetStock, products } = useCart();
  const { logout } = useAuth();

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleResetDemoState = () => {
    clearCart();
    clearLastOrder();
    resetStock();
    // Keep the signed-in session and theme; only sign out via Sign Out
    const preserved = [SESSION_STORAGE_KEY, THEME_STORAGE_KEY]
      .map((key) => [key, localStorage.getItem(key)] as const)
      .filter(([, value]) => value !== null);
    localStorage.clear();
    preserved.forEach(([key, value]) => localStorage.setItem(key, value as string));
    window.location.reload();
  };

  return (
    <aside aria-label="QA Test Suite Helper" className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm">
      <div className="bg-nav backdrop-blur-xl backdrop-saturate-150 rounded-2xl border border-line shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="w-full px-4 h-11 flex items-center justify-between text-[13px] text-ink"
          data-testid="qa-helper-toggle"
        >
          <span>QA Panel</span>
          {isOpen ? <ChevronDown className="w-4 h-4 text-ink-2" /> : <ChevronUp className="w-4 h-4 text-ink-2" />}
        </button>

        {isOpen && (
          <div
            data-testid="qa-helper-panel"
            className="px-4 pb-4 pt-1 text-[13px] text-ink-2 space-y-5 max-h-[70vh] overflow-y-auto"
          >
            <section>
              <h4 className="text-ink font-semibold mb-2">Live stock</h4>
              <div className="grid grid-cols-3 gap-2">
                {products.map((p) => (
                  <div key={p.id} data-testid={`qa-stock-${p.id}`} className="bg-fill rounded-xl px-3 py-2">
                    <p className="text-xs text-ink-3">{p.id}</p>
                    <p className="text-ink tabular-nums text-[17px] leading-tight">{p.stock}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h4 className="text-ink font-semibold mb-2">Test account</h4>
              <dl className="bg-fill rounded-xl px-3 py-2.5 space-y-1.5">
                <div className="flex justify-between gap-3">
                  <dt>Name</dt>
                  <dd data-testid="qa-user-name" className="text-ink">{PRECONFIGURED_USER.name}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Email</dt>
                  <dd className="flex items-center gap-3">
                    <span data-testid="qa-user-email" className="text-ink">{PRECONFIGURED_USER.email}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(PRECONFIGURED_USER.email, 'email')}
                      data-testid="qa-copy-email-button"
                      className="link"
                    >
                      {copiedKey === 'email' ? 'Copied' : 'Copy'}
                    </button>
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Password</dt>
                  <dd className="flex items-center gap-3">
                    <span data-testid="qa-user-password" className="text-ink">{PRECONFIGURED_USER.password}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(PRECONFIGURED_USER.password, 'pass')}
                      data-testid="qa-copy-password-button"
                      className="link"
                    >
                      {copiedKey === 'pass' ? 'Copied' : 'Copy'}
                    </button>
                  </dd>
                </div>
              </dl>
            </section>

            <section>
              <h4 className="text-ink font-semibold mb-2">Scenarios to verify</h4>
              <ul className="list-disc pl-5 space-y-1 marker:text-ink-3">
                {CHECKS.map((check) => (
                  <li key={check}>{check}</li>
                ))}
              </ul>
            </section>

            <div className="pt-3 border-t border-line flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetDemoState}
                data-testid="qa-reset-state-button"
                className="btn btn-secondary py-1.5 text-[13px]"
              >
                Reset Demo & Stock
              </button>
              <button type="button" onClick={logout} data-testid="qa-logout-button" className="link">
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
