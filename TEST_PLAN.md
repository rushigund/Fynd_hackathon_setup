# Risk-Based Checkout Test Plan

## Objectives

Verify checkout totals, validation, customer-data preservation, duplicate-order prevention, and explicit reset behavior using the automated suite and the two required manual scenarios.

## Scope

In scope: the single-page checkout, in-memory cart, validation, order confirmation, duplicate-submit guard, and Start New Order reset.

Out of scope: backend/API behavior, persistence, real payments, and the optional exploratory scenarios listed in `PLAN.md`.

## Environment

| Environment | Details |
| --- | --- |
| Manual execution date | 2026-11-24 |
| Final regression date | 2026-11-25 |
| Operating system | Windows |
| Application | Mini Checkout 1.0.0; repository HEAD `488e4d9` (working tree changes are uncommitted) |
| Application URL | `http://127.0.0.1:4173` |
| Runtime | Node.js 22.17.1, npm 10.9.2, Vite 7.3.8 |
| Automated browser | Playwright Chromium 159.0.8154.6 |
| Manual browser | VS Code integrated browser, Chrome 150.0.7871.250 / Electron 43.8.9 |

## Testing strategy

- Run TC-001 through TC-003 with Playwright in isolated Chromium contexts. Use accessible locators and exact, web-first assertions; inspect the HTML report and retained screenshot attachments.
- Execute TC-004 and TC-005 through direct interactive browser actions. Record actual observations separately from automated results.
- Save genuine screenshots in `evidence/`. TC-005’s screenshot records the resulting confirmation only; the manual double-click and repeat-click observations are documented separately and are not represented as a screen recording.
- No application behavior changes were made during Phase 6. Phase 7 removed the empty legacy Python placeholder and updated documentation/ignore rules. The latest Playwright suite was inspected through `playwright-report/index.html`; the 2026-11-25 final runs reported three passes, zero failures, and zero skips.

## Risk assessment

| Risk | Priority |
| --- | --- |
| Incorrect order total | P0 |
| Duplicate order placement | P0 |
| Empty-cart checkout | P0 |
| Missing required customer information | P0 |
| Loss of customer input | P1 |
| Incorrect product quantity or removal | P1 |
| Incorrect checkout reset | P1 |

## Test cases

### TC-001 — Successful Checkout

- **Type / priority:** Automated / P0
- **Objective:** Verify a valid order is placed once with correct confirmation details.
- **Preconditions:** Fresh Playwright browser context.
- **Test data:** One Wireless Mouse, one Keyboard, customer name `Test Customer`.
- **Steps:** Navigate to checkout; add both products; enter the name; verify ₹1,500; submit; inspect confirmation, reference, total, and button state.
- **Expected:** One visible confirmation with success text, correct name, UUID reference, and ₹1,500 total; Place Order is disabled.
- **Actual:** All assertions passed in the final Playwright run.
- **Status:** PASS
- **Evidence:** `evidence/TC-001-successful-checkout.png`; attached to `playwright-report/index.html`.

### TC-002 — Missing Required Field

- **Type / priority:** Automated / P0
- **Objective:** Ensure checkout is blocked without a customer name and that cart contents remain intact.
- **Preconditions:** Fresh Playwright browser context.
- **Test data:** One Wireless Mouse; blank customer name.
- **Steps:** Navigate to checkout; add the mouse; verify ₹500; submit; inspect error, confirmation/reference, cart quantity/total, and retry button.
- **Expected:** “Please enter your name.” is visible; no confirmation/reference exists; quantity remains one, total remains ₹500, and Place Order stays enabled.
- **Actual:** All assertions passed in the final Playwright run.
- **Status:** PASS
- **Evidence:** `evidence/TC-002-required-field-validation.png`; attached to `playwright-report/index.html`.

### TC-003 — Quantity Change and Exact Total

- **Type / priority:** Automated / P0
- **Objective:** Verify quantity changes update line totals and order totals accurately.
- **Preconditions:** Fresh Playwright browser context.
- **Test data:** One Wireless Mouse and one Keyboard.
- **Steps:** Add both products; verify initial ₹1,500; increase mouse quantity to two and three; decrease to two; check each line/order total and keyboard quantity.
- **Expected:** Totals are exactly ₹1,500, ₹2,000, ₹2,500, then ₹2,000; keyboard quantity remains one.
- **Actual:** All assertions passed in the final Playwright run.
- **Status:** PASS
- **Evidence:** `evidence/TC-003-exact-total-calculation.png`; attached to `playwright-report/index.html`.

### TC-004 — Empty Cart Checkout

- **Type / priority:** Manual functional / P0
- **Objective:** Verify an empty-cart order is blocked and can be corrected without losing customer input.
- **Preconditions:** Application running; fresh page; empty cart.
- **Test data:** `Test Customer`; one Wireless Mouse for the retry.
- **Steps:**
  1. Open checkout and verify the empty cart and ₹0 total.
  2. Enter `Test Customer` and click Place Order.
  3. Verify the empty-cart message, no confirmation/reference, unchanged name, and ₹0 total.
  4. Capture blocked-state evidence.
  5. Add one Wireless Mouse; verify the name remains and total becomes ₹500.
  6. Retry Place Order and inspect the successful confirmation.
- **Expected:** Empty-cart submission is blocked with “Your cart is empty. Please add at least one product.”; no reference or confirmation appears; the name is preserved; after adding a product, checkout succeeds.
- **Actual:** The empty-cart message appeared, total remained ₹0, and no confirmation/reference appeared. `Test Customer` remained entered. After adding a mouse, the error cleared, total became ₹500, and retry succeeded with a ₹500 confirmation.
- **Status:** PASS
- **Evidence:** `evidence/TC-004-empty-cart-validation.png` (blocked state).

### TC-005 — Rapid Double-Click Checkout

- **Type / priority:** Manual functional and duplicate-submission / P0
- **Objective:** Verify rapid and subsequent submissions cannot create duplicate orders, and reset permits a new order.
- **Preconditions:** Application running; fresh page; no prior confirmation.
- **Test data:** One Wireless Mouse, one Keyboard, `Test Customer`; after reset, one Keyboard.
- **Steps:**
  1. Add the mouse and keyboard; enter the customer name; verify ₹1,500.
  2. Double-click Place Order rapidly; inspect confirmation and record its reference.
  3. Attempt another Place Order click; inspect whether the original confirmation/reference/total changes.
  4. Click Start New Order; verify cart, name, confirmation, and total reset.
  5. Place a new valid order and compare its reference with the original.
- **Expected:** Exactly one confirmation/reference remains after the double-click and repeat attempt; the submitted order stays at ₹1,500; reset clears checkout; a later valid order receives a different reference.
- **Actual:** The double-click produced one confirmation and reference `33897215-9fab-430a-bf62-23cd962f1669` with total ₹1,500. Place Order was disabled; a subsequent click attempt could not activate it. The displayed reference and total remained unchanged. Reset restored an empty cart, blank name, hidden confirmation, and ₹0 total. A new keyboard order succeeded with a different reference (`f47c31fc-3d89-4d0e-9624-58f387da5496`) and total ₹1,000.
- **Status:** PASS
- **Evidence:** `evidence/TC-005-single-order-confirmation.png` (post-double-click state). This static image documents the result; the double-click and blocked repeat-click were performed interactively and are recorded in the actual result above. No video recording was captured.

## Exploratory testing

No separate exploratory cases were executed in this phase. TC-004 and TC-005 included recovery/reset observations; the optional exploratory scenarios in `PLAN.md` remain outside the recorded scope.
