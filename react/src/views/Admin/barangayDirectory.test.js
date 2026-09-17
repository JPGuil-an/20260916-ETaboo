import test from "node:test";
import assert from "node:assert/strict";
import { normalizeBarangayName, validateBarangayName, getBarangayRowNumber } from "./barangayDirectory.js";

test("normalizes whitespace and capitalization in barangay names", () => {
  assert.equal(normalizeBarangayName("  capitan   juan "), "Capitan Juan");
});

test("rejects barangay names outside the supported length", () => {
  assert.equal(validateBarangayName("Bas"), "Barangay name must contain 5 to 25 characters.");
  assert.equal(validateBarangayName("A barangay name that is much too long"), "Barangay name must contain 5 to 25 characters.");
});

test("accepts a valid normalized barangay name", () => {
  assert.equal(validateBarangayName("  capitan juan  "), "");
});

test("calculates row numbers across paginated results", () => {
  assert.equal(getBarangayRowNumber(0, 3, 8), 17);
  assert.equal(getBarangayRowNumber(7, 3, 8), 24);
});
