import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";

const tabs = [
  ["all", "All"], ["pending", "To confirm"], ["receive", "To receive"], ["completed", "Completed"], ["cancelled", "Cancelled"],
];

function orderStatus(order) {
  if (Number(order.price_of_goods) === -1) return "cancelled";
  if (order.payed_on) return "completed";
  if (order.price_payed !== null) return "receive";
  return "pending";
}

const statusCopy = {
  pending: ["Order placed", "The seller is preparing your farm order."],
  receive: ["Out for delivery", "Check the items, then confirm when received."],
  completed: ["Completed", "Thank you for supporting a local grower!"],
  cancelled: ["Cancelled", "This order was cancelled and its kilos were returned."],
};

function productImage(detail) {
  const product = detail.product_ordered;
  if (!product?.product_picture) return "/logo.jpg";
  return `${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}/storage/Farms/${product.farm_belonged}/${product.product_picture}`;
}

export default function BuyerOrders() {
  const { currentUserID, setNotification } = useStateContext();
  const location = useLocation();
  const isBuyerSeller = location.pathname.startsWith("/buyer-seller");
  const shopPath = isBuyerSeller ? "/buyer-seller/role/buyer" : "/buyer/order/products";
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(null);
  const [confirming, setConfirming] = useState(null);

  const loadOrders = () => {
    setLoading(true); setError("");
    axiosClient.post("/getOrders", { user_ID: currentUserID })
      .then(({ data }) => setOrders((data.userPendingOrders || []).flatMap((user) => user.transactions || [])))
      .catch(() => setError("We couldn’t load your orders. Please try again."))
      .finally(() => setLoading(false));
  };
  useEffect(loadOrders, [currentUserID]);

  const visible = useMemo(() => orders.filter((order) => activeTab === "all" || orderStatus(order) === activeTab), [orders, activeTab]);
  const count = (status) => status === "all" ? orders.length : orders.filter((order) => orderStatus(order) === status).length;

  const cancelOrder = async (id) => {
    if (!window.confirm("Cancel this order? Reserved kilos will be returned to the product listing.")) return;
    setCancelling(id);
    try { await axiosClient.post(`/cancelOrder/${id}`); setNotification("Order cancelled successfully."); loadOrders(); }
    catch { setError("This order could not be cancelled."); }
    finally { setCancelling(null); }
  };

  const confirmReceived = async (id) => {
    setConfirming(id);
    try { await axiosClient.post(`/confirmOrder/${id}`); setNotification("Order marked as received. Thank you!"); loadOrders(); }
    catch { setError("We couldn’t confirm this delivery. Please try again."); }
    finally { setConfirming(null); }
  };

  return (
    <div className="buyer-orders">
      <section className="orders-banner"><div><small>My purchases</small><h1>Your farm orders</h1><p>Track every order from checkout to delivery.</p></div><span>📦</span></section>
      <nav className="order-tabs">{tabs.map(([id, label]) => <button key={id} onClick={() => setActiveTab(id)} className={activeTab === id ? "active" : ""}>{label}{count(id) > 0 && <span>{count(id)}</span>}</button>)}</nav>
      {error && <div className="orders-error">{error}<button onClick={loadOrders}>Try again</button></div>}
      {loading ? <div className="orders-loading">{[1,2,3].map((item) => <div key={item} />)}</div> : !visible.length ? <div className="orders-empty"><span>🧺</span><h2>No orders here yet</h2><p>Fresh produce from verified farms is waiting for you.</p><Link to={shopPath}>Shop fresh harvests</Link></div> : <div className="order-list">{visible.map((order) => {
        const status = orderStatus(order);
        const [label, description] = statusCopy[status];
        const details = order.transaction_detail || [];
        const farm = details[0]?.product_ordered?.farm;
        return <article className="order-card" key={order.id}>
          <header><div><span className="order-shop-icon">🌿</span><b>{farm?.farm_name || "E-Tabo local farm"}</b><small>Order #{String(order.id).padStart(6, "0")}</small></div><strong className={`status-${status}`}>{label}</strong></header>
          <div className="order-products">{details.map((detail) => <div className="order-product" key={detail.id}><img src={productImage(detail)} alt={detail.product_name} /><div><b>{detail.product_name}</b><span>Variety: {detail.variety || "Farm selection"}</span><small>{detail.kg_purchased} kg × ₱{Number(detail.price_per_kilo).toFixed(2)}</small></div><strong>₱{(Number(detail.kg_purchased) * Number(detail.price_per_kilo)).toFixed(2)}</strong></div>)}</div>
          <footer><div className="order-status-copy"><span>✓</span><div><b>{label}</b><small>{description}</small></div></div><div className="order-total"><span>Order total</span><b>₱{Math.max(0, Number(order.price_of_goods)).toFixed(2)}</b></div><div className="order-actions">{status === "pending" && <button disabled={cancelling === order.id} className="order-btn-muted" onClick={() => cancelOrder(order.id)}>{cancelling === order.id ? "Cancelling…" : "Cancel order"}</button>}{status === "receive" && <button disabled={confirming === order.id} className="order-btn-primary" onClick={() => confirmReceived(order.id)}>{confirming === order.id ? "Confirming…" : "Order received"}</button>}{status === "completed" && <Link className="order-btn-primary" to={shopPath}>Buy again</Link>}<Link className="order-btn-outline" to={shopPath}>View shop</Link></div></footer>
        </article>;
      })}</div>}
    </div>
  );
}
