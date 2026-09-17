# Admin Reporting Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge transaction reporting and crop-record analytics into one responsive green admin workspace with shared filters, CanvasJS visualization, stable table rows, and print-ready output.

**Architecture:** Keep the two authenticated report endpoints but give them one validated commodity/date-range contract and request them concurrently from `GenerateReport.jsx`. Extract frontend transformations into pure functions in `reporting.js`, repair the crop aggregate response in `SuperAdminController`, and route both report URLs to the consolidated component.

**Tech Stack:** Laravel/PHP, React 18, Axios, CanvasJS React, react-to-print, Tailwind CSS plus the existing project CSS.

**Spec:** `docs/superpowers/specs/2026-09-17-admin-reporting-workspace-design.md`

## Global Constraints

- Keep CanvasJS as the chart library.
- Use the current compact green admin design system.
- `/admin/report/generate` is the primary route; `/admin/croprecords` remains compatible.
- The browser layout must remain fluid and must not use a fixed A4 width.
- Printing must include report content only.
- Do not add a new frontend dependency.

---

### Task 1: Pure Reporting Transformations

**Files:**
- Create: `react/src/views/Admin/reporting.js`
- Create: `react/src/views/Admin/reporting.test.js`

**Interfaces:**
- Produces: `validateReportFilters(filters, today) -> string`
- Produces: `flattenTransactions(transactions) -> ReportRow[]`
- Produces: `calculateReportSummary(rows, cropTotals) -> { sales, orders, soldKg, yieldKg }`
- Produces: `buildCropSeries(locations) -> CanvasJSDataSeries[]`

- [ ] **Step 1: Write failing tests for date validation**

```js
test("rejects an end date before the start date", () => {
  assert.equal(validateReportFilters({ product_type: "Carrots", starting_date: "2026-09-10", end_date: "2026-09-09" }, "2026-09-17"), "End date must be on or after the start date.");
});

test("rejects future dates", () => {
  assert.equal(validateReportFilters({ product_type: "Carrots", starting_date: "2026-09-10", end_date: "2026-09-18" }, "2026-09-17"), "Report dates cannot be in the future.");
});
```

- [ ] **Step 2: Run the validation tests and confirm RED**

Run: `node --test src/views/Admin/reporting.test.js`

Expected: FAIL because `reporting.js` does not exist or the exports are not implemented.

- [ ] **Step 3: Implement filter validation**

```js
export function validateReportFilters(filters, today) {
  if (!filters.product_type || !filters.starting_date || !filters.end_date) return "Choose a commodity and complete the date range.";
  if (filters.starting_date > today || filters.end_date > today) return "Report dates cannot be in the future.";
  if (filters.end_date < filters.starting_date) return "End date must be on or after the start date.";
  return "";
}
```

- [ ] **Step 4: Add failing tests for transaction flattening and chart series**

Use a literal transaction with two `transaction_detail` entries and assert that `flattenTransactions` returns two rows with stable keys, buyer name, product, kilograms, price per kilogram, and line total. Use two literal locations and assert `buildCropSeries` returns exactly two series named `Sold kg` and `Expected yield kg`.

- [ ] **Step 5: Run transformation tests and confirm RED**

Run: `node --test src/views/Admin/reporting.test.js`

Expected: validation tests PASS; transformation tests FAIL because the functions are missing.

- [ ] **Step 6: Implement transformations**

```js
export function flattenTransactions(transactions = []) {
  return transactions.flatMap((transaction) => (transaction.transaction_detail || []).map((detail) => ({
    key: `${transaction.id}-${detail.id || detail.product_id}`,
    transactionId: transaction.id,
    buyer: transaction.user?.name || "Unknown buyer",
    product: detail.product_name,
    kilograms: Number(detail.kg_purchased || 0),
    pricePerKilo: Number(detail.price_per_kilo || 0),
    total: Number(detail.kg_purchased || 0) * Number(detail.price_per_kilo || 0),
  })));
}

export function calculateReportSummary(rows = [], cropTotals = {}) {
  return {
    sales: rows.reduce((sum, row) => sum + row.total, 0),
    orders: new Set(rows.map((row) => row.transactionId)).size,
    soldKg: rows.reduce((sum, row) => sum + row.kilograms, 0),
    yieldKg: Number(cropTotals.yield_kg || 0),
  };
}

export function buildCropSeries(locations = []) {
  return [
    { type: "column", name: "Sold kg", showInLegend: true, color: "#d99a24", dataPoints: locations.map((item) => ({ label: item.location, y: Number(item.sold_kg || 0) })) },
    { type: "column", name: "Expected yield kg", showInLegend: true, color: "#168447", dataPoints: locations.map((item) => ({ label: item.location, y: Number(item.yield_kg || 0) })) },
  ];
}
```

