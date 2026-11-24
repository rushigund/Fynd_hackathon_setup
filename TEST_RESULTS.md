# Test Results

## Execution date and environment

- Execution date: 2026-11-24
- Operating system: Windows
- Node.js: 22.17.1
- npm: 10.9.2
- Browser: Playwright Chromium build 159.0.8154.6
- Application URL: `http://127.0.0.1:4173`

## Commands executed

- `npx playwright install chromium`
- `npm run build`
- `npm run test:e2e`
- `npm run test:e2e:headed`
- `npm run test:e2e:report` (served the generated report; HTTP 200)

## Phase 5 execution summary

Final requested headless run:

| Category | Count |
| --- | ---: |
| Passed automated tests | 3 |
| Failed automated tests | 0 |
| Skipped automated tests | 0 |
| Blocked automated tests | 0 |
| Manual cases not executed | 2 |

The first headed run had three failures due to Chromium’s implicit `/favicon.ico` request returning 404. The app now declares a local `favicon.svg`; the headed suite was rerun and passed 3/3, followed by the final headless run passing 3/3.

## Per-test results

| ID | Expected | Actual | Status |
| --- | --- | --- | --- |
| TC-001 | Exactly one confirmation with success text, Test Customer, UUID reference, ₹1,500 total; Place Order disabled | All assertions passed in Chromium | Pass |
| TC-002 | Exact name-required message; no confirmation/reference; mouse quantity 1, total ₹500; retry enabled | All assertions passed in Chromium | Pass |
| TC-003 | Initial ₹1,500; mouse quantity 2/line ₹1,000/order ₹2,000; quantity 3/line ₹1,500/order ₹2,500; then quantity 2/line ₹1,000/order ₹2,000; keyboard remains 1 | All assertions passed in Chromium | Pass |
| TC-004 | Empty-cart error, ₹0 total, no confirmation, preserved name | Not run; Phase 6 manual execution remains pending | Not Executed |
| TC-005 | One confirmation/reference after rapid double-click; subsequent submission prevented | Not run; Phase 6 manual execution remains pending | Not Executed |

## Evidence

- Playwright HTML report: `playwright-report/index.html`
- Genuine screenshots, also attached to the report: `evidence/TC-001-successful-checkout.png`, `evidence/TC-002-required-field-validation.png`, `evidence/TC-003-exact-total-calculation.png`
- Failure screenshots and traces are configured to be retained under `test-results/`. The initial headed failure generated them, but the successful rerun cleared the transient failure artifacts.

## Known limitations

The two mandatory manual cases remain pending human verification and are not represented as executed. No browser console errors occurred in the final headless or headed reruns. No environmental blockers remain.
