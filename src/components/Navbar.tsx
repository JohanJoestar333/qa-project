import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Moon, ShoppingBag, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { summary } = useCart();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, isAuthenticated]);

  const initials = (user?.name ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-nav backdrop-blur-xl backdrop-saturate-150 border-b transition-colors duration-200 ${
        scrolled ? 'border-line' : 'border-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-5 h-12 flex items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <Link
            to={isAuthenticated ? '/products' : '/login'}
            className="text-[17px] font-semibold tracking-tight text-ink whitespace-nowrap transition-opacity hover:opacity-60"
            data-testid="brand-logo"
          >
            QA Cart
          </Link>

          {isAuthenticated && (
            <nav className="hidden sm:flex items-center text-[13px]">
              <Link
                to="/products"
                className={`transition-colors ${isCurrent('/products') ? 'text-ink' : 'text-ink-2 hover:text-ink'}`}
                data-testid="nav-products-link"
              >
                Catalog
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-1 text-[13px]">
          {isAuthenticated ? (
            <>
              <Link
                to="/cart"
                className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full text-ink hover:bg-fill transition-colors"
                aria-label="View Shopping Cart"
                data-testid="header-cart-link"
              >
                <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.75} />
                <span className="tabular-nums min-w-[1ch] text-center" data-testid="header-cart-count">
                  {summary.itemCount}
                </span>
              </Link>

              <div className="relative ml-1" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  className="h-8 pl-1 pr-2 inline-flex items-center gap-2 rounded-full text-ink-2 hover:text-ink hover:bg-fill transition-colors"
                  data-testid="header-user-info"
                >
                  <span className="w-6 h-6 rounded-full bg-fill-hover text-ink text-[11px] font-medium inline-flex items-center justify-center">
                    {initials}
                  </span>
                  <span className="hidden md:inline">{user?.name}</span>
                  <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} />
                </button>

                {menuOpen && (
                  <div
                    role="menu"
                    data-testid="header-user-menu"
                    className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-surface border border-line shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-1.5"
                  >
                    <div className="px-3 py-2">
                      <p data-testid="header-user-menu-name" className="text-[14px] text-ink">
                        {user?.name}
                      </p>
                      <p data-testid="header-user-menu-email" className="text-[12px] text-ink-3 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="h-px bg-line my-1" />
                    <button
                      type="button"
                      role="menuitem"
                      onClick={logout}
                      className="w-full text-left px-3 py-2 rounded-xl text-[14px] text-ink hover:bg-fill transition-colors"
                      data-testid="header-logout-button"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="h-8 px-2.5 inline-flex items-center rounded-full text-ink-2 hover:text-ink transition-colors whitespace-nowrap"
              data-testid="header-login-link"
            >
              Sign In
            </Link>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            className="w-8 h-8 inline-flex items-center justify-center rounded-full text-ink-2 hover:text-ink hover:bg-fill transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            data-testid="theme-toggle"
          >
            {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" strokeWidth={1.75} /> : <Moon className="w-[18px] h-[18px]" strokeWidth={1.75} />}
          </button>
        </div>
      </div>
    </header>
  );
};
