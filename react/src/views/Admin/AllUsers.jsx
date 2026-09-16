import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axiosClient from "../../axios-client.js";
import { Pagination, Spinner } from "../../components/ui/TailwindUI.jsx";

const roleNames = { 0: "Buyer", 1: "Seller", 2: "Buyer & seller" };

export default function Users() {
  const { pathname } = useLocation();
  const routeStatus = pathname.includes("/pending") ? "pending" : pathname.includes("/verified") ? "verified" : "all";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(routeStatus);
  const [role, setRole] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ last_page: 1, total: 0 });

  useEffect(() => {
    setStatus(routeStatus);
    setPage(1);
  }, [routeStatus]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(true);
      const params = { page, status: status === "all" ? undefined : status, role: role === "all" ? undefined : role, search: search.trim() || undefined };
      axiosClient.get("/allUsers/allUsers", { params })
        .then(({ data }) => { setUsers(data.data || []); setMeta(data.meta || { last_page: 1, total: 0 }); })
        .catch(() => { setUsers([]); setMeta({ last_page: 1, total: 0 }); })
        .finally(() => setLoading(false));
    }, 220);
    return () => window.clearTimeout(timer);
  }, [page, status, role, search]);

  const changeFilter = (setter) => (event) => { setter(event.target.value); setPage(1); };

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div><span className="admin-eyebrow">Account management</span><h1>Marketplace users</h1><p>One directory for buyers, sellers, and accounts awaiting verification.</p></div>
        <div className="admin-head-stats"><span><b>{meta.total || 0}</b> matching users</span></div>
      </header>

      <section className="admin-panel">
        <div className="admin-toolbar">
          <label><span>Account status</span><select value={status} onChange={changeFilter(setStatus)}><option value="all">All statuses</option><option value="verified">Verified</option><option value="pending">Pending verification</option><option value="active">Currently active</option><option value="inactive">Inactive</option></select></label>
          <label><span>User role</span><select value={role} onChange={changeFilter(setRole)}><option value="all">All roles</option><option value="0">Buyers</option><option value="1">Sellers</option><option value="2">Buyer & sellers</option></select></label>
          <label className="admin-search"><span>Search</span><input value={search} onChange={changeFilter(setSearch)} placeholder="Name, mobile, email or address" /></label>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>User</th><th>Role</th><th>Contact</th><th>Address</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="6"><div className="admin-loading"><Spinner size="lg" /> Loading users…</div></td></tr> : users.length === 0 ? <tr><td colSpan="6"><div className="admin-empty"><b>No users match these filters</b><span>Adjust the status, role, or search term.</span></div></td></tr> : users.map((item) => (
                <tr key={item.id}>
                  <td><div className="admin-user-cell"><span>{item.name?.slice(0, 1)}</span><div><b>{item.name}</b><small>ID #{item.id} · {item.birthday || "Birthday not set"}</small></div></div></td>
                  <td><span className="admin-role-chip">{roleNames[item.user_type] || "User"}</span></td>
                  <td><b className="admin-cell-main">{item.mobile_number || "—"}</b><small className="admin-cell-sub">{item.email || "No email"}</small></td>
                  <td className="admin-address">{item.address || "No address supplied"}</td>
                  <td><div className="admin-status-stack"><span className={`admin-status ${item.is_verified ? "verified" : "pending"}`}>{item.is_verified ? "Verified" : "Pending"}</span><small>{item.is_active ? "Online now" : "Offline"}</small></div></td>
                  <td><Link className="admin-row-action" to={item.is_verified ? `/admin/users/view/${item.id}` : `/admin/pending/user/${item.id}`}>{item.is_verified ? "View" : "Review"} →</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="admin-pagination"><span>Page {page} of {meta.last_page || 1}</span><Pagination currentPage={page} totalPages={meta.last_page || 1} onPageChange={setPage} showIcons /></div>
      </section>
    </div>
  );
}
