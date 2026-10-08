# Test examples

Examples are TypeScript. The ideas carry to any language.

## Behaviour at the seam

```ts
// Good: a caller's view, public API only
test("a cart with a valid card checks out as confirmed", async () => {
  const cart = createCart();
  cart.add({ sku: "mug", price: 12 });
  const order = await checkout(cart, validCard);
  expect(order.status).toBe("confirmed");
});

// Bad: pins an internal call
test("checkout calls paymentService.process", async () => {
  await checkout(cart, validCard);
  expect(paymentService.process).toHaveBeenCalledWith(cart.total);
});
```

## Verify through the interface

```ts
// Bad: reaches around the interface into storage
test("createUser saves a row", async () => {
  await createUser({ name: "Alice" });
  const rows = await db.query("select * from users where name = ?", ["Alice"]);
  expect(rows).toHaveLength(1);
});

// Good: uses the module's own read path
test("a created user can be fetched", async () => {
  const user = await createUser({ name: "Alice" });
  expect((await getUser(user.id)).name).toBe("Alice");
});
```

## Independent expected values

```ts
// Bad: the expectation is the implementation again
const expected = items.reduce((sum, i) => sum + i.price, 0);
expect(calculateTotal(items)).toBe(expected);

// Good: a literal worked out by hand
expect(calculateTotal([{ price: 10 }, { price: 5 }])).toBe(15);
```

## Injecting a boundary

```ts
// Easy to fake: the client comes in as an argument
function chargeOrder(order: Order, payments: PaymentClient) {
  return payments.charge(order.total);
}

// Hard to fake: the client is built inside
function chargeOrder(order: Order) {
  return new StripeClient(process.env.STRIPE_KEY!).charge(order.total);
}
```
