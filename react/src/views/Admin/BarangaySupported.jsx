import { useEffect, useState } from "react";
import { HiOutlineLocationMarker, HiOutlinePencil, HiOutlinePlus, HiOutlineSearch, HiOutlineX } from "react-icons/hi";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";
import { getBarangayRowNumber, normalizeBarangayName, validateBarangayName } from "./barangayDirectory.js";

const formatDate = (value) => value
  ? new Intl.DateTimeFormat("en-PH", { year: "numeric", month: "short", day: "numeric" }).format(new Date(value))
  : "Not available";

export default function BarangaySupported() {
  const { setNotification } = useStateContext();
  const [barangays, setBarangays] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 8, total: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [modal, setModal] = useState(null);
  const [name, setName] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadBarangays = async (page = currentPage, query = search) => {
    setLoading(true);
    setLoadError("");
    try {
      const { data } = await axiosClient.get("/supportedBarangay", { params: { page, search: query.trim() || undefined } });
      setBarangays(data.data || []);
      setMeta(data.meta || { current_page: page, last_page: 1, per_page: 8, total: 0 });
    } catch {
      setLoadError("Barangays could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => loadBarangays(currentPage, search), 250);
    return () => window.clearTimeout(timer);
  }, [currentPage, search]);

  const openAdd = () => { setModal({ mode: "add" }); setName(""); setFormError(""); };
  const openEdit = (barangay) => { setModal({ mode: "edit", barangay }); setName(barangay.supported_barangay); setFormError(""); };
  const closeModal = () => { if (!saving) { setModal(null); setFormError(""); } };

  const submitBarangay = async (event) => {
    event.preventDefault();
    const normalizedName = normalizeBarangayName(name);
    const validationMessage = validateBarangayName(normalizedName);
    if (validationMessage) return setFormError(validationMessage);

    setSaving(true);
    setFormError("");
    try {
      if (modal.mode === "edit") {
        await axiosClient.put(`/barangays/${modal.barangay.id}`, { supported_barangay: normalizedName });
        setNotification("Barangay updated successfully");
      } else {
        await axiosClient.post("/addBarangay", { supported_barangay: normalizedName });
        setNotification("Barangay added successfully");
        setCurrentPage(1);
      }
      setModal(null);
      await loadBarangays(modal.mode === "add" ? 1 : currentPage, search);
    } catch (error) {
      const errors = error.response?.data?.errors;
      setFormError(errors ? Object.values(errors).flat()[0] : "The barangay could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const changeSearch = (event) => { setSearch(event.target.value); setCurrentPage(1); };

  return (
    <main className="barangay-directory">
      <header className="barangay-hero">
        <div><span>Registration coverage</span><h1>Supported Barangays</h1><p>Manage the locations available to farmers and buyers during registration.</p></div>
        <div className="barangay-hero-stat"><HiOutlineLocationMarker aria-hidden="true" /><div><strong>{meta.total}</strong><small>{search ? "matching locations" : "active locations"}</small></div></div>
      </header>

      <section className="barangay-panel">
        <div className="barangay-toolbar">
          <div><small>Location directory</small><h2>Registration service areas</h2></div>
          <button type="button" className="barangay-add" onClick={openAdd}><HiOutlinePlus aria-hidden="true" /> Add barangay</button>
        </div>
        <div className="barangay-search">
          <HiOutlineSearch aria-hidden="true" />
          <input value={search} onChange={changeSearch} placeholder="Search barangays…" aria-label="Search barangays" />
          {search && <button type="button" onClick={() => { setSearch(""); setCurrentPage(1); }} aria-label="Clear search"><HiOutlineX /></button>}
        </div>

        {loadError && <div className="barangay-alert" role="alert">{loadError}<button type="button" onClick={() => loadBarangays()}>Retry</button></div>}
        {loading && <div className="barangay-loading" aria-live="polite"><span />Loading locations…</div>}

        {!loading && !loadError && barangays.length > 0 && <>
          <div className="barangay-table-wrap">
            <table className="barangay-table">
              <thead><tr><th>#</th><th>Barangay</th><th>Date added</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>{barangays.map((barangay, index) => <tr key={barangay.id}>
                <td>{getBarangayRowNumber(index, meta.current_page, meta.per_page)}</td>
                <td><span className="barangay-pin"><HiOutlineLocationMarker /></span><strong>{barangay.supported_barangay}</strong></td>
                <td>{formatDate(barangay.created_at)}</td>
                <td><button type="button" onClick={() => openEdit(barangay)}><HiOutlinePencil /> Edit</button></td>
              </tr>)}</tbody>
            </table>
          </div>

          <div className="barangay-cards">{barangays.map((barangay, index) => <article key={barangay.id}>
            <div className="barangay-card-number">{getBarangayRowNumber(index, meta.current_page, meta.per_page)}</div>
            <span className="barangay-pin"><HiOutlineLocationMarker /></span>
            <div><strong>{barangay.supported_barangay}</strong><small>Added {formatDate(barangay.created_at)}</small></div>
            <button type="button" onClick={() => openEdit(barangay)} aria-label={`Edit ${barangay.supported_barangay}`}><HiOutlinePencil /></button>
          </article>)}</div>

          <footer className="barangay-pagination">
            <p>Showing {(meta.current_page - 1) * meta.per_page + 1}–{Math.min(meta.current_page * meta.per_page, meta.total)} of {meta.total}</p>
            <div><button type="button" disabled={meta.current_page <= 1} onClick={() => setCurrentPage((page) => page - 1)}>Previous</button><span>Page {meta.current_page} of {meta.last_page}</span><button type="button" disabled={meta.current_page >= meta.last_page} onClick={() => setCurrentPage((page) => page + 1)}>Next</button></div>
          </footer>
        </>}

        {!loading && !loadError && barangays.length === 0 && <div className="barangay-empty"><HiOutlineLocationMarker /><h3>{search ? "No matching barangays" : "No barangays yet"}</h3><p>{search ? "Try a different search term." : "Add the first supported registration location."}</p>{!search && <button type="button" onClick={openAdd}>Add barangay</button>}</div>}
      </section>

      {modal && <div className="barangay-modal-layer" role="dialog" aria-modal="true" aria-labelledby="barangay-modal-title">
        <button className="barangay-modal-backdrop" type="button" onClick={closeModal} aria-label="Close dialog" />
        <form className="barangay-modal" onSubmit={submitBarangay}>
          <header><div className="barangay-pin"><HiOutlineLocationMarker /></div><div><small>{modal.mode === "edit" ? "Update location" : "New location"}</small><h2 id="barangay-modal-title">{modal.mode === "edit" ? "Edit barangay" : "Add supported barangay"}</h2></div><button type="button" onClick={closeModal} aria-label="Close"><HiOutlineX /></button></header>
          <div className="barangay-modal-body"><label htmlFor="barangay-name">Barangay name</label><input id="barangay-name" value={name} onChange={(event) => { setName(event.target.value); setFormError(""); }} placeholder="e.g. Capitan Juan" autoFocus maxLength={25} /><div className="barangay-field-meta"><span>Use the official barangay name</span><span>{normalizeBarangayName(name).length}/25</span></div>{formError && <p role="alert">{formError}</p>}</div>
          <footer><button type="button" onClick={closeModal} disabled={saving}>Cancel</button><button type="submit" disabled={saving}>{saving ? "Saving…" : modal.mode === "edit" ? "Save changes" : "Add barangay"}</button></footer>
        </form>
      </div>}
    </main>
  );
}
