export const PRODUCTS = Object.freeze([
  Object.freeze({ id: "mouse", name: "Wireless Mouse", unitPricePaise: 50000 }),
  Object.freeze({ id: "keyboard", name: "Keyboard", unitPricePaise: 100000 })
]);

const productsById = new Map(PRODUCTS.map((product) => [product.id, product]));
const items = [];
const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export function addToCart(productId) {
  const product = productsById.get(productId);
  if (!product) return false;

  const existingItem = items.find((item) => item.productId === productId);
  if (existingItem) {
    if (!Number.isSafeInteger(existingItem.quantity + 1)) return false;
    existingItem.quantity += 1;
    return true;
  }

  items.push({
    productId: product.id,
    productName: product.name,
    unitPricePaise: product.unitPricePaise,
    quantity: 1
  });
  return true;
}

export function removeFromCart(productId) {
  const itemIndex = items.findIndex((item) => item.productId === productId);
  if (itemIndex === -1) return false;
  items.splice(itemIndex, 1);
  return true;
}

export function increaseQuantity(productId) {
  const item = items.find((cartItem) => cartItem.productId === productId);
  if (!item || !Number.isSafeInteger(item.quantity + 1)) return false;
  item.quantity += 1;
  return true;
}

export function decreaseQuantity(productId) {
  const itemIndex = items.findIndex((cartItem) => cartItem.productId === productId);
  if (itemIndex === -1) return false;

  const item = items[itemIndex];
  if (item.quantity === 1) {
    items.splice(itemIndex, 1);
  } else {
    item.quantity -= 1;
  }
  return true;
}

export function calculateLineTotal(item) {
  if (
    !item ||
    !Number.isSafeInteger(item.unitPricePaise) ||
    item.unitPricePaise <= 0 ||
    !Number.isSafeInteger(item.quantity) ||
    item.quantity <= 0
  ) {
    throw new TypeError("A cart item must have a positive integer price and quantity.");
  }

  const lineTotalPaise = item.unitPricePaise * item.quantity;
  if (!Number.isSafeInteger(lineTotalPaise)) {
    throw new RangeError("Cart line total exceeds the safe integer range.");
  }
  return lineTotalPaise;
}

export function calculateOrderTotal() {
  return items.reduce((total, item) => total + calculateLineTotal(item), 0);
}

export function getCart() {
  return items.map((item) => ({ ...item }));
}

export function clearCart() {
  items.length = 0;
}

export function formatINR(amountPaise) {
  if (!Number.isSafeInteger(amountPaise)) {
    throw new TypeError("Currency amounts must be safe integer paise.");
  }
  return currencyFormatter.format(amountPaise / 100);
}
