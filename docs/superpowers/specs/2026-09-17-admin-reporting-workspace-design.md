# Admin Reporting Workspace Design

## Objective

Merge the existing transaction report generator and crop-record analytics into one professional, responsive admin workspace at `/admin/report/generate`. Preserve `/admin/croprecords` as a compatible entry point to the same workspace, while removing the duplicate Crop Records navigation item.

## User Experience

The page uses the current compact green admin design system. A concise header explains the reporting workspace and shows that the output combines sales and crop-supply information.

One shared filter panel contains:

- commodity: Broccoli, Carrots, Cabbage, or Tomatoes;
- start date;
- end date;
- a primary **Generate report** button;
- a secondary reset action.

The end date cannot precede the start date, neither date can be in the future, and all three fields are required. Validation appears inline and submission remains disabled while the inputs are incomplete or invalid.

After generation, results remain on the same page directly below the filters. The result area contains:

1. summary cards for total paid sales, completed transactions, kilograms sold, and expected harvest volume;
2. a responsive CanvasJS grouped-column chart comparing sold kilograms and expected yield for each barangay with data;
3. a responsive transaction-detail table with one row per purchased product, rather than malformed rows with a variable number of cells;
4. a clear empty state when the selected period has no matching transactions or crop records;
5. a **Print / Save PDF** action that prints only the report content.

On small screens, filters and summary cards stack, the chart remains responsive, the table scrolls horizontally, and all actions become full-width where appropriate. The browser view must never use a fixed A4 width.

## Routes and Navigation

- `/admin/report/generate` renders the consolidated reporting workspace.
- `/admin/croprecords` renders the same component so saved links remain valid.
- The admin sidebar contains one **Reports & Analytics** navigation item and no separate Crop Records item.
- Dashboard links that previously opened Crop Records point to the consolidated report route.

## Frontend Structure

`GenerateReport.jsx` owns the shared filter state, loading/error state, result data, CanvasJS configuration, and print reference.

Small pure helpers live in `reporting.js` so behavior can be tested without rendering the page:

- validate the date range;
- flatten transactions into stable table rows;
- calculate report summary values;
- transform crop aggregates into CanvasJS series.

CanvasJS remains the chart library because it is already installed and handles responsive grouped charts. The chart uses green for expected yield and a contrasting amber for sold volume, consistent with the rest of the admin palette.

## Backend Data Flow

Submitting the shared filters makes two concurrent authenticated requests:

- `POST /generateReport` for matching transaction details;
- `POST /getCropPredictiveAnalysis` for barangay-level crop aggregates.

Both endpoints validate the same commodity and date-range contract. The crop endpoint will be repaired to return a normalized response instead of ending without a response. It filters products by commodity and harvest date, normalizes location names before grouping, and returns:

```json
{
  "commodity": "Carrots",
  "start_date": "2026-01-01",
  "end_date": "2026-01-31",
  "locations": [
    {
      "location": "Alanib",
      "sold_kg": 20,
      "yield_kg": 100
    }
  ],
  "totals": {
    "sold_kg": 20,
    "yield_kg": 100
  }
}
```

The transaction endpoint continues returning transactions with buyer and detail relationships, but validates the filter before querying. The frontend derives paid sales and flattened rows from this response.

## Printing

The printable region includes:

- E-Tabo / Department of Agriculture report heading;
- selected commodity and date range;
- generation timestamp;
- summary metrics;
- CanvasJS chart when printable by the library;
- transaction-detail table and totals.

Print-specific CSS removes shadows and controls, uses an A4-friendly layout, and preserves readable green accents. The normal browser page stays fluid and responsive.

## Error and Empty States

- Invalid dates are blocked before network requests and rejected by the backend.
- Network or validation failures display an inline message near the filter controls.
- If one reporting request fails, the result is not partially presented as complete; the user receives one retryable error state.
- Successful requests with no rows show an informative empty report while still showing zero-valued summaries.
- The print button is disabled until a report has been generated successfully.

## Testing and Verification

Test-first coverage will include:

- frontend date validation rejects reversed ranges and future dates;
- transaction flattening produces one stable row per detail;
- crop aggregation groups normalized barangay names and honors commodity/date filters;
- backend endpoints reject invalid date ranges;
- the consolidated route and legacy route both render the reporting component.

Completion requires the focused frontend tests, focused Laravel feature tests, the full available Laravel suite, and a production Vite build to pass.