- [ ] **Step 7: Run focused frontend tests and confirm GREEN**

Run: `node --test src/views/Admin/reporting.test.js`

Expected: all reporting helper tests PASS.

- [ ] **Step 8: Commit the helper layer**

```bash
git add react/src/views/Admin/reporting.js react/src/views/Admin/reporting.test.js
git commit -m "test: define admin report transformations"
```

---

### Task 2: Validated Reporting APIs and Crop Aggregation

**Files:**
- Modify: `app/Http/Controllers/Api/SuperAdminController.php`
- Create: `tests/Feature/AdminReportingTest.php`

**Interfaces:**
- Consumes: request fields `product_type`, `starting_date`, `end_date` for transactions.
- Consumes: request fields `commodity`, `start_date`, `end_date` for crop analytics.
- Produces: crop JSON `{ commodity, start_date, end_date, locations[], totals }`.

- [ ] **Step 1: Write failing backend validation tests**

Create controller-level tests using `Request::create` and `DatabaseTransactions`. Assert both `generateReport` and `getCropRecords` throw `ValidationException` when the end date precedes the start date.

```php
$request = Request::create('/api/getCropPredictiveAnalysis', 'POST', [
    'commodity' => 'Carrots',
    'start_date' => '2026-09-10',
    'end_date' => '2026-09-09',
]);
```

- [ ] **Step 2: Run the backend tests and confirm RED**

Run: `php artisan test --filter=AdminReportingTest`

Expected: FAIL because the endpoints do not enforce an ordered date range.

- [ ] **Step 3: Add the shared validation contracts**

For `generateReport`, validate:

```php
$validated = $request->validate([
    'product_type' => ['required', 'in:Brocollis,Carrots,Cabbages,Tomatoes'],
    'starting_date' => ['required', 'date', 'before_or_equal:today'],
    'end_date' => ['required', 'date', 'after_or_equal:starting_date', 'before_or_equal:today'],
]);
```

For `getCropRecords`, use the equivalent `commodity`, `start_date`, and `end_date` fields.

- [ ] **Step 4: Run validation tests and confirm GREEN**

Run: `php artisan test --filter=AdminReportingTest`

Expected: date validation tests PASS.

- [ ] **Step 5: Write a failing crop aggregation test**

Within `DatabaseTransactions`, create approved Carrot products for `Alanib, Lantapan` and `ALANIB`, plus an out-of-range Carrot and an in-range Tomato. Assert the response contains one normalized `Alanib` location and totals only the in-range Carrots.

- [ ] **Step 6: Run the aggregation test and confirm RED**

Run: `php artisan test --filter=AdminReportingTest`

Expected: FAIL because `getCropRecords` currently returns no normalized response and ignores dates.

- [ ] **Step 7: Replace the manual location counters with grouped aggregation**

Query matching products with `whereBetween('harvested_date', ...)`, normalize the first comma-delimited location segment with `Str::title`, group the collection, and return:

```php
return response()->json([
    'commodity' => $validated['commodity'],
    'start_date' => $validated['start_date'],
    'end_date' => $validated['end_date'],
    'locations' => $locations->values(),
    'totals' => [
        'sold_kg' => (float) $records->sum('actual_sold_kg'),
        'yield_kg' => (float) $records->sum('prospect_harvest_in_kg'),
    ],
]);
```

- [ ] **Step 8: Run reporting backend tests and confirm GREEN**

Run: `php artisan test --filter=AdminReportingTest`

Expected: all validation and crop aggregation tests PASS.

- [ ] **Step 9: Commit the backend contract**

```bash
git add app/Http/Controllers/Api/SuperAdminController.php tests/Feature/AdminReportingTest.php
git commit -m "feat: return validated crop report analytics"
```

---

### Task 3: Consolidated Responsive Report Page

