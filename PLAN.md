# Mini Checkout and Browser Test Suite — Implementation Plan

Act as a senior frontend developer and software QA engineer. Build the application from scratch in the current repository. Inspect existing files first and preserve unrelated work. Follow the three sections and implementation phases below. Implement working source code, run available checks, and document actual results. Do not stop at scaffolding or pseudocode.

## 1. WHAT TO BUILD

### Technology stack

- HTML5, CSS3, Vanilla JavaScript.
- Vite for local development and production builds.
- Playwright with Chromium for end-to-end browser testing.
- npm for dependency management; Markdown for documentation.
- Keep the application modular, lightweight, accessible, and responsive.

### Checkout functionality

Use exactly two synthetic products with fixed prices:

| Product | Unit price |
| --- | ---: |
| Wireless Mouse | ₹500 |
| Keyboard | ₹1,000 |

- Start with an empty cart and blank customer name.
- Display product names, prices, and Add to Cart controls.
- Support adding and removing products and increasing/decreasing quantities. Repeated additions increase the existing quantity. Decreasing to zero removes the item. Never allow negative or invalid quantities.
- Show quantity, unit price, line total, and order total. An empty cart totals ₹0.
- Recalculate all totals immediately after every cart change. Store monetary amounts as integer paise and format consistently in INR.
- Provide one required field: customer name, with an accessible label.
- Provide a Place Order button and a visible confirmation containing a unique, non-empty order reference on success.
- Provide a Start New Order button after success to explicitly reset the checkout.

### Validation and duplicate-order prevention

- Block checkout for an empty cart or a blank/whitespace-only customer name.
- Show clear, visible validation messages (e.g., “Your cart is empty.” and “Customer name is required.”). Associate field errors with the input and announce relevant status messages accessibly.
- Preserve entered customer information and cart contents on validation failure. Clear stale errors as appropriate.
- Route order placement through one form submission handler. Use an explicit synchronous order-state guard before generating the reference or confirmation; disable Place Order after success.
- Rapid double-clicks, repeated clicks, or repeated form submissions must not create another order reference or confirmation.
- Freeze order inputs and cart controls after success so the confirmation represents the submitted order; reset them only through Start New Order or a fresh page load.
- Keep state in memory. No persistence is required.

### Mandatory automated browser tests

Implement the following three independent Playwright tests in `tests/checkout.spec.js`.

**TC-001 — Successful checkout (P0)**

1. Open a clean checkout page.
2. Add one Wireless Mouse and one Keyboard.
3. Enter a valid customer name.
4. Assert the visible order total is exactly ₹1,500.
5. Submit the order.
6. Assert that exactly one success confirmation is visible and that it contains a non-empty order reference.

**TC-002 — Missing required field (P0)**

1. Open a clean checkout page.
2. Add one Wireless Mouse; leave the name blank.
3. Click Place Order.
4. Assert the visible required-field validation message.
5. Assert no success confirmation or order reference exists.
6. Assert that the cart still contains one Wireless Mouse and the total remains ₹500.

**TC-003 — Quantity change and exact total (P0)**

1. Open a clean checkout page.
2. Add one Wireless Mouse and one Keyboard.
3. Assert the initial visible total is exactly ₹1,500.
4. Increase the mouse quantity to three; assert its quantity is 3, its line total is ₹1,500, and the order total is exactly ₹2,500.
5. Decrease the mouse quantity to two; assert its line total is ₹1,000 and the order total is exactly ₹2,000.

Use exact visible text assertions scoped to the correct total/line-total element, rather than substring matches that could accidentally pass.

### Browser testing standards

- Start every test in a fresh, isolated browser context and navigate to the application using a configured base URL.
- Prefer `getByRole`, `getByLabel`, and other accessible, stable locators; use test IDs only where necessary.
- Use Playwright's web-first assertions and automatic waiting. Never use fixed sleeps or test-order dependencies.
- Configure `webServer` to launch Vite automatically on a consistent port. Configure Chromium as the browser project.
- Generate an HTML report and retain screenshots and traces for failures. Attach genuine screenshots of relevant successful/validation/total states when useful for submission evidence.
- Execute the tests and investigate failures. Do not weaken assertions to force passing results.

### Risk-based manual test plan

Create `TEST_PLAN.md` with objectives, scope, environment, risk priorities, test IDs, preconditions, data, steps, expected results, actual results, status, and evidence references. Include all three automated cases and the two mandatory manual cases below.

| Risk | Priority |
| --- | --- |
| Incorrect order total | P0 |
| Duplicate order placement | P0 |
| Checkout with empty cart | P0 |
| Checkout with missing required information | P0 |
| Loss of entered customer data after validation failure | P1 |
| Incorrect quantity or item removal behaviour | P1 |

**TC-004 — Empty cart checkout (manual, P0)**

1. Open a fresh page without adding products.
2. Enter a valid customer name.
3. Click Place Order.
4. Verify the empty-cart validation message is visible, the order total remains ₹0, no confirmation is generated, and the entered name is preserved.
5. Record actual observations and capture evidence.

**TC-005 — Rapid double-click checkout (manual, P0)**

1. Open a fresh page, add a product, and enter a valid name.
2. Rapidly double-click Place Order.
3. Verify only one confirmation and one order reference appear.
4. Attempt to submit again and verify the reference remains unchanged and further submission is prevented.
5. Record actual observations and capture evidence; a screen recording can supplement screenshots for the double-click behaviour.

