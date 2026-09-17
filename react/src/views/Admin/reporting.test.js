import test from "node:test";
import assert from "node:assert/strict";
import {
  buildCropSeries,
  calculateReportSummary,
  flattenTransactions,
  validateReportFilters,
} from "./reporting.js";

const today = "2026-09-17";

test("rejects an end date before the start date", () => {
  assert.equal(
    validateReportFilters({ product_type: "Carrots", starting_date: "2026-09-10", end_date: "2026-09-09" }, today),
    "End date must be on or after the start date.",
  );
});

test("rejects future dates", () => {
  assert.equal(
    validateReportFilters({ product_type: "Carrots", starting_date: "2026-09-10", end_date: "2026-09-18" }, today),
    "Report dates cannot be in the future.",
  );
});

test("requires every report filter", () => {
  assert.equal(
    validateReportFilters({ product_type: "", starting_date: "", end_date: "" }, today),
    "Choose a commodity and complete the date range.",
  );
});

test("flattens every transaction detail into a stable report row", () => {
  const rows = flattenTransactions([{
    id: 14,
    user: { name: "Maria Buyer" },
    transaction_detail: [
      { id: 91, product_name: "Highland Carrots", kg_purchased: 2, price_per_kilo: 70 },
      { id: 92, product_name: "Baby Carrots", kg_purchased: 3, price_per_kilo: 80 },
    ],
  }]);

  assert.deepEqual(rows, [
    { key: "14-91", transactionId: 14, buyer: "Maria Buyer", product: "Highland Carrots", kilograms: 2, pricePerKilo: 70, total: 140 },
    { key: "14-92", transactionId: 14, buyer: "Maria Buyer", product: "Baby Carrots", kilograms: 3, pricePerKilo: 80, total: 240 },
  ]);
});

test("calculates report totals without double-counting orders", () => {
  const summary = calculateReportSummary([
    { transactionId: 14, kilograms: 2, total: 140 },
    { transactionId: 14, kilograms: 3, total: 240 },
    { transactionId: 15, kilograms: 1, total: 75 },
  ], { yield_kg: 90 });

  assert.deepEqual(summary, { sales: 455, orders: 2, soldKg: 6, yieldKg: 90 });
});

test("builds sold and expected-yield CanvasJS series", () => {
  const series = buildCropSeries([
    { location: "Alanib", sold_kg: 20, yield_kg: 100 },
    { location: "Songco", sold_kg: 15, yield_kg: 80 },
  ]);

  assert.equal(series.length, 2);
  assert.equal(series[0].name, "Sold kg");
  assert.equal(series[1].name, "Expected yield kg");
  assert.deepEqual(series[0].dataPoints, [{ label: "Alanib", y: 20 }, { label: "Songco", y: 15 }]);
});
