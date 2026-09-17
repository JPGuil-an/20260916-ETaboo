import { useMemo, useState } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import { HiOutlineChartBar, HiOutlineClipboardList, HiOutlineDocumentDownload, HiOutlineScale } from "react-icons/hi";
import axiosClient from "../../axios-client";
import { buildCropSeries, calculateReportSummary, flattenTransactions, validateReportFilters } from "./reporting";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;
const commodities = ["Brocollis", "Carrots", "Cabbages", "Tomatoes"];
const number = (value) => new Intl.NumberFormat("en-PH", { maximumFractionDigits: 2 }).format(value || 0);
const money = (value) => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(value || 0);

export default function GenerateReport() {
  const today = new Date().toISOString().split("T")[0];
  const [filters, setFilters] = useState({ product_type: "", starting_date: "", end_date: "" });
  const [transactions, setTransactions] = useState([]);
  const [cropReport, setCropReport] = useState({ locations: [], totals: {} });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const rows = useMemo(() => flattenTransactions(transactions), [transactions]);
  const summary = useMemo(() => calculateReportSummary(rows, cropReport.totals), [rows, cropReport]);
  const chartOptions = useMemo(() => ({
    animationEnabled: true,
    backgroundColor: "transparent",
    axisX: { interval: 1, labelFontSize: 11, labelFontColor: "#52635a" },
    axisY: { title: "Kilograms", gridColor: "#e5eee8", labelFontColor: "#52635a" },
    toolTip: { shared: true },
    legend: { cursor: "pointer", fontSize: 12 },
    data: buildCropSeries(cropReport.locations),
  }), [cropReport.locations]);

  const updateFilter = ({ target: { name, value } }) => {
    setFilters((current) => ({ ...current, [name]: value }));
    setMessage("");
  };

  const generate = async (event) => {
    event.preventDefault();
    const validationMessage = validateReportFilters(filters, today);
    if (validationMessage) return setMessage(validationMessage);

    setStatus("loading");
    setMessage("");
    try {
      const [transactionResponse, cropResponse] = await Promise.all([
        axiosClient.post("/generateReport", filters),
        axiosClient.post("/getCropPredictiveAnalysis", {
          commodity: filters.product_type,
          start_date: filters.starting_date,
          end_date: filters.end_date,
        }),
      ]);
      setTransactions(Array.isArray(transactionResponse.data) ? transactionResponse.data : []);
      setCropReport(cropResponse.data || { locations: [], totals: {} });
      setStatus("ready");
    } catch (error) {
      const errors = error.response?.data?.errors;
      setMessage(errors ? Object.values(errors).flat()[0] : "The report could not be generated. Please try again.");
      setStatus("error");
    }
  };

  const hasResults = status === "ready";

  return (
    <main className="report-workspace">
      <header className="report-hero no-print">
        <div><span>Reports &amp; Analytics</span><h1>Marketplace performance, in one view</h1><p>Review paid transactions and crop movement using the same commodity and date range.</p></div>
        <HiOutlineChartBar aria-hidden="true" />
      </header>

      <section className="report-filter no-print" aria-labelledby="report-filter-title">
        <div className="report-section-heading">
          <div><small>Report controls</small><h2 id="report-filter-title">Choose what to analyze</h2></div>
          <span>Dates use completed harvest and payment records</span>
        </div>
        <form onSubmit={generate} className="report-filter-grid">
          <label>Commodity<select name="product_type" value={filters.product_type} onChange={updateFilter}><option value="">Select a commodity</option>{commodities.map((commodity) => <option key={commodity} value={commodity}>{commodity}</option>)}</select></label>
          <label>Start date<input type="date" name="starting_date" max={today} value={filters.starting_date} onChange={updateFilter} /></label>
          <label>End date<input type="date" name="end_date" min={filters.starting_date || undefined} max={today} value={filters.end_date} onChange={updateFilter} /></label>
          <button type="submit" disabled={status === "loading"}>{status === "loading" ? "Generating…" : "Generate report"}</button>
        </form>
        {message && <p className="report-message" role="alert">{message}</p>}
      </section>

      {!hasResults && status !== "loading" && <section className="report-empty"><HiOutlineClipboardList aria-hidden="true" /><h2>Your report will appear here</h2><p>Select a commodity and date range to compare sales with crop records.</p></section>}
      {status === "loading" && <section className="report-loading" aria-live="polite"><span />Preparing marketplace and crop data…</section>}

      {hasResults && <div className="report-print-area">
        <div className="report-print-header"><div><small>E-Tabo Admin Report</small><h2>{filters.product_type} performance report</h2></div><p>{filters.starting_date} to {filters.end_date}</p></div>
        <section className="report-kpis" aria-label="Report summary">
          <article><span>Gross sales</span><strong>{money(summary.sales)}</strong><small>From matching transaction lines</small></article>
          <article><span>Paid orders</span><strong>{number(summary.orders)}</strong><small>Unique marketplace orders</small></article>
          <article><span>Produce sold</span><strong>{number(summary.soldKg)} kg</strong><small>Paid transaction quantity</small></article>
          <article><span>Expected yield</span><strong>{number(summary.yieldKg)} kg</strong><small>Crop records in this period</small></article>
        </section>

        <section className="report-panel report-chart-panel">
          <div className="report-section-heading"><div><small>Crop records</small><h2>Sold versus expected yield by location</h2></div><HiOutlineScale aria-hidden="true" /></div>
          {cropReport.locations.length ? <CanvasJSChart options={chartOptions} /> : <p className="report-panel-empty">No crop records match these filters.</p>}
        </section>

        <section className="report-panel">
          <div className="report-section-heading"><div><small>Transaction details</small><h2>Paid marketplace purchases</h2></div><button type="button" className="report-print-button no-print" onClick={() => window.print()}><HiOutlineDocumentDownload aria-hidden="true" /> Print / Save PDF</button></div>
          <div className="report-table-wrap"><table className="report-table"><thead><tr><th>Transaction</th><th>Buyer</th><th>Product</th><th>Quantity</th><th>Price / kg</th><th>Total</th></tr></thead><tbody>{rows.map((row) => <tr key={row.key}><td>#{row.transactionId}</td><td>{row.buyer}</td><td>{row.product}</td><td>{number(row.kilograms)} kg</td><td>{money(row.pricePerKilo)}</td><td>{money(row.total)}</td></tr>)}</tbody></table>{!rows.length && <p className="report-panel-empty">No paid transactions match these filters.</p>}</div>
        </section>
      </div>}
    </main>
  );
}
