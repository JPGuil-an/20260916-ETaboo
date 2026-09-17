import test from "node:test";
import assert from "node:assert/strict";
import { validatePriceRange } from "./priceControl.js";

test("rejects a maximum price equal to the minimum", () => {
  assert.equal(validatePriceRange(80, 80), "Maximum price must be greater than minimum price.");
});

test("rejects a maximum price below the minimum", () => {
  assert.equal(validatePriceRange(80, 79), "Maximum price must be greater than minimum price.");
});

test("accepts a maximum price greater than the minimum", () => {
  assert.equal(validatePriceRange(80, 81), "");
});
