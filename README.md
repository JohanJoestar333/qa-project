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
| Catalog | Stock shown per product, "in cart" count, sold-out and max-limit states, color swatches that change the photo |
| Product page | Opens from the catalog, color selection (swatches, thumbnails, size buttons, arrow keys and `?color=` and `?size=`), quantity selector, expandable sections, sticky buy bar after scrolling, unknown product ID |
| Sizes | S, M and L are chosen on the product page only, there is no default, and adding without a size shows an error |
| Colors, sizes and stock | The same product in another color or size is a separate cart line, but all of them draw from one shared stock |
| Cart | Add, increase, decrease, remove, empty cart, quantity capped at stock, live header count, emptying the cart asks for confirmation first |
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
| ID | Name | Price | Colors (ID) |
|---|---|---|---|
| `PC-001` | CloudSoft Everyday Hoodie | $39.99 | Navy (`navy`), Oatmeal (`oatmeal`), Black (`black`) |
| `PC-002` | CloudSoft Classic Sweatshirt | $34.99 | Cream (`cream`), Heather Grey (`grey`), Black (`black`) |
| `PC-003` | CloudSoft Essential T-Shirt | $19.99 | Black (`black`), Heather Grey (`grey`), Olive (`olive`) |

The first color in each row is the default.

### Colors, sizes and stock
- Every product has one shared stock of 50, whatever the color or size. Adding 30 navy and 20 black hoodies, in any sizes, uses all 50.
- Every product comes in sizes S (`s`), M (`m`) and L (`l`). A size is chosen on the product page only; the catalog has no quick add.
- There is no default size. Pressing Add to Cart without one shows "Please select a size."
- A cart line is one product in one color and one size. Its ID is `<product id>-<color id>-<size id>`, for example `PC-001-navy-m`. The same product in a different color or size is a different line.
- A product page can be opened directly with a color and size: `/products/PC-001?color=black&size=m`. The choices are kept in the URL, so they survive a reload. An unknown color falls back to the default, an unknown size means none is selected, and an unknown product shows a "Product not found" page.

### Pricing rules
- Shipping is always $0.00.
- Tax is 10% of the subtotal, rounded to the nearest cent.
- Total = subtotal + shipping + tax, all in integer cents.

## Resetting state

Cart, session, stock, last order and theme are stored in `localStorage`. **Reset Demo & Stock** in the QA panel clears the cart, last order and stock, and keeps you signed in. Use **Sign Out** in the profile menu (click your name in the header) or in the QA panel to end the session.

## `data-testid` reference

Names follow `<area>-<element>`. Elements that exist once per product end with the product ID, for example `product-price-PC-001`. Elements that exist once per cart line end with the line ID (product ID, color ID and size ID), for example `cart-item-PC-001-navy-m`. Items marked "per product" exist for `PC-001`, `PC-002` and `PC-003`. Items marked "per line" exist for every product, color and size combination.

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
- Per product: `product-card-<id>`, `product-image-<id>`, `product-name-<id>`, `product-description-<id>`, `product-price-<id>`, `product-stock-<id>`, `product-in-cart-<id>`, `product-tag-<id>`, `product-sold-out-<id>`, `product-link-<id>` (photo link), `select-options-<id>` (opens the product page, or shows a disabled "Out of Stock" button)
- Per product and color: `card-color-<id>-<colorId>`, for example `card-color-PC-001-navy`. Selecting one changes the card photo, and Select Options then opens the product page in that color.

