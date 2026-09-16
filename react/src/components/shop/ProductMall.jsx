import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";

const CATEGORIES = [
  { id: "all", label: "All harvests", emoji: "🧺", match: null },
  { id: "broccoli", label: "Broccoli", emoji: "🥦", match: "Brocollis" },
  { id: "cabbage", label: "Cabbage", emoji: "🥬", match: "Cabbages" },
  { id: "carrot", label: "Carrot", emoji: "🥕", match: "Carrots" },
  { id: "tomato", label: "Tomato", emoji: "🍅", match: "Tomatoes" },
];

export function productImage(product) {
  const base = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
  if (!product?.product_picture) return "/logo.jpg";
  return `${base}/storage/Farms/${product.farm_belonged}/${product.product_picture}`;
}

function kilosLeft(product) {
  return Math.max(0, (product.prospect_harvest_in_kg || 0) - (product.actual_sold_kg || 0));
}

export default function ProductMall() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("latest");
  const [selected, setSelected] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [modalMessage, setModalMessage] = useState("");
  const { cart, addToCart, setNotification } = useStateContext();

  const loadProducts = () => axiosClient
    .get("/products")
    .then((response) => setProducts(response.data.products || []))
    .catch(() => setProducts([]))
    .finally(() => setLoading(false));

  useEffect(() => {
    loadProducts();
    const refresh = () => loadProducts();
    window.addEventListener("etabo:products-updated", refresh);
    return () => window.removeEventListener("etabo:products-updated", refresh);
  }, []);

  useEffect(() => {
    const onSearch = (e) => setQuery(e.detail || "");
    window.addEventListener("etabo:search", onSearch);
    return () => window.removeEventListener("etabo:search", onSearch);
  }, []);

  const filtered = useMemo(() => {
    const cat = CATEGORIES.find((c) => c.id === category);
    const result = products.filter((p) => {
      const typeOk = !cat?.match || p.product_type === cat.match;
      const q = query.trim().toLowerCase();
      const text = `${p.product_name || ""} ${p.farm?.farm_name || ""} ${p.farm?.farm_location || ""}`.toLowerCase();
      return typeOk && (!q || text.includes(q));
    });
    if (sort === "low") return [...result].sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "high") return [...result].sort((a, b) => Number(b.price) - Number(a.price));
    return result;
  }, [products, category, query, sort]);

  const openProduct = (product) => {
    setSelected(product); setQuantity(1); setModalMessage("");
  };

  const addSelected = () => {
    const available = kilosLeft(selected);
    const alreadyInCart = cart.find((item) => item.id === selected.id)?.quantity || 0;
    if (Number(quantity) + Number(alreadyInCart) > available) {
      setModalMessage(`Only ${available} kg is available, with ${alreadyInCart} kg already in your basket.`);
      return;
    }
    addToCart(selected, quantity, available);
    setNotification(`${quantity} kg of ${selected.product_name} added to your basket.`);
    setSelected(null);
  };

  return (
    <div className="pb-10">
      <section className="market-hero">
        <div className="market-hero-copy">
          <small>Fresh from Lantapan</small>
          <h1>Farm-fresh goodness, one tap away.</h1>
          <p>Order directly from verified local growers. Fair prices, clear harvest details, and produce that supports our community.</p>
          <div className="market-hero-actions"><a href="#fresh-picks">Shop fresh picks</a><a href="#categories">Browse categories</a></div>
        </div>
        <div className="market-hero-art" aria-hidden="true">🧺</div>
      </section>

      <section id="categories" className="market-section">
        <div className="market-section-head"><div><h2>Browse categories</h2><p>Find today’s available harvest</p></div><span className="text-xs font-semibold text-shop-500">{products.length} listings</span></div>
        <div className="grid grid-cols-3 gap-px bg-stone-100 sm:grid-cols-5">
          {CATEGORIES.map((c) => (
            <button key={c.id} type="button" onClick={() => setCategory(c.id)} className={`group flex min-h-[94px] flex-col items-center justify-center gap-2 bg-white px-2 py-3 transition hover:bg-shop-50 ${category === c.id ? "text-shop-600 shadow-[inset_0_-3px_#16a34a]" : "text-stone-600"}`}>
              <span className="text-3xl transition group-hover:-translate-y-1">{c.emoji}</span><span className="text-[11px] font-semibold sm:text-xs">{c.label}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="mt-4 grid grid-cols-3 divide-x divide-stone-200 rounded-md border border-stone-200 bg-white py-3 text-center shadow-sm">
        <div><b className="block text-xs text-stone-800">Verified farms</b><span className="text-[10px] text-stone-500">Trusted local growers</span></div>
        <div><b className="block text-xs text-stone-800">DA price guide</b><span className="text-[10px] text-stone-500">Fair market pricing</span></div>
        <div><b className="block text-xs text-stone-800">Fresh harvest</b><span className="text-[10px] text-stone-500">Availability by kilo</span></div>
      </div>

      <section id="fresh-picks" className="market-section overflow-hidden">
        <div className="market-section-head">
          <div><h2>Fresh picks for you</h2><p>{query ? `Results for “${query}”` : "Harvested and listed by nearby farmers"}</p></div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-9 rounded border border-stone-200 bg-white px-2 text-xs text-stone-600 outline-none focus:border-shop-500"><option value="latest">Latest</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select>
        </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-px bg-stone-100 p-px sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse bg-white" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-14 text-center text-sm text-mall-mute">
          <span className="mb-3 block text-5xl">🧺</span>No produce matches that filter yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-px bg-stone-100 p-px sm:grid-cols-3 lg:grid-cols-5">
          {filtered.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => openProduct(product)}
              className="group relative z-0 flex flex-col overflow-hidden bg-white transition hover:z-10 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="relative aspect-square overflow-hidden bg-shop-50">
                <img
                  src={productImage(product)}
                  alt={product.product_name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute left-2 top-2 rounded-sm bg-shop-500 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white">
                  Fresh · {kilosLeft(product)} kg left
                </span>
              </div>
              <div className="flex flex-1 flex-col p-3">
                <p className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-mall-ink">
                  {product.product_name}
                </p>
                <p className="mt-1 line-clamp-1 text-[11px] text-mall-mute">
                  📍 {product.farm?.farm_name} · {product.farm?.farm_location}
                </p>
                <div className="mt-auto flex items-end justify-between pt-2">
                  <p className="text-lg font-bold text-shop-500">
                    ₱{product.price}
                    <span className="text-[11px] font-medium text-mall-mute">/kg</span>
                  </p>
                  <span className="text-[9px] text-mall-mute">{product.farm?.user?.name}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      </section>
      {selected && <div className="product-modal-layer" role="dialog" aria-modal="true" aria-label={`Buy ${selected.product_name}`}>
        <button className="product-modal-backdrop" onClick={() => setSelected(null)} aria-label="Close product" />
        <div className="product-modal">
          <button className="product-modal-close" onClick={() => setSelected(null)}>×</button>
          <div className="product-modal-image"><img src={productImage(selected)} alt={selected.product_name} /><span>Fresh harvest</span></div>
          <div className="product-modal-copy"><small>{selected.farm?.farm_name} · {selected.farm?.farm_location}</small><h2>{selected.product_name}</h2><p className="product-modal-variety">{selected.variety || "Local"} variety · Sold by {selected.farm?.user?.name || "Verified farmer"}</p><strong>₱{Number(selected.price).toFixed(2)}<em>/kg</em></strong>
            <div className="product-availability"><span>{kilosLeft(selected)} kg available</span><i>{cart.find((item) => item.id === selected.id)?.quantity || 0} kg in basket</i></div>
            <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg border border-shop-100 bg-shop-50/60 p-3 text-xs sm:grid-cols-3">
              <div><span className="block text-stone-500">Produce type</span><b className="mt-1 block text-stone-800">{selected.product_type || "Vegetable"}</b></div>
              <div><span className="block text-stone-500">Planted</span><b className="mt-1 block text-stone-800">{selected.planted_date || "Not provided"}</b></div>
              <div><span className="block text-stone-500">Expected harvest</span><b className="mt-1 block text-stone-800">{selected.prospect_harvest_date || selected.harvested_date || "Available now"}</b></div>
              <div><span className="block text-stone-500">Harvest volume</span><b className="mt-1 block text-stone-800">{selected.actual_harvested_in_kg || selected.prospect_harvest_in_kg || 0} kg</b></div>
              <div><span className="block text-stone-500">Pickup area</span><b className="mt-1 block text-stone-800">{selected.product_location || selected.farm?.farm_location || "Lantapan"}</b></div>
              <div><span className="block text-stone-500">Seller contact</span><b className="mt-1 block text-stone-800">{selected.farm?.user?.mobile_number || "Ask after checkout"}</b></div>
            </div>
            <div className="product-kilo-picker"><label>Choose kilos</label><div><button onClick={() => setQuantity((value) => Math.max(1, Number(value) - 1))}>−</button><input value={quantity} onChange={(event) => setQuantity(Math.min(kilosLeft(selected), Math.max(1, Number(event.target.value))))} inputMode="numeric"/><button disabled={quantity >= kilosLeft(selected)} onClick={() => setQuantity((value) => Math.min(kilosLeft(selected), Number(value) + 1))}>+</button><span>kg</span></div></div>
            {modalMessage && <p className="product-modal-warning">{modalMessage}</p>}
            {kilosLeft(selected) === 0 && <p className="product-modal-warning">This harvest is sold out and cannot be added to your basket.</p>}
            <div className="product-modal-actions"><button type="button" className="!border !border-stone-300 !bg-white !text-stone-700" onClick={() => setSelected(null)}>Continue browsing</button><button disabled={kilosLeft(selected) === 0} onClick={addSelected}>{kilosLeft(selected) === 0 ? "Sold out" : "Add to basket"}</button></div>
          </div>
        </div>
      </div>}
    </div>
  );
}
