# Test Plan

## Objectives

Verify exact checkout totals, quantity changes, validation, customer-data preservation, and prevention of duplicate order placement.

## Scope

The scope is the Mini Checkout single-page UI and its in-memory cart and checkout behavior. It excludes backend, payment, authentication, persistence, and routing.

## Environment

- Execution date: 2026-11-24
- Operating system: Windows
- Node.js: 22.17.1
- npm: 10.9.2
- Vite: 7.3.8
- Playwright: installed Chromium build 159.0.8154.6
- Application URL: `http://127.0.0.1:4173`

## Risk priorities

| Risk | Priority |
| --- | --- |
| Incorrect order total | P0 |
| Duplicate order placement | P0 |
| Checkout with empty cart | P0 |
| Checkout with missing required information | P0 |
| Loss of entered customer data after validation failure | P1 |
| Incorrect quantity or item removal behaviour | P1 |

## Test cases

| ID | Type | Priority | Preconditions | Data | Steps | Expected result | Actual result | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-001 | Automated | P0 | Fresh browser context | Wireless Mouse, Keyboard, Test Customer | Open clean page, add both products, enter name, verify ₹1,500, submit | Exactly one confirmation displays success text, customer name, UUID reference, and ₹1,500 total; Place Order is disabled | All assertions passed in the final Chromium run | Pass | `evidence/TC-001-successful-checkout.png`, Playwright report attachment |
| TC-002 | Automated | P0 | Fresh browser context | Wireless Mouse, blank name | Open clean page, add mouse, verify ₹500, submit blank name | “Please enter your name.” appears; no confirmation/reference; mouse quantity 1 and ₹500 total remain; retry is enabled | All assertions passed in the final Chromium run | Pass | `evidence/TC-002-required-field-validation.png`, Playwright report attachment |
| TC-003 | Automated | P0 | Fresh browser context | Wireless Mouse, Keyboard | Open clean page, add both; increase mouse to 2 then 3; decrease to 2; verify each quantity, line and order total | Totals are exactly ₹1,500, ₹2,000, ₹2,500, and ₹2,000; keyboard quantity remains 1 | All assertions passed in the final Chromium run | Pass | `evidence/TC-003-exact-total-calculation.png`, Playwright report attachment |
| TC-004 | Manual | P0 | Fresh page, empty cart | Valid customer name | Enter name, place order; inspect validation, total, confirmation, and name field | “Your cart is empty. Please add at least one product.” is visible, total remains ₹0, no confirmation is generated, name remains entered | Not executed interactively | Not Executed | Human capture required |
| TC-005 | Manual | P0 | Fresh page | Any product, valid name | Add product, enter name, rapidly double-click Place Order, inspect confirmation/reference, attempt another submission | Exactly one confirmation and unchanged reference; further submission is blocked | Not executed interactively | Not Executed | Human screen recording/screenshots required |

The initial headed run surfaced a missing local favicon (404); the asset was added and the headed and headless suites subsequently passed. See [TEST_RESULTS.md](TEST_RESULTS.md) and [DEFECT_REPORT.md](DEFECT_REPORT.md).

## Manual execution instructions

1. Run `npm run dev`.
2. Open `http://127.0.0.1:4173`.
3. Execute TC-004 and TC-005 exactly as written.
4. Capture a screenshot or short recording under `evidence/`.
5. Update actual result and status consistently in this plan and `TEST_RESULTS.md`.