### Product page (`/products/:productId`)
- `product-page`, `product-back-link`
- `product-page-image`: Shows the selected color
- `product-page-name`, `product-page-price`, `product-page-description`, `product-page-tag`
- `product-thumbnails`, and per color `product-thumb-<colorId>`: Photo buttons under the main image
- `product-selected-color`: Name of the selected color
- `product-selected-size`: Selected size, or "None selected"
- Per size: `product-size-<sizeId>`, for example `product-size-m`
- `product-size-error`: "Please select a size."
- Per color: `product-color-<colorId>`, for example `product-color-navy`
- `product-page-stock`, `product-page-in-cart`
- `product-quantity-decrease`, `product-quantity-value`, `product-quantity-increase`
- `product-page-add-to-cart`
- `product-sticky-bar`, `product-sticky-add-to-cart`: Slim bar that appears under the header once the main button has scrolled out of view
- `product-about`, `product-about-text`: Longer description
- `product-accordion-<section>`, `product-accordion-panel-<section>`: Expandable sections, where `<section>` is `details`, `care` or `shipping`. Details is open by default.
- `product-details-list`, `product-care-text`, `product-shipping-text`
- `related-products`: The other products shown below
- `product-not-found`, `product-not-found-link`: Shown for an unknown product ID

### Cart (`/cart`)
- `cart-page`, `cart-title`, `cart-subtitle`, `cart-items-list`
- `cart-clear-button`: Opens the "Empty your cart?" confirmation
- `empty-cart-dialog`: The confirmation dialog, with `empty-cart-dialog-title` and `empty-cart-dialog-message` (shows how many items will be removed)
- `empty-cart-dialog-confirm-button`: "Remove All" empties the cart and shows a "Cart emptied" toast
- `empty-cart-dialog-cancel-button`: Closes the dialog and keeps the cart. Escape and a click on `empty-cart-dialog-backdrop` do the same.
- `cart-subtotal`
- `cart-empty-state`, `cart-empty-message`
- `continue-shopping-button`: Returns to `/products`
- `proceed-to-checkout-button`
- Per line: `cart-item-<line>`, `cart-item-image-<line>`, `cart-item-name-<line>`, `cart-item-color-<line>`, `cart-item-size-<line>`, `cart-item-sku-<line>`, `cart-item-unit-price-<line>`, `cart-item-stock-<line>`, `cart-item-quantity-<line>`, `cart-item-subtotal-<line>`, `increase-quantity-<line>`, `decrease-quantity-<line>`, `remove-item-<line>`

### Checkout (`/checkout`)
- `checkout-page`, `checkout-title`
- `checkout-delivery-address`, `checkout-delivery-note`
- `checkout-payment-method`, `checkout-payment-note`
- `checkout-items-list`, `checkout-empty-items-message`
- Per line: `checkout-item-<line>`, `checkout-item-color-<line>`, `checkout-item-size-<line>`, `checkout-item-quantity-<line>`, `checkout-item-subtotal-<line>`
- `checkout-order-summary`, `checkout-subtotal-label`, `checkout-subtotal`, `checkout-shipping`, `checkout-tax`, `checkout-total`
- `place-order-button`
- `checkout-error-message`, `checkout-go-to-catalog-link`
- `return-to-cart-link` (top of page), `return-to-cart-button` (below the summary)

### Order confirmation (`/order-confirmation`)
- `order-confirmation-page`, `order-confirmation-title`
- `order-confirmation-number`: Format `QA-` followed by six digits
- `order-confirmation-date`, `order-confirmation-status`, `order-confirmation-payment`
- `order-confirmation-items`, and per line `confirmed-item-<line>`, `confirmed-item-color-<line>`, `confirmed-item-size-<line>`
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
  assets/       images/ (one photo per product and color, e.g. hoodie-navy.jpg)
  components/   Navbar, ProductCard, CartItemRow, OrderSummary, QAHelperDrawer,
                ProtectedRoute, Reveal, ScrollToTop, ColorSwatches, SizeSelector, Accordion, ConfirmDialog
  context/      AuthContext, CartContext, ThemeContext, ToastContext
  hooks/        useRadioGroupKeys (arrow-key navigation for swatches and sizes)
  data/         mockUser.ts (test user, address, card), products.ts
  pages/        Login, Products, Product, Cart, Checkout, OrderConfirmation
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

### Linking work to Jira

When a change has a Jira ticket, put the issue key (for example `QA-123`) at the start of the branch name, in the commit messages and in the pull request title. With the GitHub for Jira app connected, the branch, commits and pull request then show up on the ticket.

```bash
git checkout -b QA-123-short-description
git commit -m "QA-123 Short description"
```

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
