import "./styles.css";
import {
  PRODUCTS,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  calculateLineTotal,
  calculateOrderTotal,
  getCart,
  clearCart,
  formatINR
} from "./cart.js";
import {
  CHECKOUT_STATUS,
  createCheckoutState,
  startOrder,
  completeOrder,
  clearResolvedValidationErrors,
  resetCheckoutState
} from "./checkout.js";

const checkout = createCheckoutState();

const productList = document.querySelector("#product-list");
const cartItems = document.querySelector("#cart-items");
const orderTotal = document.querySelector("#order-total");
const cartError = document.querySelector("#cart-error");
const nameError = document.querySelector("#name-error");
const nameInput = document.querySelector("#customer-name");
const newOrderButton = document.querySelector("#new-order");
const confirmation = document.querySelector("#confirmation");
const confirmationCustomer = document.querySelector("#confirmation-customer");
const orderReference = document.querySelector("#order-reference");
const confirmationTotal = document.querySelector("#confirmation-total");
const form = document.querySelector("#checkout-form");

function renderProducts() {
  productList.innerHTML = PRODUCTS.map((product) => `
    <article class="product">
      <div class="product-details">
        <h3>${product.name}</h3>
        <p class="product-price">${formatINR(product.unitPricePaise)}</p>
      </div>
      <button class="add-button" type="button" data-add="${product.id}" aria-label="Add ${product.name} to cart">
        <span aria-hidden="true">+</span> Add to Cart
      </button>
    </article>
  `).join("");
}

function renderCart() {
  const lines = getCart().map((item) => ({
    ...item,
    lineTotalPaise: calculateLineTotal(item)
  }));
  cartItems.innerHTML = lines.length ? lines.map((line) => `
    <article class="cart-line" data-product="${line.productId}">
      <div class="cart-line-header">
        <div>
          <h4>${line.productName}</h4>
          <p class="unit-price">Unit price: <span>${formatINR(line.unitPricePaise)}</span></p>
        </div>
        <button class="text-button" type="button" data-remove="${line.productId}" aria-label="Remove ${line.productName}">Remove</button>
      </div>
      <div class="quantity-controls">
        <span class="quantity-label">Quantity</span>
        <div class="quantity-stepper" aria-label="${line.productName} quantity controls">
          <button type="button" data-decrease="${line.productId}" aria-label="Decrease ${line.productName} quantity">−</button>
          <span data-quantity="${line.productId}" aria-label="${line.productName} quantity" aria-live="polite">${line.quantity}</span>
          <button type="button" data-increase="${line.productId}" aria-label="Increase ${line.productName} quantity">+</button>
        </div>
        <p class="line-total">Line total <strong data-line-total="${line.productId}">${formatINR(line.lineTotalPaise)}</strong></p>
      </div>
    </article>
  `).join("") : `<div class="empty-cart" id="empty-cart">
    <span class="empty-cart-icon" aria-hidden="true">○</span>
    <p>Your cart is empty.</p>
    <p class="empty-cart-hint">Add a product to get started.</p>
  </div>`;

  orderTotal.textContent = formatINR(calculateOrderTotal());
}

function updateMessage(element, message) {
  element.textContent = message;
  element.hidden = message === "";
}

function clearStaleErrors() {
  renderValidationErrors(clearResolvedValidationErrors(checkout, getCart(), nameInput.value));
}

function renderValidationErrors(errors) {
  updateMessage(cartError, errors.cart);
  updateMessage(nameError, errors.name);
  if (errors.name) nameInput.setAttribute("aria-invalid", "true");
  else nameInput.removeAttribute("aria-invalid");
}

function freezeCheckoutControls() {
  document.querySelectorAll("button").forEach((button) => {
    if (button !== newOrderButton) button.disabled = true;
  });
  nameInput.disabled = true;
}

function unfreezeCheckoutControls() {
  document.querySelectorAll("button").forEach((button) => {
    button.disabled = false;
  });
  nameInput.disabled = false;
}

productList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button || checkout.status !== CHECKOUT_STATUS.IDLE) return;
  addToCart(button.dataset.add);
  clearStaleErrors();
  renderCart();
});

cartItems.addEventListener("click", (event) => {
  if (checkout.status !== CHECKOUT_STATUS.IDLE) return;
  const increase = event.target.closest("[data-increase]");
  const decrease = event.target.closest("[data-decrease]");
  const remove = event.target.closest("[data-remove]");
  if (increase) increaseQuantity(increase.dataset.increase);
  if (decrease) decreaseQuantity(decrease.dataset.decrease);
  if (remove) removeFromCart(remove.dataset.remove);
  clearStaleErrors();
  renderCart();
});

nameInput.addEventListener("input", clearStaleErrors);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (checkout.status !== CHECKOUT_STATUS.IDLE) return;
  if (!startOrder(checkout, getCart(), nameInput.value)) {
    renderValidationErrors(checkout.validationErrors);
    return;
  }

  freezeCheckoutControls();
  const cartSnapshot = getCart();
  const order = completeOrder(
    checkout,
    nameInput.value,
    cartSnapshot,
    calculateOrderTotal()
  );
  if (!order) throw new Error("Order submission could not be completed.");

  confirmationCustomer.textContent = order.customerName;
  orderReference.textContent = order.reference;
  confirmationTotal.textContent = formatINR(order.totalPaise);
  confirmation.hidden = false;
  newOrderButton.hidden = false;
});

newOrderButton.addEventListener("click", () => {
  clearCart();
  resetCheckoutState(checkout);
  nameInput.value = "";
  nameInput.disabled = false;
  nameInput.removeAttribute("aria-invalid");
  unfreezeCheckoutControls();
  confirmation.hidden = true;
  confirmationCustomer.textContent = "";
  orderReference.textContent = "";
  confirmationTotal.textContent = "";
  newOrderButton.hidden = true;
  renderValidationErrors(checkout.validationErrors);
  renderCart();
});

renderProducts();
renderCart();
