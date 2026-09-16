import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import { roleLabel } from "../auth/roles.js";
import UiIcon from "./UiIcon.jsx";
import CartDrawer from "./shop/CartDrawer.jsx";

const iconFor = (item) => item.icon || "grid";

export default function AppShell({ variant = "admin", title, navItems = [], roleSwitch = null, children }) {
  const { userName, userType, setToken, setUserName, setCurrentUserID, setUserType, notification, cart, clearCart } = useStateContext();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const isMall = variant === "buyer" || variant === "seller";

  const doLogout = () => {
    setLoggingOut(true);
    axiosClient.post("/logout").catch(() => {}).finally(() => {
      setToken(null);
      setUserName(null);
      setCurrentUserID(null);
      setUserType(null);
      localStorage.clear();
      clearCart();
      setLoggingOut(false);
      setLogoutOpen(false);
      navigate("/login");
    });
  };

  const submitSearch = (event) => {
    event.preventDefault();
    window.dispatchEvent(new CustomEvent("etabo:search", { detail: search }));
  };

  const navClass = ({ isActive }) => `app-nav-item ${isActive ? "app-nav-item-active" : ""}`;

  return (
    <div className={`app-shell app-shell-${variant}`}>
      <header className="app-header">
        <div className="app-utility">
          <div className="app-header-inner">
            <span>From Bukidnon farms to your table</span>
            <div className="hidden items-center gap-4 sm:flex">
              <span>Help Centre</span><span>Follow us</span><span className="font-semibold">{roleLabel(userType)} portal</span>
            </div>
          </div>
        </div>
        <div className="app-header-main">
          <div className="app-header-inner gap-3">
            <button type="button" className="app-icon-button lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu"><UiIcon name="menu" /></button>
            <button type="button" onClick={() => navigate(navItems[0]?.to || "/")} className="app-brand">
              <span className="app-brand-mark"><UiIcon name="farm" className="h-6 w-6" /></span>
              <span><b>E-Tabo</b><small>{title}</small></span>
            </button>
            {isMall ? (
              <form onSubmit={submitSearch} className="app-search hidden sm:flex">
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search fresh produce, farms and barangays" />
                <button type="submit" aria-label="Search"><UiIcon name="search" /></button>
              </form>
            ) : <div className="hidden flex-1 lg:block" />}
            {variant === "buyer" && <button type="button" className="app-cart-button" onClick={() => setCartOpen(true)} aria-label={`Open cart with ${cart.length} products`}><UiIcon name="cart" />{cart.length > 0 && <span>{cart.reduce((sum, item) => sum + Number(item.quantity), 0)}</span>}</button>}
            <button type="button" className="app-icon-button hidden sm:grid" aria-label="Notifications"><UiIcon name="bell" /></button>
            <div className="relative hidden md:block">
              <button type="button" onClick={() => setAccountOpen((value) => !value)} className="app-account">
                <span className="app-avatar">{(userName || "U").slice(0, 1).toUpperCase()}</span>
                <span className="min-w-0 text-left"><b>{userName || "My account"}</b><small>{roleLabel(userType)}</small></span>
              </button>
              {accountOpen && <div className="app-account-menu">{roleSwitch}<button onClick={() => setLogoutOpen(true)}><UiIcon name="logout" /> Log out</button></div>}
            </div>
          </div>
          {isMall && <div className="app-search-mobile sm:hidden"><form onSubmit={submitSearch} className="app-search"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search in E-Tabo"/><button aria-label="Search"><UiIcon name="search" /></button></form></div>}
        </div>
        {isMall && <nav className="app-top-nav"><div className="app-header-inner">{navItems.map((item) => <NavLink key={item.to} to={item.to} className={navClass}><UiIcon name={iconFor(item)} />{item.label}</NavLink>)}</div></nav>}
      </header>

      <div className={`app-layout ${isMall ? "app-layout-mall" : ""}`}>
        {!isMall && <aside className="app-sidebar">
          <div className="app-sidebar-heading"><span>Workspace</span><small>Manage E-Tabo</small></div>
          <nav>{navItems.map((item) => <NavLink key={item.to} to={item.to} className={navClass}><UiIcon name={iconFor(item)} /><span>{item.label}</span><UiIcon name="chevron" className="ml-auto h-4 w-4 opacity-40" /></NavLink>)}</nav>
          <div className="app-sidebar-help"><b>Need a quick report?</b><span>Export marketplace activity from the Reports page.</span></div>
        </aside>}
        <main className="market-main">
          {notification && <div className="app-notification">{notification}</div>}
          {children}
        </main>
      </div>

      {menuOpen && <div className="app-drawer-wrap lg:hidden">
        <button className="app-drawer-backdrop" onClick={() => setMenuOpen(false)} aria-label="Close menu" />
        <aside className="app-drawer">
          <div className="app-drawer-profile"><span className="app-avatar">{(userName || "U")[0]}</span><div><b>{userName || "My account"}</b><small>{roleLabel(userType)}</small></div></div>
          <nav>{navItems.map((item) => <NavLink key={item.to} to={item.to} onClick={() => setMenuOpen(false)} className={navClass}><UiIcon name={iconFor(item)} />{item.label}<UiIcon name="chevron" className="ml-auto h-4 w-4" /></NavLink>)}</nav>
          <div className="app-drawer-footer">{roleSwitch}<button onClick={() => setLogoutOpen(true)}><UiIcon name="logout" /> Log out</button></div>
        </aside>
      </div>}

      {isMall && <nav className="app-bottom-nav">{navItems.slice(0, 5).map((item) => <NavLink key={item.to} to={item.to} className={({isActive}) => isActive ? "active" : ""}><UiIcon name={iconFor(item)} /><span>{item.label}</span></NavLink>)}</nav>}

      {variant === "buyer" && <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />}

      {logoutOpen && <div className="app-modal-backdrop"><div className="app-modal">
        <span className="app-modal-icon"><UiIcon name="logout" /></span><h2>Log out of E-Tabo?</h2><p>You’ll need to sign in again to access your marketplace account.</p>
        <div><button onClick={() => setLogoutOpen(false)} className="app-btn-secondary">Stay signed in</button><button disabled={loggingOut} onClick={doLogout} className="app-btn-primary">{loggingOut ? "Logging out…" : "Log out"}</button></div>
      </div></div>}
    </div>
  );
}
