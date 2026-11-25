# Test Results

## Execution environment

- **Final regression date:** 2026-11-25
- **Manual test execution date:** 2026-11-24
- **Operating system:** Windows
- **Application version:** Mini Checkout 1.0.0
- **Repository HEAD:** `488e4d9` (Phase 7 documentation/cleanup changes are uncommitted)
- **Application URL:** `http://127.0.0.1:4173`
- **Automated browser:** Playwright Chromium 159.0.8154.6
- **Manual browser:** VS Code integrated browser, Chrome 150.0.7871.250 / Electron 43.8.9
- **Runtime/tooling:** Node.js 22.17.1, npm 10.9.2, Vite 7.3.8

## Commands and report review

- `npm ci` — passed; installed from the lockfile and reported zero vulnerabilities.
- `npx playwright install chromium` — completed.
- `npm run dev` — started successfully; local application responded HTTP 200.
- `npm run build` — passed on 2026-11-25.
- `npm run test:e2e` — passed on 2026-11-25: 3 passed, 0 failed, 0 skipped.
- `npm run test:e2e:headed` — passed on 2026-11-25: 3 passed.
- `npx playwright show-report` — report server responded HTTP 200; report reviewed in browser.
- TC-004 and TC-005 were manually performed in the VS Code integrated browser on 2026-11-24.

The final inspected Playwright HTML report at `playwright-report/index.html` showed three passed tests, zero failed, zero flaky, and zero skipped. Each automated case passed in both headless and headed runs; the unique mandatory automated case count remains three.

## Final execution summary

| Test type | PASS | FAIL | BLOCKED | NOT EXECUTED |
| --- | ---: | ---: | ---: | ---: |
| Automated mandatory cases (TC-001–TC-003) | 3 | 0 | 0 | 0 |
| Manual (TC-004–TC-005) | 2 | 0 | 0 | 0 |
| **Total mandatory cases** | **5** | **0** | **0** | **0** |

## Per-case results

| ID | Expected result | Actual result | Status | Evidence |
| --- | --- | --- | --- | --- |
| TC-001 | One confirmation with success text, customer, valid reference, and exact ₹1,500 total; Place Order disabled | All Playwright assertions passed in the final headless and headed runs | PASS | `evidence/TC-001-successful-checkout.png`; HTML report attachment |
| TC-002 | Missing-name message; no order/reference; mouse quantity and ₹500 total preserved; retry enabled | All Playwright assertions passed in the final headless and headed runs | PASS | `evidence/TC-002-required-field-validation.png`; HTML report attachment |
| TC-003 | Exact totals for mouse quantities 1, 2, 3, then 2; keyboard remains quantity 1 | All Playwright assertions passed in the final headless and headed runs | PASS | `evidence/TC-003-exact-total-calculation.png`; HTML report attachment |
| TC-004 | Empty-cart checkout blocked; name preserved; retry works after adding a product | Manually observed the exact empty-cart message, ₹0, no confirmation/reference, preserved `Test Customer`; adding a mouse produced ₹500 and retry succeeded with reference `4d39654f-52c8-4dd1-88ba-af0b80d22c63` | PASS | `evidence/TC-004-empty-cart-validation.png` |
| TC-005 | One order after rapid double-click; repeat prevented; reset permits a new order/reference | Manually double-clicked; one confirmation/reference remained at ₹1,500. Place Order was disabled and the subsequent click attempt was blocked. Reset cleared the cart/name/confirmation/total; the next order used a different reference | PASS | `evidence/TC-005-single-order-confirmation.png` |

## Defects and retests

- Genuine application defects discovered: **1** (APP-001, missing favicon returned 404).
- Genuine application defects resolved: **1** (local `favicon.svg` added and linked).
- Outstanding critical/high defects: **0**.
- Test-harness issue discovered and corrected: **1** (QA-001, ambiguous locator).
- No additional defects were observed during TC-004 or TC-005.
- The original APP-001 failure screenshot/trace was not retained before Phase 7. The initial 404 output is recorded in `DEFECT_REPORT.md`; the original artifact is unavailable and was not recreated. This limits evidence completeness but does not indicate an unresolved application defect.

## Evidence and reports

- Playwright HTML report: `playwright-report/index.html` (generated artifact; regenerate with `npm run test:e2e`).
- Automated screenshots, also attached to the report: `evidence/TC-001-successful-checkout.png`, `evidence/TC-002-required-field-validation.png`, and `evidence/TC-003-exact-total-calculation.png`.
- Manual screenshots: `evidence/TC-004-empty-cart-validation.png` and `evidence/TC-005-single-order-confirmation.png`.
- No recording was captured for TC-005; the screenshot documents the outcome, while the interaction and observed retry prevention are recorded in `TEST_PLAN.md`.

## Known limitations

- Optional exploratory scenarios were not separately executed.
- The original screenshot/trace for the fixed favicon failure is unavailable; see `DEFECT_REPORT.md`.
- No mandatory test cases remain unexecuted.
