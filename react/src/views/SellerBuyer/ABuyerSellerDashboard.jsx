import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider";

export default function ABuyerSellerDashboard() {
  const [farmCount, setFarmCount] = useState(0);
  const [pendingOrderCount, setPendingOrderCount] = useState(0);
  const [totalSold, setTotalSold] = useState(0);
  const [brocolli, setBrocolli] = useState(0);
  const [cabbage, setCabbage] = useState(0);
  const [carrot, setCarrot] = useState(0);
  const [tomato, setTomato] = useState(0);
  const { currentUserID } = useStateContext();

  useEffect(() => {
    axiosClient
      .post("/sellerDashboard", { user_ID: currentUserID })
      .then((response) => {
        setFarmCount(response.data.farmcount);
        setPendingOrderCount(response.data.pendingOrderCount);
        setTotalSold(response.data.totalSold);
      })
      .catch(() => {});
  }, [currentUserID]);

  useEffect(() => {
    axiosClient.get("/getPriceRangeSpecific").then(({ data }) => {
      setBrocolli(data.broccoli);
      setCabbage(data.cabbage);
      setCarrot(data.carrot);
      setTomato(data.tomato);
    });
  }, []);

  const stats = [
    { label: "My farms", value: farmCount, to: "/buyer-seller/farms/owned" },
    { label: "Pending orders", value: pendingOrderCount, to: "/buyer-seller/farm/product/orders" },
    { label: "Kg sold", value: totalSold, to: "/seller/center" },
  ];

  const prices = [
    { name: "Broccoli", value: brocolli },
    { name: "Carrot", value: carrot },
    { name: "Cabbage", value: cabbage },
    { name: "Tomato", value: tomato },
  ];

  return (
    <div className="space-y-4 pb-16">
      <section className="rounded-sm bg-gradient-to-r from-shop-700 to-emerald-400 p-5 text-white shadow-card">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/80">Seller Center</p>
        <h1 className="text-2xl font-black">Your shop at a glance</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/buyer-seller/product/add" className="rounded-sm bg-white px-4 py-2 text-sm font-bold text-shop-600">
            Add listing
          </Link>
          <Link to="/seller/center" className="rounded-sm bg-white/15 px-4 py-2 text-sm font-semibold text-white">
            Manage shop
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="rounded-sm bg-white p-4 shadow-card hover:shadow-lift">
            <p className="text-xs text-mall-mute">{s.label}</p>
            <p className="mt-1 text-3xl font-black text-shop-500">{s.value ?? 0}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-sm bg-white p-4 shadow-card">
        <h2 className="text-sm font-bold">DA suggested ceiling prices</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {prices.map((p) => (
            <div key={p.name} className="rounded-sm bg-shop-50 p-3">
              <p className="text-xs text-mall-mute">{p.name}</p>
              <p className="text-lg font-bold text-shop-600">₱{p.value || 0}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
