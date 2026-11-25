# Defect Report

## Defect summary

One low-priority browser resource defect was found during the headed test run, fixed, and retested. No open application defects remain within the executed automated test scope.

## Genuine defects

### APP-001 — Missing favicon caused a browser 404

- **Severity/Priority:** Low / P3
- **Environment:** Windows, Node.js 22.17.1, Vite 7.3.8, Playwright Chromium 159.0.8154.6 in headed mode
- **Preconditions:** Open the checkout in Chromium with no favicon declared.
- **Steps to reproduce:** Run `npm run test:e2e:headed`; load the checkout page and inspect browser console output.
- **Expected:** No browser console errors.
- **Actual:** Chromium requested `/favicon.ico`, which returned 404 and caused a console error.
- **Evidence:** The recorded initial headed-run output in this report and `TEST_RESULTS.md` identifies the 404. The original failure screenshot/trace is no longer present in the workspace; earlier reruns cleared the transient artifacts before this phase. It is not being recreated or represented as a preserved original.
- **Current status:** Fixed by adding and linking a local `favicon.svg`.
- **Retest:** All three tests passed in headed mode after the fix; all three also passed in the final headless run, with no console or page errors.

## Test-harness issue corrected during validation

- **ID:** QA-001
- **Title:** TC-002 validation assertion matched two visible elements
- **Severity/Priority:** Low / P2
- **Environment:** Windows, Playwright Chromium 159.0.8154.6
- **Preconditions:** A mouse is in the cart and the customer name is blank
- **Reproduction:** Submit the checkout and use `getByText("Customer name is required.", { exact: true })`
- **Expected:** The assertion targets the visible field error
- **Actual:** The broad locator matched both `#name-error` and `#status-message`
- **Evidence:** The original failure output was recorded in the prior test run; its transient trace is no longer present. No application behavior failure was observed.
- **Current status:** Corrected
- **Retest:** TC-002 rerun using `#name-error`; passed
