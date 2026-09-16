import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../axios-client.js";

const apiBase = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
const barangayOf = (location = "") => location.split(",")[0].trim() || "Unspecified";

export default function FarmersProfile() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axiosClient.get("/admin/farmers/profile")
      .then(({ data }) => setFarms(Array.isArray(data) ? data : []))
      .catch(() => setFarms([]))
      .finally(() => setLoading(false));
  }, []);

  const locations = useMemo(() => [...new Set(farms.map((farm) => barangayOf(farm.farm_location)))].sort(), [farms]);
  const filtered = useMemo(() => farms.filter((farm) => {
    const locationMatch = location === "all" || barangayOf(farm.farm_location) === location;
    const needle = search.trim().toLowerCase();
    const text = `${farm.farm_name || ""} ${farm.user?.name || ""} ${farm.farm_location || ""}`.toLowerCase();
    return locationMatch && (!needle || text.includes(needle));
  }), [farms, location, search]);

  const productCount = farms.reduce((sum, farm) => sum + (farm.products?.length || 0), 0);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div><span className="admin-eyebrow">Farmer directory</span><h1>Farms and grower profiles</h1><p>Review verified farms from every supported Lantapan barangay.</p></div>
        <div className="admin-head-stats"><span><b>{farms.length}</b> farms</span><span><b>{locations.length}</b> locations</span><span><b>{productCount}</b> listings</span></div>
      </header>

      <section className="admin-panel">
        <div className="admin-toolbar">
          <label><span>Location</span><select value={location} onChange={(event) => setLocation(event.target.value)}><option value="all">All locations</option>{locations.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="admin-search"><span>Search</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Farm or farmer name" /></label>
          <div className="admin-result-count"><b>{filtered.length}</b><span>profiles shown</span></div>
        </div>

        {loading ? <div className="admin-empty">Loading farmer profiles…</div> : filtered.length === 0 ? <div className="admin-empty"><b>No farmer profiles found</b><span>Try another location or search term.</span></div> : (
          <div className="admin-farm-grid">
            {filtered.map((farm) => (
              <Link to={`/admin/farm/${farm.id}`} className="admin-farm-card" key={farm.id}>
                <div className="admin-farm-image"><img src={`${apiBase}/storage/Farms/${farm.farm_pictures}`} alt={farm.farm_name} /><span>{barangayOf(farm.farm_location)}</span></div>
                <div className="admin-farm-copy">
                  <div><small>{farm.is_verified ? "Verified grower" : "Pending verification"}</small><h2>{farm.farm_name}</h2></div>
                  <p>{farm.farm_info || "No farm description provided."}</p>
                  <dl><div><dt>Farmer</dt><dd>{farm.user?.name || "Unknown"}</dd></div><div><dt>Farm size</dt><dd>{farm.farm_hectares} ha</dd></div><div><dt>Listings</dt><dd>{farm.products?.length || 0}</dd></div></dl>
                  <span className="admin-card-link">View complete profile →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
