# QA Cart

QA Cart is a small online store I built as the **system under test for my QA portfolio**. It is not a real shop. It exists so I can show how I approach test design, manual testing and Playwright automation against a realistic but fully predictable application.

**Live demo:** https://qa-project-automation.vercel.app/

Everything about it is deterministic: one test user, three products, no backend, fixed pricing rules, and a stable `data-testid` on every element worth asserting.

## What this project is for

- **Practicing test design.** The app has clear rules to test: login validation, stock limits, price math, session handling and protected routes.
- **Showing locator strategy.** Every interactive or assertable element has a `data-testid`, so tests do not depend on CSS classes or copy.
- **Practicing Playwright.** The app is small, predictable and fully instrumented with test IDs, which makes it a good fit for learning and showing Playwright.
- **Having data I can control.** State lives in `localStorage` and can be reset with one button, so each test run can start clean.

This repository contains the application, the test ID reference and a few example scenarios. I am writing the Playwright tests myself.

## What can be tested

| Area | Things to verify |
|---|---|
| Login | Empty fields, invalid email format, unknown email, wrong password, successful login, show/hide password |
| Access control | Catalog, cart, checkout and confirmation redirect to `/login` when signed out |
| Session | Stays signed in after reload, ends only through Sign Out (profile menu or QA panel) |
| Catalog | Stock shown per product, "in cart" count, sold-out and max-limit states |
| Cart | Add, increase, decrease, remove, empty cart, quantity capped at stock, live header count |
| Pricing | Integer-cent math, free shipping, 10% tax, totals on cart, checkout and confirmation |
| Checkout | Saved address and payment, empty cart blocked, order placed once |
| Order result | Order number format, itemized receipt, stock reduced, cart emptied |
| Feedback | "Added to cart" notification after a successful add |
| Appearance | Light and dark mode, saved between visits |

## Getting started

Requires Node.js 20 or later.

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build in dist/
npm run preview   # serve the production build
npm run lint      # type-check with tsc
```

## Test data

### Registered user
| Field | Value |
|---|---|
| Name | Alex Morgan |
| Email | `alex.morgan@example.com` |
| Password | `Test123!` |

The same credentials are shown, with copy buttons, in the QA panel at the bottom right of every page.

### Saved delivery address
Alex Morgan, 123 QA Testing Lane, Austin, Texas 78701, United States

### Saved payment method
Personal Visa, `•••• •••• •••• 4242`, expires 12/28

### Products (50 units each)
| ID | Name | Price |
|---|---|---|
| `PC-001` | CloudSoft Everyday Hoodie | $39.99 |
| `PC-002` | CloudSoft Classic Sweatshirt | $34.99 |
| `PC-003` | CloudSoft Essential T-Shirt | $19.99 |

### Pricing rules
- Shipping is always $0.00.
- Tax is 10% of the subtotal, rounded to the nearest cent.
- Total = subtotal + shipping + tax, all in integer cents.

## Resetting state

Cart, session, stock, last order and theme are stored in `localStorage`. **Reset Demo & Stock** in the QA panel clears the cart, last order and stock, and keeps you signed in. Use **Sign Out** in the profile menu (click your name in the header) or in the QA panel to end the session.

## `data-testid` reference

Names follow `<area>-<element>`. Elements that exist once per product end with the product ID, for example `product-price-PC-001`. Items marked "per product" exist for `PC-001`, `PC-002` and `PC-003`.

### Header and navigation
- `brand-logo`: QA Cart wordmark
- `nav-products-link`: Catalog link
- `header-cart-link`: Cart link
- `header-cart-count`: Number of items in the cart
- `header-login-link`: Sign In link (signed out only)
- `header-user-info`: Profile button that opens the menu
- `header-user-menu`: The open profile menu
- `header-user-menu-name`, `header-user-menu-email`: Signed-in user details inside the menu
- `header-logout-button`: Sign Out item inside the menu (visible once the menu is open)
- `theme-toggle`: Switches between light and dark mode
- `toast`: "Added to cart" notification
- `toast-action`: View Cart link inside the notification

### Login (`/login`)
- `login-page`, `login-title`, `login-form`
- `login-email-input`, `login-email-error`
- `login-password-input`, `login-password-error`, `login-password-toggle`
- `login-submit-button`
- `login-error-message`: Banner for unknown email or wrong password

### Catalog (`/products`)
- `products-page`, `products-title`, `product-list`, `catalog-shipping-note`
- Per product: `product-card-<id>`, `product-image-<id>`, `product-name-<id>`, `product-description-<id>`, `product-price-<id>`, `product-stock-<id>`, `product-in-cart-<id>`, `product-tag-<id>`, `product-sold-out-<id>`, `add-to-cart-<id>`

### Cart (`/cart`)
- `cart-page`, `cart-title`, `cart-subtitle`, `cart-items-list`
- `cart-clear-button`: Empties the cart
- `cart-subtotal`
- `cart-empty-state`, `cart-empty-message`
- `continue-shopping-button`: Returns to `/products`
- `proceed-to-checkout-button`
- Per product: `cart-item-<id>`, `cart-item-image-<id>`, `cart-item-name-<id>`, `cart-item-sku-<id>`, `cart-item-unit-price-<id>`, `cart-item-stock-<id>`, `cart-item-quantity-<id>`, `cart-item-subtotal-<id>`, `increase-quantity-<id>`, `decrease-quantity-<id>`, `remove-item-<id>`

### Checkout (`/checkout`)
- `checkout-page`, `checkout-title`
- `checkout-delivery-address`, `checkout-delivery-note`
- `checkout-payment-method`, `checkout-payment-note`
- `checkout-items-list`, `checkout-empty-items-message`
- Per product: `checkout-item-<id>`, `checkout-item-quantity-<id>`, `checkout-item-subtotal-<id>`
- `checkout-order-summary`, `checkout-subtotal-label`, `checkout-subtotal`, `checkout-shipping`, `checkout-tax`, `checkout-total`
- `place-order-button`
- `checkout-error-message`, `checkout-go-to-catalog-link`
- `return-to-cart-link` (top of page), `return-to-cart-button` (below the summary)

### Order confirmation (`/order-confirmation`)
- `order-confirmation-page`, `order-confirmation-title`
- `order-confirmation-number`: Format `QA-` followed by six digits
- `order-confirmation-date`, `order-confirmation-status`, `order-confirmation-payment`
- `order-confirmation-items`, and per product `confirmed-item-<id>`
- `order-confirmation-address`
- `order-confirmation-subtotal`, `order-confirmation-shipping`, `order-confirmation-tax`, `order-confirmation-total`
- `continue-shopping-after-order-button`

### QA panel
- `qa-helper-toggle`: Opens and closes the panel
- `qa-helper-panel`: The open panel
- Per product: `qa-stock-<id>`
- `qa-user-name`, `qa-user-email`, `qa-user-password`
- `qa-copy-email-button`, `qa-copy-password-button`
- `qa-reset-state-button`: Resets cart, last order and stock (keeps the session and theme)
- `qa-logout-button`: Signs out

## Example scenarios

Three login scenarios to get started:

1. **Empty and invalid input**
   - Submit an empty form: `login-email-error` is "Email is required" and `login-password-error` is "Password is required".
   - Enter `alex@invalid` as the email: `login-email-error` is "Please enter a valid email address".

2. **Rejected credentials**
   - Unknown email: `login-error-message` is "No account found with this email".
   - Known email with the wrong password: `login-error-message` is "Incorrect password".

3. **Successful login**
   - Enter `alex.morgan@example.com` and `Test123!`.
   - You land on `/products` and `header-user-info` shows the user.

The cart, checkout and order flows are left for you to explore. Think about stock limits, price math, empty states and what should survive a reload. The app is a good fit for practicing Playwright.

## Project structure

```
src/
  assets/       images/hoodie.jpg, sweatshirt.jpg, tshirt.jpg
  components/   Navbar, ProductCard, CartItemRow, OrderSummary, QAHelperDrawer,
                ProtectedRoute, Reveal, ScrollToTop
  context/      AuthContext, CartContext, ThemeContext, ToastContext
  data/         mockUser.ts (test user, address, card), products.ts
  pages/        Login, Products, Cart, Checkout, OrderConfirmation
  types/        Shared TypeScript types
  utils/        currency.ts (cent math), validation.ts, storage.ts
