import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";
import UiIcon from "../UiIcon.jsx";

const imageUrl = (item) => `${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}/storage/Farms/${item.farmId}/${item.image}`;

export default function CartDrawer({ open, onClose }) {
  const { cart, updateCartQuantity, removeFromCart } = useStateContext();
  const [products, setProducts] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const refreshAvailability = () => {
    setMessage("");
    return axiosClient.get("/products")
      .then(({ data }) => setProducts(data.products || []))
      .catch(() => setMessage("Could not refresh availability. Please try again."));
  };

  useEffect(() => { if (open) refreshAvailability(); }, [open]);

  const live = useMemo(() => new Map((products || []).map((product) => [product.id, product])), [products]);
  const statusFor = (item) => {
    if (products === null) return { available: item.available, soldOut: false, limited: false };
    const product = live.get(item.id);
    const available = product ? Math.max(0, Number(product.prospect_harvest_in_kg) - Number(product.actual_sold_kg)) : 0;
    return { available, soldOut: available <= 0, limited: available > 0 && item.quantity > available };
  };
  const ready = cart.filter((item) => { const status = statusFor(item); return !status.soldOut && !status.limited; });
  const total = ready.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const checkout = async () => {
    if (!ready.length) return;
    setCheckingOut(true); setMessage("");
    try {
      await axiosClient.post("/checkout", { items: ready.map((item) => ({ product_id: item.id, kg: item.quantity })) });
      ready.forEach((item) => removeFromCart(item.id));
      window.dispatchEvent(new CustomEvent("etabo:products-updated"));
      onClose();
      navigate(window.location.pathname.startsWith("/buyer-seller") ? "/buyer-seller/orders" : "/buyer/orders");
    } catch (error) {
      const errors = error.response?.data?.errors;
      setMessage(errors ? Object.values(errors).flat()[0] : "Checkout failed. Please refresh and try again.");
      await refreshAvailability();
    } finally { setCheckingOut(false); }
  };

  if (!open) return null;
  return (
    <div className="cart-layer">
      <button className="cart-backdrop" onClick={onClose} aria-label="Close cart" />
      <aside className="cart-drawer" aria-label="Shopping cart">
        <div className="cart-head"><div><span>Your basket</span><small>{cart.length} product{cart.length === 1 ? "" : "s"}</small></div><button onClick={onClose}>×</button></div>
        {message && <div className="cart-message">{message}</div>}
        <div className="cart-items">
          {!cart.length ? <div className="cart-empty"><span>🧺</span><b>Your basket is empty</b><p>Add fresh produce and it will appear here.</p><button onClick={onClose}>Continue shopping</button></div> : cart.map((item) => {
            const status = statusFor(item);
            return <article key={item.id} className={`cart-item ${status.soldOut ? "cart-item-sold" : ""}`}>
              <div className="cart-item-image"><img src={imageUrl(item)} alt={item.name} />{status.soldOut && <span>Sold out</span>}</div>
              <div className="cart-item-copy"><small>{item.farmName}</small><b>{item.name}</b><strong>₱{item.price.toFixed(2)}<em>/kg</em></strong>
                {status.limited && <p className="cart-warning">Only {status.available} kg remains. Update the quantity.</p>}
                {status.soldOut ? <p className="cart-warning">This harvest is no longer available.</p> : <div className="cart-qty"><button onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}>−</button><input value={item.quantity} onChange={(event) => updateCartQuantity(item.id, Math.min(status.available, Math.max(1, Number(event.target.value))))} inputMode="numeric" /><button disabled={item.quantity >= status.available} onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>+</button><span>kg</span></div>}
              </div>
              <button className="cart-remove" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name}`}>×</button>
            </article>;
          })}
        </div>
        {!!cart.length && <div className="cart-footer"><div><span>Checkout total</span><b>₱{total.toFixed(2)}</b></div>{ready.length < cart.length && <p>Unavailable products will stay in your basket and won’t be charged.</p>}<button disabled={!ready.length || checkingOut} onClick={checkout}>{checkingOut ? "Checking availability…" : `Checkout ${ready.length} product${ready.length === 1 ? "" : "s"}`}</button></div>}
      </aside>
    </div>
  );
}
