export const CHECKOUT_STATUS = Object.freeze({
  IDLE: "IDLE",
  SUBMITTING: "SUBMITTING",
  COMPLETED: "COMPLETED"
});

export function createCheckoutState() {
  return {
    status: CHECKOUT_STATUS.IDLE,
    validationErrors: { cart: "", name: "" },
    order: null
  };
}

export function validateOrder(cart, customerName) {
  const hasName = typeof customerName === "string" && customerName.trim().length > 0;
  return {
    cart: cart.length === 0 ? "Your cart is empty. Please add at least one product." : "",
    name: hasName ? "" : "Please enter your name."
  };
}

export function startOrder(state, cart, customerName) {
  if (state.status !== CHECKOUT_STATUS.IDLE) return false;

  state.validationErrors = validateOrder(cart, customerName);
  if (state.validationErrors.cart || state.validationErrors.name) return false;

  state.status = CHECKOUT_STATUS.SUBMITTING;
  return true;
}

export function clearResolvedValidationErrors(state, cart, customerName) {
  if (cart.length > 0) state.validationErrors.cart = "";
  if (typeof customerName === "string" && customerName.trim().length > 0) {
    state.validationErrors.name = "";
  }
  return { ...state.validationErrors };
}

export function completeOrder(state, customerName, cart, totalPaise) {
  if (state.status !== CHECKOUT_STATUS.SUBMITTING) return null;
  if (!Number.isSafeInteger(totalPaise) || totalPaise < 0) {
    throw new TypeError("Order total must be a non-negative integer amount in paise.");
  }
  if (!globalThis.crypto || typeof globalThis.crypto.randomUUID !== "function") {
    throw new Error("crypto.randomUUID() is required to generate an order reference.");
  }

  const order = {
    customerName,
    cart: cart.map((item) => ({ ...item })),
    totalPaise,
    reference: globalThis.crypto.randomUUID()
  };
  state.order = order;
  state.status = CHECKOUT_STATUS.COMPLETED;
  return { ...order, cart: order.cart.map((item) => ({ ...item })) };
}

export function resetCheckoutState(state) {
  state.status = CHECKOUT_STATUS.IDLE;
  state.validationErrors = { cart: "", name: "" };
  state.order = null;
}