**Files:**
- Rewrite: `react/src/views/Admin/GenerateReport.jsx`
- Modify: `react/src/router.jsx`
- Modify: `react/src/views/Admin/AdminLayout.jsx`
- Modify: `react/src/views/Admin/Dashboard.jsx`

**Interfaces:**
- Consumes: all four exports from `reporting.js`.
- Consumes: transaction array from `/generateReport` and normalized crop response from `/getCropPredictiveAnalysis`.
- Produces: one shared report workspace for both report routes.

- [ ] **Step 1: Replace the tabbed page with shared filter state**

Use one state object:

```js
const [filters, setFilters] = useState({ product_type: "", starting_date: "", end_date: "" });
const [transactions, setTransactions] = useState([]);
const [cropReport, setCropReport] = useState({ locations: [], totals: {} });
const [status, setStatus] = useState("idle");
const [error, setError] = useState("");
```

Submit both requests with `Promise.all`, mapping `product_type` to `commodity`, `starting_date` to `start_date`, and `end_date` to `end_date` for the crop request.

- [ ] **Step 2: Build the responsive filter and result hierarchy**

Render, in order:

1. green admin header;
2. filter panel with three fields, reset, and generate actions;
3. inline validation/error state;
4. four summary cards;
5. responsive CanvasJS grouped-column chart;
6. stable transaction-detail table inside an overflow container;
7. print/save action.

Use `flattenTransactions`, `calculateReportSummary`, and `buildCropSeries` rather than performing transformations inline.

- [ ] **Step 3: Configure printing around report content only**

Attach `componentRef` to the report result region. Configure `useReactToPrint` with `content: () => componentRef.current` and a document title containing the commodity and dates. Keep the print button outside the referenced region.

- [ ] **Step 4: Consolidate routes and navigation**

In `router.jsx`, render `<GenerateReport />` for both `admin/report/generate` and `admin/croprecords`. Remove the unused `CropPredictiveAnalysis` import. In `AdminLayout.jsx`, remove the Crop Records item and rename Reports to `Reports & Analytics`. In `Dashboard.jsx`, point the produce-sold metric to `/admin/report/generate`.

- [ ] **Step 5: Run the focused frontend helper tests**

Run: `node --test src/views/Admin/reporting.test.js`

Expected: PASS.

- [ ] **Step 6: Build the React app**

Run: `npm run build`

Expected: Vite exits 0 and resolves CanvasJS, react-to-print, and all consolidated route imports.

- [ ] **Step 7: Commit the consolidated page**

```bash
git add react/src/views/Admin/GenerateReport.jsx react/src/router.jsx react/src/views/Admin/AdminLayout.jsx react/src/views/Admin/Dashboard.jsx
git commit -m "feat: merge admin reports and crop analytics"
```

---

### Task 4: Responsive and Print Styling

**Files:**
- Modify: `react/src/index.css`

**Interfaces:**
- Consumes: `report-*` class names rendered by `GenerateReport.jsx`.
- Produces: fluid desktop/tablet/mobile layout and A4-friendly print output.

- [ ] **Step 1: Add the green report workspace styles**

Add scoped `.report-workspace`, `.report-filter-panel`, `.report-summary-grid`, `.report-chart-panel`, `.report-table-wrap`, and `.report-empty` rules. Use the existing admin border, green, muted-text, shadow, and radius values.

- [ ] **Step 2: Add responsive breakpoints**

At `900px`, change summary cards from four columns to two. At `640px`, stack filter fields and actions, make buttons full-width, use one summary column, reduce padding, and keep the report table horizontally scrollable.

- [ ] **Step 3: Add print rules**

```css
@media print {
  body { background:#fff !important; }
  .report-print-content { width:100% !important; color:#111; box-shadow:none !important; border:0 !important; }
  .report-print-hidden { display:none !important; }
  .report-chart-panel,.report-table-wrap { break-inside:avoid; }
}
```

- [ ] **Step 4: Run complete verification**

Run:

```bash
php artisan test --filter=AdminReportingTest
node --test src/views/Admin/reporting.test.js
npm run build
```

Expected: all focused tests PASS and Vite exits 0. Then run `php artisan test` and record any unrelated pre-existing failures separately.

- [ ] **Step 5: Commit responsive styling**

```bash
git add react/src/index.css
git commit -m "style: polish responsive admin reporting"
```
