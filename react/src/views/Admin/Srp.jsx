import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import axiosClient from "../../axios-client";
import { validatePriceRange } from "./priceControl.js";

const COMMODITIES = [
  { value: "Brocollis", label: "Broccoli", icon: "🥦", tone: "broccoli" },
  { value: "Carrots", label: "Carrots", icon: "🥕", tone: "carrot" },
  { value: "Cabbages", label: "Cabbage", icon: "🥬", tone: "cabbage" },
  { value: "Tomatoes", label: "Tomatoes", icon: "🍅", tone: "tomato" },
];

const peso = (value) => new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
}).format(Number(value || 0));

export default function Srp() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const [formData, setFormData] = useState({ product_type: "", min: "", max: "" });

  const loadPrices = () => axiosClient.get("/getPriceRange")
    .then(({ data }) => setPrices(Array.isArray(data) ? data : []))
    .catch(() => setPrices([]))
    .finally(() => setLoading(false));

  useEffect(() => { loadPrices(); }, []);

  const pricesByCommodity = useMemo(() => Object.fromEntries(prices.map((item) => [item.product_name, item])), [prices]);
  const validationError = validatePriceRange(formData.min, formData.max);
  const canSubmit = formData.product_type && formData.min !== "" && formData.max !== "" && !validationError && !saving;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setServerError("");
  };

  const selectCommodity = (commodity) => {
    const currentPrice = pricesByCommodity[commodity.value];
    setFormData({
      product_type: commodity.value,
      min: currentPrice?.min ?? "",
      max: currentPrice?.max ?? "",
    });
    setServerError("");
    window.requestAnimationFrame(() => document.getElementById("price-control-form")?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };

  const resetForm = () => {
    setFormData({ product_type: "", min: "", max: "" });
    setServerError("");
  };

  const savePriceRange = async (event) => {
    event.preventDefault();
    const error = validatePriceRange(formData.min, formData.max);
    if (error) { setServerError(error); return; }

    setSaving(true);
    setServerError("");
    try {
      await axiosClient.post("/priceRange", formData);
      await loadPrices();
      await Swal.fire({ icon: "success", title: "Price range updated", text: "The new floor and ceiling prices are now active.", confirmButtonColor: "#15803d" });
    } catch (errorResponse) {
      const message = errorResponse.response?.data?.errors?.max?.[0]
        || errorResponse.response?.data?.message
        || "The price range could not be saved. Please review the values and try again.";
      setServerError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page price-control-page">
      <header className="admin-page-head price-control-head">
        <div><span className="admin-eyebrow">Market safeguards</span><h1>Suggested retail price control</h1><p>Maintain fair price floors and ceilings for Lantapan’s priority vegetables.</p></div>
        <div className="price-control-head-note"><span>DA guidance</span><b>4 monitored crops</b><small>Prices shown per kilogram</small></div>
      </header>

      <section className="price-control-summary">
        <div className="price-control-section-head"><div><h2>Current price guidance</h2><p>Select a commodity card to update its range.</p></div><span className="price-live"><i /> Live pricing</span></div>
        <div className="price-card-grid">
          {COMMODITIES.map((commodity) => {
            const price = pricesByCommodity[commodity.value];
            return <button type="button" onClick={() => selectCommodity(commodity)} key={commodity.value} className={`price-card ${commodity.tone} ${formData.product_type === commodity.value ? "selected" : ""}`}>
              <div className="price-card-top"><span className="price-card-icon">{commodity.icon}</span><span className="price-card-status">{price ? "Published" : "Not set"}</span></div>
              <h3>{commodity.label}</h3>
              {loading ? <div className="price-card-skeleton" /> : <div className="price-card-range"><div><small>Price floor</small><b>{peso(price?.min)}</b></div><span>to</span><div><small>Price ceiling</small><b>{peso(price?.max)}</b></div></div>}
              <footer><span>{price ? `₱${Number(price.max) - Number(price.min)} range` : "Awaiting price range"}</span><strong>Edit prices →</strong></footer>
            </button>;
          })}
        </div>
      </section>

      <section id="price-control-form" className="price-control-editor admin-panel">
        <div className="price-editor-aside">
          <span className="price-editor-icon">₱</span>
          <span className="admin-eyebrow">Update guidance</span>
          <h2>Set a responsible price range</h2>
          <p>Enter the recommended minimum and maximum retail price per kilogram. The ceiling must always be higher than the floor.</p>
          <div><span>✓</span><p><b>Immediate publishing</b><small>Saved values refresh on this page right away.</small></p></div>
          <div><span>✓</span><p><b>Protected ranges</b><small>Invalid or reversed price ranges are rejected.</small></p></div>
        </div>

        <form onSubmit={savePriceRange} className="price-editor-form" noValidate>
          <div className="price-form-heading"><div><h2>Price details</h2><p>All amounts are Philippine pesos per kilogram.</p></div>{formData.product_type && <span>Editing {COMMODITIES.find((item) => item.value === formData.product_type)?.label}</span>}</div>

          <label className="price-field full"><span>Commodity</span><select name="product_type" value={formData.product_type} onChange={handleChange} required><option value="">Select a commodity</option>{COMMODITIES.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select><small>Choose one of the supported priority crops.</small></label>

          <div className="price-input-grid">
            <label className="price-field"><span>Minimum price</span><div className="price-money-input"><i>₱</i><input type="number" min="0" step="0.01" inputMode="decimal" name="min" value={formData.min} onChange={handleChange} placeholder="0.00" required /></div><small>The recommended price floor.</small></label>
            <label className={`price-field ${validationError ? "invalid" : ""}`}><span>Maximum price</span><div className="price-money-input"><i>₱</i><input type="number" min="0.01" step="0.01" inputMode="decimal" name="max" value={formData.max} onChange={handleChange} placeholder="0.00" required /></div><small>The maximum permitted guidance.</small></label>
          </div>

          {(validationError || serverError) && <div className="price-form-error" role="alert"><span>!</span><p>{serverError || validationError}</p></div>}

          <div className="price-form-preview"><span>Published range</span><b>{formData.min === "" ? "₱0.00" : peso(formData.min)} <i>—</i> {formData.max === "" ? "₱0.00" : peso(formData.max)}</b></div>

          <div className="price-form-actions"><button type="button" className="app-btn-secondary" onClick={resetForm} disabled={saving}>Clear form</button><button type="submit" className="app-btn-primary" disabled={!canSubmit}>{saving ? "Saving price range…" : "Save and publish"}</button></div>
        </form>
      </section>
    </div>
  );
}
