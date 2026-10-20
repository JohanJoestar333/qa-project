# PixelCart

PixelCart is a small clothing store I built so I could practice and show the work a QA engineer does inside a company. The store itself is simple. What I wanted to show is everything around it: stories in Jira, test cases in Confluence, pull requests and code review in GitHub, separate preview, staging and production environments, and the path a change takes from an idea to production.

- Production: https://qa-project-automation.vercel.app
- Staging: https://qa-project-automation-staging.vercel.app
- Jira project: `PIXEL` (Scrum board, two-week sprints)
- Confluence space: `PIXEL` (feature specs, test data and test cases)

![Product page with a color and size chosen and the "Added to cart" message](docs/screenshots/product-page.png)

## The app

You sign in, pick a hoodie, sweatshirt or T-shirt, choose a color and a size, build a cart and check out. There's no backend. Everything is stored in the browser, there's one test user and three products, and prices and stock always start from the same values. I made it this way on purpose so every test can be repeated and later automated.

It has more rules than it looks like:

- You can't add anything without choosing a size.
- Every color and size of a product shares one stock of 50, so 30 navy hoodies and 20 black ones use up all the stock.
- Prices are calculated in cents with 10% tax and free shipping.
- Store pages are blocked when you're signed out, and you go back to the page you asked for after signing in.
- An order can only be placed once, even if you double-click or press Back.
- Emptying the cart asks for confirmation first.

There's also a QA panel in the corner with the test login, live stock and a button that resets everything.

![Cart with three lines in different colors and sizes](docs/screenshots/cart.png)

## How a change moves through the team

I treat every change the way it would be handled at a company. Here's what happened with one real story, **PIXEL-64: Confirm before emptying the cart**:

1. **The story.** I wrote it in Jira as a user story with acceptance criteria in Given / When / Then: the dialog text, what Cancel and Escape do, what Remove All does, and keyboard behavior. It got a priority, story points and a test priority label.
2. **Test cases before the code.** I updated TC-CART-010 and added five new cases (TC-CART-023 to 027) in Confluence: Cancel, Escape, clicking outside, the "1 item / 3 items" message and keyboard use.
3. **Branch and pull request.** The work was done on `feature/PIXEL-64-confirm-empty-cart`, branched from `staging`. The PR title starts with the Jira key, so the branch, commits and PR show up on the story in Jira.
4. **Review and preview.** Vercel builds a preview for the PR and posts the link. A workflow adds the same link to the Jira story, so I can open the right build straight from the ticket. The story moves to Code Review, then Ready To Test.
5. **Testing.** I run the test cases on the preview. Anything that fails becomes a bug in Jira with the test case ID in the title, steps, expected and actual results, and a screenshot.
6. **Staging.** After it passes, the PR is merged into `staging` and the story moves to Test in Staging. This is where the full regression runs, because other changes are in there too.
7. **Release.** When staging is clean, `staging` is merged into `main`, which is production, and the story is Done.

The Jira statuses follow that path:

`To Do` → `In Development` → `Code Review` → `Ready To Test` → `Ready for Staging` → `Test in Staging` → `Ready for production` → `Done`

GitHub labels mirror it on the pull requests: `developing`, `ready for code review`, `code review passed`, `ready for testing`, `test passed`, `merge to staging`, `merge to main`, `done`.

## Jira

![Sprint 2 board in Jira, with stories in Test in Staging and test priority labels](docs/screenshots/jira-board.png)

*The Sprint 2 board. Each card shows its area label, its test priority and the epic it belongs to.*

The work is split into five epics: Login & Session, Product Catalog, Shopping Cart, Checkout and Order Confirmation.

- **Sprint 1** covered everything the first version of the store already did.
- **Sprint 2** (Oct 16 to 30) adds the product page with colors and sizes, the test cases for every live feature and the start of the Playwright automation.

Each story has `[DEV]` and `[DOCS]` subtasks. Writing its test cases is a separate `[Testing]` task, linked to the story, because it's real work that's planned and estimated on its own and usually starts before the code is done. Running the tests isn't a separate item: it happens when the story moves to Ready To Test and Test in Staging. Other tasks cover bigger testing, documentation and automation work, like running the full regression or setting up Playwright.

Every story has a **test priority label** from `test-priority-1-critical` to `test-priority-4-low`, so whoever is testing knows where to start. Sign-in, adding to the cart, prices and placing an order are always critical.

