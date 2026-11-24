import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { test, expect } from "@playwright/test";

const evidenceDirectory = path.resolve("evidence");
const browserErrorsByPage = new WeakMap();
const orderTotal = (page) => page.getByTestId("order-total");
const customerName = (page) => page.getByLabel("Customer name");
const placeOrderButton = (page) => page.getByRole("button", { name: "Place Order" });

function productRow(page, productName) {
  return page.locator(".product").filter({
    has: page.getByRole("heading", { name: productName, exact: true })
  });
}

function cartRow(page, productName) {
  return page.locator(".cart-line").filter({
    has: page.getByRole("heading", { name: productName, exact: true })
  });
}

async function captureEvidence(page, testInfo, fileName) {
  await mkdir(evidenceDirectory, { recursive: true });
  const screenshot = await page.screenshot({ fullPage: true });
  await writeFile(path.join(evidenceDirectory, fileName), screenshot);
  await testInfo.attach(fileName, {
    body: screenshot,
    contentType: "image/png"
  });
}

test.beforeEach(async ({ page }) => {
  const browserErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("response", (response) => {
    if (!response.ok()) {
      browserErrors.push(`HTTP ${response.status()} ${response.url()}`);
    }
  });
  browserErrorsByPage.set(page, browserErrors);

  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Checkout" })).toBeVisible();
  await expect(page.getByText("Your cart is empty.", { exact: true })).toBeVisible();
  await expect(orderTotal(page)).toHaveText("₹0");
  await expect(page.locator("#confirmation")).toBeHidden();
  await expect(page.locator("#order-reference")).toHaveText("");
});

test.afterEach(async ({ page }) => {
  expect(browserErrorsByPage.get(page)).toEqual([]);
});

test("TC-001 [P0] - successful checkout displays one accurate confirmation", async ({ page }, testInfo) => {
  const confirmation = page.locator("#confirmation");

  await test.step("Add one of each product", async () => {
    await productRow(page, "Wireless Mouse")
      .getByRole("button", { name: "Add Wireless Mouse to cart" })
      .click();
    await productRow(page, "Keyboard")
      .getByRole("button", { name: "Add Keyboard to cart" })
      .click();
  });

  await test.step("Enter customer details and verify the total", async () => {
    await customerName(page).fill("Test Customer");
    await expect(orderTotal(page)).toHaveText("₹1,500");
  });

  await test.step("Place the order and verify its confirmation", async () => {
    await placeOrderButton(page).click();

    await expect(confirmation).toBeVisible();
    await expect(confirmation).toHaveCount(1);
    await expect(confirmation.getByText("Order placed successfully!", { exact: true })).toBeVisible();
    await expect(confirmation.locator("#confirmation-customer")).toHaveText("Test Customer");
    await expect(confirmation.locator("#order-reference")).toHaveText(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
    await expect(confirmation.locator("#confirmation-total")).toHaveText("₹1,500");
    await expect(placeOrderButton(page)).toBeDisabled();
  });

  await test.step("Capture successful checkout evidence", async () => {
    await captureEvidence(page, testInfo, "TC-001-successful-checkout.png");
  });
});

test("TC-002 [P0] - missing customer name blocks checkout and preserves the cart", async ({ page }, testInfo) => {
  const mouse = cartRow(page, "Wireless Mouse");

  await test.step("Add a mouse and verify its initial total", async () => {
    await productRow(page, "Wireless Mouse")
      .getByRole("button", { name: "Add Wireless Mouse to cart" })
      .click();
    await expect(orderTotal(page)).toHaveText("₹500");
  });

  await test.step("Submit without a customer name", async () => {
    await placeOrderButton(page).click();

    await expect(page.locator("#name-error")).toBeVisible();
    await expect(page.locator("#name-error")).toHaveText("Please enter your name.");
    await expect(page.locator("#confirmation")).toBeHidden();
    await expect(page.locator("#order-reference")).toHaveText("");
    await expect(mouse).toBeVisible();
    await expect(mouse.locator('[data-quantity="mouse"]')).toHaveText("1");
    await expect(orderTotal(page)).toHaveText("₹500");
    await expect(placeOrderButton(page)).toBeEnabled();
  });

  await test.step("Capture required-field validation evidence", async () => {
    await captureEvidence(page, testInfo, "TC-002-required-field-validation.png");
  });
});

test("TC-003 [P0] - quantity changes update exact line and order totals", async ({ page }, testInfo) => {
  const mouse = cartRow(page, "Wireless Mouse");
  const keyboard = cartRow(page, "Keyboard");
  const mouseLineTotal = mouse.locator(".line-total strong");
  const keyboardQuantity = keyboard.locator('[data-quantity="keyboard"]');

  await test.step("Add both products and verify the initial order total", async () => {
    await productRow(page, "Wireless Mouse")
      .getByRole("button", { name: "Add Wireless Mouse to cart" })
      .click();
    await productRow(page, "Keyboard")
      .getByRole("button", { name: "Add Keyboard to cart" })
      .click();
    await expect(orderTotal(page)).toHaveText("₹1,500");
    await expect(keyboardQuantity).toHaveText("1");
  });

  await test.step("Increase the mouse quantity to two", async () => {
    await mouse.getByRole("button", { name: "Increase Wireless Mouse quantity" }).click();
    await expect(mouse.locator('[data-quantity="mouse"]')).toHaveText("2");
    await expect(mouseLineTotal).toHaveText("₹1,000");
    await expect(orderTotal(page)).toHaveText("₹2,000");
  });

  await test.step("Increase the mouse quantity to three", async () => {
    await mouse.getByRole("button", { name: "Increase Wireless Mouse quantity" }).click();
    await expect(mouse.locator('[data-quantity="mouse"]')).toHaveText("3");
    await expect(mouseLineTotal).toHaveText("₹1,500");
    await expect(orderTotal(page)).toHaveText("₹2,500");
  });

  await test.step("Decrease the mouse quantity to two and confirm the keyboard is unchanged", async () => {
    await mouse.getByRole("button", { name: "Decrease Wireless Mouse quantity" }).click();
    await expect(mouse.locator('[data-quantity="mouse"]')).toHaveText("2");
    await expect(mouseLineTotal).toHaveText("₹1,000");
    await expect(orderTotal(page)).toHaveText("₹2,000");
    await expect(keyboardQuantity).toHaveText("1");
  });

  await test.step("Capture exact-total evidence", async () => {
    await captureEvidence(page, testInfo, "TC-003-exact-total-calculation.png");
  });
});
