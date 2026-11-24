# Mini Checkout

A lightweight single-page checkout built with HTML, CSS, vanilla JavaScript, Vite, and Playwright. It contains two synthetic products and keeps all state in memory.

## Prerequisites

- Node.js 20 or newer (tested with Node.js 22.17.1)
- npm 10 or newer
- Windows, macOS, or Linux

## Installation

For a reproducible install:

```sh
npm ci
```

Or use:

```sh
npm install
```

Install the Chromium browser used by Playwright:

```sh
npx playwright install chromium
```

## Run the application

```sh
npm run dev
```

Open `http://127.0.0.1:4173`.

## Build

```sh
npm run build
```

## Run browser tests

```sh
npm run test:e2e
```

The Playwright configuration starts Vite automatically on port 4173. Chromium is the only configured project. Tests run in isolated browser contexts.

Run the suite with a visible browser:

```sh
npm run test:e2e:headed
```

Open the generated HTML report:

```sh
npm run test:e2e:report
```

Failure traces and screenshots are retained by the Playwright configuration. Genuine screenshots from the passing automated cases are in `evidence/`.

## Manual testing

TC-004 and TC-005 in [TEST_PLAN.md](TEST_PLAN.md) require human interactive verification. The automated browser suite supplements but does not replace those manual cases.

## Project structure

- `src/cart.js` - cart state and integer-paise calculations
- `src/checkout.js` - validation and synchronous order-state guard
- `src/main.js` - UI rendering and form event handling
- `src/styles.css` - responsive accessible styling
- `tests/checkout.spec.js` - TC-001 through TC-003
- `evidence/` - genuine browser screenshots
- `playwright.config.js` - Chromium and web-server configuration
- `favicon.svg` - locally served browser tab icon

## Limitations

- State is intentionally not persisted.
- TC-004 and TC-005 are not recorded as executed unless a human verifies them.
- No backend, payment processing, authentication, or database is included.