![Sprint 2 backlog with PIXEL-11 open, showing the user story and acceptance criteria](docs/screenshots/jira-story.png)

*The Sprint 2 backlog with PIXEL-11 open: the user story and its acceptance criteria, written as Given / When / Then.*

## Confluence

Confluence holds how the app is supposed to behave and how it's tested:

- **Project Overview, Environments & Release Flow, Test Data & State.** What the app is, the environments and branch rules, the test user, products, prices and worked examples.
- **Feature pages** for Login, Catalog, Cart, Checkout and Order Confirmation. Each one has numbered business rules (like "CA2: stock is shared by every color and size"), the exact messages, planned changes and the `data-testid` for every element.
- **Test Documentation.** A guide to how test cases are written, one page of test cases per module and the regression scenario.

![Login & Session test cases in Confluence, with the page tree on the left](docs/screenshots/confluence-test-cases.png)

*Login & Session test cases. The page tree on the left shows how the space is organized.*

## Test cases

There are 127 manual test cases: 93 positive and 34 negative.

| Module | Tests |
|---|---|
| Login & Session | 22 |
| Header, Theme & QA Panel | 12 |
| Product Catalog | 11 |
| Product Page | 24 |
| Shopping Cart | 27 |
| Checkout | 10 |
| Order Confirmation | 11 |
| Cross-Browser & Responsive | 10 |

Each test has an ID, a short description with the story and rule it covers, the steps in Given / When / Then, a severity, the exact expected result and the type of test. Here's one:

> **TC-CART-012: Price math with two hoodies** (Critical)
> **Given** the cart has a Navy M hoodie and a Black L hoodie
> **When** I open the cart
> **Then** I see Subtotal (2 items) $79.98, Shipping $0.00, Estimated Tax (10%) $8.00, Total $87.98

The negative tests cover what users actually get wrong: empty fields, fake and badly formatted emails, the wrong password, quantities past the stock limit, unknown product links, double clicks, the Back button and two tabs buying the same stock.

There's also one end-to-end regression test, **TC-REG-001**. In 22 steps it goes from being blocked while signed out, through two failed logins, to a full purchase and a check that the stock went down. That's the first test I'm automating, and it will run on every push.

## Branches and environments

| Branch | What it's for | Where it runs |
|---|---|---|
| `feature/PIXEL-xx-...` | One story, branched from `staging` | Its own Vercel preview |
| `staging` | Everything waiting for release, tested together | Staging |
| `main` | Production. Nothing is pushed here directly. | Production |

## Automation so far

- **Vercel preview links in Jira.** A GitHub Action watches for successful preview deployments, reads the `PIXEL-xx` keys from the branch and PR title, and adds the preview link to each story.
- **README screenshots.** A GitHub Action builds the app and takes the screenshots above with Playwright, so they always match the real build.

Next up are the Playwright tests themselves, starting with TC-REG-001, running on GitHub Actions against every preview and required to pass before anything is merged.

## Things I found

- **Two tabs can oversell (TC-CHK-010).** Stock lives in each tab's browser storage and tabs don't sync, so two tabs can both buy the last 50 hoodies. I expect this test to fail.
- **No thousands separator.** $1,999.50 is shown as $1999.50.
- **Black swatch in dark mode.** The black color option is nearly invisible against the dark background.

## Running it locally

You need Node.js 20 or later.

```bash
npm install
npm run dev       # http://localhost:3000
npm run build
npm run lint      # type-check
```

Sign in with `alex.morgan@example.com` / `Test123!`. The QA panel at the bottom right has the same login with copy buttons, plus **Reset Demo & Stock** to start over.

Products: CloudSoft Everyday Hoodie ($39.99), Classic Sweatshirt ($34.99) and Essential T-Shirt ($19.99), each with three colors, sizes S, M and L, and 50 in stock. You can open a product with a color and size already chosen, like `/products/PC-001?color=black&size=m`.

Every element you'd want to check in a test has a `data-testid`, named `<area>-<element>` (for example `product-size-m`, `cart-item-PC-001-navy-m`, `place-order-button`). The full list for each page is on its Confluence feature page.

## Built with

React, TypeScript, Vite, Tailwind CSS and React Router, deployed on Vercel.

## License

[MIT](LICENSE)