```

Built with React, TypeScript, Vite, Tailwind CSS and React Router.

## Branching and deployment

The project is deployed on Vercel from GitHub. Changes reach production in two steps:

| Branch | Purpose | Vercel deployment |
|---|---|---|
| `main` | Production, always stable | Production URL |
| `staging` | Integration branch where changes are checked first | Preview deployment with its own stable URL |
| `feature/*` | One change per branch | Preview deployment for each pull request |

### Workflow

1. Branch off `staging`:
   ```bash
   git checkout staging
   git pull
   git checkout -b feature/short-description
   ```
2. Commit, push and open a pull request into `staging`.
3. Check the preview link Vercel posts on the pull request, then merge.
4. Check the `staging` deployment.
5. Open a pull request from `staging` into `main`. Merging it publishes to production.

Nothing is pushed straight to `main`.

### Setting up Vercel

1. Sign in at vercel.com with GitHub and choose **Add New, then Project**.
2. Import the repository. Vercel detects Vite and fills in the build settings (`npm run build`, output `dist`).
3. Confirm the production branch under **Settings, then Git, then Production Branch**. It should be `main`.
4. Click **Deploy**.

After that, Vercel builds every push automatically:

- Pushes to `main` become the production site.
- Pushes to any other branch, including `staging`, become preview deployments.
- Every pull request gets its own preview, and Vercel comments the link on the PR.

`vercel.json` sends all routes to `index.html`, so refreshing on a page like `/cart` works.

### Finding the staging URL

Vercel gives every branch a stable URL that always shows the latest deployment of that branch:

```
<project-name>-git-<branch-name>-<scope>.vercel.app
```

For this project the staging branch is `staging`, so look for the address starting with `qa-project-automation-git-staging-`. To find the exact link:

- Open the project in Vercel and go to **Deployments**.
- Filter by the `staging` branch, open the latest deployment and click **Visit**.
- Or click **Visit Preview** in the Vercel comment on any pull request.

If the `staging` branch does not show up in Vercel, it was probably created from `main` and has no commit of its own yet. Vercel skips commits it has already deployed, so push a new one:

```bash
git checkout staging
git commit --allow-empty -m "Trigger staging deployment"
git push
```

If a preview asks you to log in, Vercel's Deployment Protection is on. It can be changed under **Settings, then Deployment Protection**.

## License

Released under the [MIT License](LICENSE).
