import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../axios-client.js";

const money = (value) => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(Number(value || 0));
const number = (value) => new Intl.NumberFormat("en-PH", { maximumFractionDigits: 0 }).format(Number(value || 0));

export default function Dashboard() {
  const [users, setUsers] = useState({ userAll: 0, pendingUser: 0, activeUser: 0 });
  const [insights, setInsights] = useState({ summary: {}, sales_trend: [], categories: [], locations: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([axiosClient.get("/usercount"), axiosClient.get("/admin/dashboard/insights")])
      .then(([userResponse, insightResponse]) => { setUsers(userResponse.data || {}); setInsights(insightResponse.data || {}); })
      .finally(() => setLoading(false));
  }, []);

  const maxSales = useMemo(() => Math.max(1, ...insights.sales_trend.map((item) => Number(item.sales || 0))), [insights.sales_trend]);
  const maxFarms = useMemo(() => Math.max(1, ...insights.locations.map((item) => Number(item.farms || 0))), [insights.locations]);
  const summary = insights.summary || {};

  const metrics = [
    { label: "Active listings", value: number(summary.active_listings), note: `${number(summary.available_kg)} kg available`, tone: "green", to: "/admin/products/approved" },
    { label: "Marketplace sales", value: money(summary.sales), note: `${number(summary.orders)} total orders`, tone: "emerald", to: "/admin/report/generate" },
    { label: "Produce sold", value: `${number(summary.sold_kg)} kg`, note: "Across approved listings", tone: "lime", to: "/admin/report/generate" },
    { label: "Registered farms", value: number(summary.farms), note: `${number(users.userAll)} platform users`, tone: "teal", to: "/admin/farmers/profile" },
  ];

  return (
    <div className="admin-page admin-dashboard">
      <header className="admin-page-head admin-dashboard-head">
        <div><span className="admin-eyebrow">Live marketplace overview</span><h1>Good day, DA Administrator</h1><p>Listings, sales, supply, and account activity in one compact view.</p></div>
        <div className="admin-dashboard-badges"><span><i className="online" />{users.activeUser || 0} active users</span><Link to="/admin/users/all">{users.pendingUser || 0} need review →</Link></div>
      </header>

      <div className="admin-metric-grid">
        {metrics.map((item) => <Link key={item.label} to={item.to} className={`admin-metric-card ${item.tone}`}><span>{item.label}</span><b>{loading ? "—" : item.value}</b><small>{item.note}</small></Link>)}
      </div>

      <div className="admin-insight-grid">
        <section className="admin-panel admin-chart-panel">
          <div className="admin-panel-head"><div><h2>Sales trend</h2><p>Order value recorded over the last six months</p></div><strong>{money(summary.sales)}</strong></div>
          <div className="admin-sales-chart" aria-label="Six month sales bar chart">
            {insights.sales_trend.map((item) => <div className="admin-sales-column" key={item.label}><span className="admin-chart-value">{item.sales ? money(item.sales) : "—"}</span><div><i style={{ height: `${Math.max(item.sales ? 8 : 2, (Number(item.sales || 0) / maxSales) * 100)}%` }} /></div><b>{item.label}</b><small>{item.orders} orders</small></div>)}
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-head"><div><h2>User verification</h2><p>Current account health</p></div><Link to="/admin/users/all">Manage</Link></div>
          <div className="admin-user-overview">
            <div className="admin-donut" style={{ "--progress": `${users.userAll ? ((users.userAll - users.pendingUser) / users.userAll) * 100 : 0}%` }}><span><b>{users.userAll ? Math.round(((users.userAll - users.pendingUser) / users.userAll) * 100) : 0}%</b><small>verified</small></span></div>
            <dl><div><dt>Total users</dt><dd>{users.userAll || 0}</dd></div><div><dt>Verified</dt><dd>{Math.max(0, (users.userAll || 0) - (users.pendingUser || 0))}</dd></div><div><dt>Pending review</dt><dd className="text-amber-600">{users.pendingUser || 0}</dd></div><div><dt>Online now</dt><dd>{users.activeUser || 0}</dd></div></dl>
          </div>
        </section>
      </div>

      <div className="admin-insight-grid lower">
        <section className="admin-panel">
          <div className="admin-panel-head"><div><h2>Supply by crop</h2><p>Available and sold kilograms</p></div><Link to="/admin/products/approved">Listings</Link></div>
          <div className="admin-crop-list">
            {insights.categories.map((item) => { const total = Number(item.available_kg) + Number(item.sold_kg); const sold = total ? (Number(item.sold_kg) / total) * 100 : 0; return <div key={item.name}><header><span><b>{item.name}</b><small>{item.listings} listings</small></span><strong>{number(item.available_kg)} kg available</strong></header><div className="admin-progress"><i style={{ width: `${sold}%` }} /></div><footer><span>{number(item.sold_kg)} kg sold</span><span>{Math.round(sold)}% moved</span></footer></div>; })}
            {!loading && insights.categories.length === 0 && <div className="admin-empty">No approved listings yet.</div>}
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-head"><div><h2>Farm coverage</h2><p>Profiles by barangay</p></div><Link to="/admin/farmers/profile">Directory</Link></div>
          <div className="admin-location-list">{insights.locations.slice(0, 7).map((item) => <div key={item.name}><span>{item.name}</span><div><i style={{ width: `${(Number(item.farms) / maxFarms) * 100}%` }} /></div><b>{item.farms}</b></div>)}</div>
        </section>
      </div>
    </div>
  );
}