If interactive manual browser access is unavailable, mark these cases Not Executed and provide exact instructions for the human tester. Automated checks may supplement but must not be represented as manual execution.

### Test results and defect reporting

Create `TEST_RESULTS.md` with actual execution date, environment/browser, commands executed, per-test expected and actual results, Pass/Fail/Blocked/Not Executed status, summary counts, evidence/report paths, and known limitations. Keep statuses consistent with `TEST_PLAN.md`.

Create `DEFECT_REPORT.md`. For each genuine defect found during testing, document the ID, title, severity/priority, environment, preconditions, reproduction steps, expected versus actual results, evidence, current status, and retest results if fixed. Retain genuine findings even after fixing them.

Never fabricate test results, screenshots, defects, or evidence. If tests were executed and no defects were found, state “No defects observed within the executed test scope.” If checks could not be executed, report that limitation instead of claiming success.

### Project structure

```text
mini-checkout/
├── index.html
├── src/
│   ├── main.js
│   ├── cart.js
│   ├── checkout.js
│   └── styles.css
├── tests/
│   └── checkout.spec.js
├── evidence/
├── playwright.config.js
├── package.json
├── package-lock.json
├── .gitignore
├── README.md
├── TEST_PLAN.md
├── TEST_RESULTS.md
├── DEFECT_REPORT.md
└── PLAN.md
```

Keep cart calculations, checkout validation/state, and UI rendering logically separated. Use the current repository root; do not create an unnecessary nested project directory. Ignore generated dependencies, build outputs, and temporary test artifacts in Git. Preserve selected genuine submission evidence under `evidence/` and document how to regenerate the full reports.

### Implementation phases

1. **Project initialization:** Set up Vite, npm, Playwright, scripts, and project structure. Verify dependencies install.
2. **Checkout UI:** Implement product catalogue, cart, quantity controls, totals, name input, and accessible responsive styling.
3. **Business logic:** Implement cart state, add/remove/quantity changes, and exact price calculations. Verify totals.
4. **Validation and order placement:** Implement validation, data preservation, success reference, duplicate-submission guard, and explicit reset.
5. **Browser automation:** Implement TC-001 through TC-003, run tests, investigate real failures, and generate reports/evidence.
6. **Manual testing and defects:** Execute TC-004 and TC-005 if interactive browser access is available; otherwise mark them Not Executed. Record genuine observations, defects, and retests.
7. **Documentation and final verification:** Complete README and test documents; run the production build and automated tests again where possible. Report real completion status.

### README and reproducibility

Document project overview, stack, structure, prerequisites (including supported Node.js version), installation, application startup, browser setup, automated tests, report viewing, manual tests, evidence, and limitations. Provide these commands and configure the corresponding npm scripts:

```sh
npm install
npm run dev
npm run build
npx playwright install chromium
npm run test:e2e
npx playwright show-report
```

Use `npm ci` as the reproducible installation option when the lockfile exists. Document any platform-specific prerequisites if encountered. Verify commands where possible and report any blockers truthfully.

## 2. WHAT NOT TO BUILD

- No backend application server, REST API, database, or persistent browser storage.
- No authentication, registration, admin dashboard, or additional pages/routing.
- No payment gateway, real payment processing, shipping, tax, discount, or coupon system.
- No external APIs, services, or runtime third-party dependencies.
- No complex frontend frameworks, state-management libraries, or unnecessary dependencies.
- No elaborate animations or excessive visual styling.
- No arbitrary waits, brittle locators, tests without meaningful assertions, or changes that weaken tests merely to make them pass.
- No fabricated defects, execution results, screenshots, or evidence. Never mark an unexecuted manual or automated test as passed.
- Do not expand beyond the hackathon requirements.

## 3. WHY WE ARE BUILDING THIS

The hackathon evaluates the reliability of a small checkout experience and the quality of its browser testing. The solution must demonstrate accurate business logic, customer-friendly validation, state preservation, duplicate-order prevention, isolated and deterministic automated tests, risk-based manual testing, truthful evidence, and reproducible documentation.

Prioritize correctness, test quality, reliability, and reproducibility over UI complexity.

### Definition of Done

- All mandatory checkout features work, including exact totals, input validation, data preservation, and duplicate-submission prevention.
- The application starts locally and the production build succeeds.
- All three mandatory Playwright tests pass based on actual execution.
- Both mandatory manual checks have been genuinely executed and their results recorded for final hackathon submission. If the agent cannot perform them, explicitly report that human verification remains pending.
- README, TEST_PLAN.md, TEST_RESULTS.md, DEFECT_REPORT.md, and available genuine evidence are complete and consistent.
- Another developer can reproduce the application and tests using the README.

### Execution instructions for GitHub Copilot

Implement phases sequentially. Verify each phase using available tools before proceeding. Install dependencies, write actual code, run the build and browser tests, resolve genuine failures, and complete documentation. If any command or browser operation is unavailable, record the exact blocker, continue with independent work, and provide instructions for remaining checks. Do not claim the project is submission-ready while required checks remain unverified.

At completion, provide a concise summary of implemented features, files created, commands executed, actual build/test results, genuine defects and fixes, evidence locations, pending manual checks, and submission readiness.
