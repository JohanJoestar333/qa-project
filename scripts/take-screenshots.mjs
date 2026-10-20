// Takes the screenshots used in the README.
//
// Usage: build the app, start `npm run preview -- --port 4173`, then run
//   node scripts/take-screenshots.mjs
// The GitHub Actions workflow "README screenshots" does all of this and commits
// the images to docs/screenshots/.

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4173';
const OUT_DIR = 'docs/screenshots';
const USER = { email: 'alex.morgan@example.com', password: 'Test123!' };

await mkdir(OUT_DIR, { recursive: true });

// Wait until the preview server answers.
for (let attempt = 0; ; attempt++) {
  try {
    if ((await fetch(BASE_URL)).ok) break;
  } catch {
    // not up yet
  }
  if (attempt === 60) throw new Error(`${BASE_URL} did not start`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

const browser = await chromium.launch();

// Scroll through the page so every "reveal on scroll" section becomes visible.
async function revealAll(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
}

// Hides the floating QA panel bar so it doesn't cover the page in screenshots.
async function setQaPanelVisible(page, visible) {
  await page.evaluate((show) => {
    let el = document.querySelector('[data-testid="qa-helper-toggle"]');
    while (el && getComputedStyle(el).position !== 'fixed') el = el.parentElement;
    if (el) el.style.visibility = show ? '' : 'hidden';
  }, visible);
}

async function shot(page, name, { fullPage = false, showQaPanel = false } = {}) {
  if (fullPage) await revealAll(page);
  else await page.evaluate(() => window.scrollTo(0, 0));
  await setQaPanelVisible(page, showQaPanel);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT_DIR}/${name}.png`, fullPage });
  await setQaPanelVisible(page, true);
  console.log(`saved ${name}.png`);
}

async function addToCart(page, path) {
  await page.goto(`${BASE_URL}${path}`);
  await page.getByTestId('product-page-add-to-cart').click();
  await page.getByTestId('toast').waitFor();
}

// Desktop
const desktop = await browser.newContext({
  viewport: { width: 1280, height: 860 },
  colorScheme: 'light',
  reducedMotion: 'reduce',
});
const page = await desktop.newPage();
const byId = (testId) => page.getByTestId(testId);

// Login with a wrong password, then the real one
await page.goto(`${BASE_URL}/login`);
await byId('login-email-input').fill(USER.email);
await byId('login-password-input').fill('Wrong123!');
await byId('login-submit-button').click();
await byId('login-error-message').waitFor();
await shot(page, 'login-error');

await byId('login-password-input').fill(USER.password);
await byId('login-submit-button').click();
await page.waitForURL('**/products');
await shot(page, 'catalog', { fullPage: true });

// Product page: Add to Cart without a size, then with one
await page.goto(`${BASE_URL}/products/PC-001?color=black`);
await byId('product-page-add-to-cart').click();
await byId('product-size-error').waitFor();
await shot(page, 'product-size-error');

await byId('product-size-l').click();
await byId('product-quantity-increase').click();
await byId('product-page-add-to-cart').click();
await byId('toast').waitFor();
await shot(page, 'product-page');

// Fill the cart
await addToCart(page, '/products/PC-001?color=navy&size=m');
await addToCart(page, '/products/PC-003?color=olive&size=s');

await page.goto(`${BASE_URL}/cart`);
await byId('cart-items-list').waitFor();
await shot(page, 'cart', { fullPage: true });

// Empty Cart asks for confirmation; Cancel keeps the cart
await byId('cart-clear-button').click();
await byId('empty-cart-dialog').waitFor();
await shot(page, 'empty-cart-dialog');
await byId('empty-cart-dialog-cancel-button').click();

await byId('proceed-to-checkout-button').click();
await page.waitForURL('**/checkout');
await shot(page, 'checkout', { fullPage: true });

await byId('place-order-button').click();
await page.waitForURL('**/order-confirmation');
await byId('order-confirmation-number').waitFor();
await shot(page, 'order-confirmation', { fullPage: true });

// QA panel
await page.goto(`${BASE_URL}/products`);
await byId('qa-helper-toggle').click();
await byId('qa-helper-panel').waitFor();
await shot(page, 'qa-panel', { showQaPanel: true });
await byId('qa-helper-toggle').click();

// Dark mode, then back to light so the mobile shots start in light mode
await byId('theme-toggle').click();
await shot(page, 'catalog-dark');
await byId('theme-toggle').click();

const signedIn = await desktop.storageState();
await desktop.close();

// Phone
const phone = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  colorScheme: 'light',
  reducedMotion: 'reduce',
  storageState: signedIn,
});
const mobile = await phone.newPage();
await mobile.goto(`${BASE_URL}/products/PC-002?color=grey&size=m`);
await mobile.getByTestId('product-page-name').waitFor();
await shot(mobile, 'mobile-product');
await phone.close();

await browser.close();
