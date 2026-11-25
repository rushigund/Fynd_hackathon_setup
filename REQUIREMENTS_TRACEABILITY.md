# Requirements Traceability

Statuses are evidence-based: **Verified** means an executed automated/manual case or build/report artifact supports the requirement. **Implemented; partially verified** means the source contains the behavior, but the cited mandatory test cases do not independently exercise every edge case. **Documented** means the deliverable exists and was inspected.

| ID | Requirement | Implementation | Associated test/evidence | Verification status |
| --- | --- | --- | --- | --- |
| RQ-01 | Exactly two synthetic products with fixed prices: Wireless Mouse ₹500 and Keyboard ₹1,000 | `src/cart.js` (`PRODUCTS`); `src/main.js` catalogue rendering | TC-001, TC-003; automated screenshots | Verified |
| RQ-02 | Add products; adding the same product increases its quantity without duplicate entries | `src/cart.js` (`addToCart`); `src/main.js` product click handler | Phase 3 cart-operation execution record; TC-003 quantity updates | Verified |
| RQ-03 | Remove a product; decrementing to zero removes it; quantities remain valid | `src/cart.js` (`removeFromCart`, `decreaseQuantity`); `src/main.js` cart controls | Phase 3 cart-operation execution record; TC-003 exercises decrement from 3 to 2 | Implemented; partially verified (zero-boundary/removal not in mandatory Phase 5 cases) |
| RQ-04 | Show product name, unit price, quantity, and line total | `src/main.js`; `index.html` | TC-002 and TC-003; cart screenshots | Verified |
| RQ-05 | Compute line totals and order total accurately from integer paise; empty total is ₹0 | `src/cart.js` (`calculateLineTotal`, `calculateOrderTotal`, `formatINR`) | TC-001–TC-003, TC-004; `npm run build` | Verified |
| RQ-06 | Customer name starts blank and is required with accessible label | `index.html`; `src/main.js` | TC-002; TC-004 | Verified |
| RQ-07 | Empty cart blocks checkout with a visible message and generates no reference/confirmation | `src/checkout.js` (`validateOrder`); `src/main.js` validation rendering | TC-004; `evidence/TC-004-empty-cart-validation.png` | Verified |
| RQ-08 | Blank or whitespace-only name blocks checkout with visible validation | `src/checkout.js` (`validateOrder`); `src/main.js` | TC-002 validates blank name; Phase 4 browser verification exercised whitespace-only name | Verified |
| RQ-09 | Multiple applicable validation errors are shown together | `src/checkout.js`; `src/main.js` renders both validation fields | Phase 4 browser verification of empty cart and blank name together | Verified |
| RQ-10 | Validation failure preserves customer name, cart, quantity, and totals; resolved messages clear | `src/checkout.js` (`clearResolvedValidationErrors`); `src/main.js` | TC-002 and TC-004; manual retry path | Verified |
| RQ-11 | Successful order gets a unique, non-empty order reference | `src/checkout.js` (`completeOrder`, `crypto.randomUUID`) | TC-001; TC-005 reset/new-order comparison | Verified |
| RQ-12 | One confirmation includes success text, customer name, reference, and final total | `index.html`; `src/main.js` textContent rendering | TC-001; TC-005; screenshots and Playwright report | Verified |
| RQ-13 | Duplicate submissions are prevented at state and UI levels | `src/checkout.js` state guard; `src/main.js` form guard and control freezing | TC-005 manual double-click/retry; `evidence/TC-005-single-order-confirmation.png` | Verified |
| RQ-14 | Order inputs and cart controls remain frozen until explicit reset | `src/main.js` (`freezeCheckoutControls`, event guards) | TC-005 manual execution | Verified |
| RQ-15 | Start New Order clears cart, name, validation, confirmation, and prior reference | `src/cart.js` (`clearCart`); `src/checkout.js` (`resetCheckoutState`); `src/main.js` reset handler | TC-005 manual reset and subsequent order | Verified |
| RQ-16 | Checkout state is in-memory and transitions through IDLE, SUBMITTING, COMPLETED | `src/checkout.js` (`CHECKOUT_STATUS`, transitions) | Phase 4 direct state-machine execution; TC-001, TC-005 | Verified |
| RQ-17 | TC-001 successful checkout is automated | `tests/checkout.spec.js`; `playwright.config.js` | TC-001 in latest HTML report | Verified |
| RQ-18 | TC-002 missing required field is automated | `tests/checkout.spec.js`; `playwright.config.js` | TC-002 in latest HTML report | Verified |
| RQ-19 | TC-003 exact quantity/total calculation is automated | `tests/checkout.spec.js`; `playwright.config.js` | TC-003 in latest HTML report | Verified |
| RQ-20 | TC-004 empty-cart case is manually executed and recorded | `TEST_PLAN.md`; `TEST_RESULTS.md` | Manual observations; `evidence/TC-004-empty-cart-validation.png` | Verified |
| RQ-21 | TC-005 double-click, repeat prevention, reset, and new order are manually executed and recorded | `TEST_PLAN.md`; `TEST_RESULTS.md` | Manual observations; `evidence/TC-005-single-order-confirmation.png` (no recording captured) | Verified |
| RQ-22 | Test plan covers risks, steps, expected/actual results, status, and evidence | `TEST_PLAN.md` | Document inspection | Documented |
| RQ-23 | Actual automated/manual results and limitations are reported with accurate counts | `TEST_RESULTS.md` | Latest Playwright report and recorded manual cases | Verified |
| RQ-24 | Genuine defects are documented, including correction and retest; preserve original failure evidence | `DEFECT_REPORT.md` | APP-001 favicon fix and successful headed/headless retests; initial 404 output documented. Original screenshot/trace was cleared before Phase 7 and is unavailable. | Implemented and retested; original-artifact evidence gap |
| RQ-25 | Application starts locally and production build succeeds | `package.json`; `playwright.config.js` | Phase 7 `npm run dev`, `npm run build` | Verified |
| RQ-26 | Tests are reproducible, isolated Chromium tests with HTML report and failure artifacts | `package.json`; `playwright.config.js`; `tests/checkout.spec.js` | `npm ci`; `npx playwright install chromium`; final test run and report | Verified |
| RQ-27 | Responsive, accessible UI; separated HTML/CSS/JavaScript | `index.html`; `src/styles.css`; `src/main.js` | Phase 2 mobile viewport and browser inspection; automated locators | Verified |
| RQ-28 | No backend, database, external payment integration, or persistence | Application source and dependency manifest | Source/dependency review; README limitation | Verified |
