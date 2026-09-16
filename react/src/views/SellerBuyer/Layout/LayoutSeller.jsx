import { Link, Outlet } from "react-router-dom";
import AppShell from "../../../components/AppShell.jsx";
import RoleGuard from "../../../components/RoleGuard.jsx";
import { USER_TYPES, canSwitchTradeRoles } from "../../../auth/roles.js";
import { useStateContext } from "../../../context/ContextProvider.jsx";

const navItems = [
  { to: "/buyer-seller/dashboard", label: "Dashboard", icon: "grid" },
  { to: "/seller/center", label: "Seller Center", icon: "store" },
  { to: "/buyer-seller/farms/owned", label: "My Farms", icon: "farm" },
  { to: "/buyer-seller/product/add", label: "Add Product", icon: "plus" },
  { to: "/buyer-seller/farmers/product", label: "Products", icon: "bag" },
  { to: "/buyer-seller/farm/product/orders", label: "Orders", icon: "receipt" },
];

export default function LayoutSeller() {
  const { userType } = useStateContext();
  const switcher = canSwitchTradeRoles(userType) ? (
    <Link
      to="/buyer-seller/role/buyer"
      className="app-role-switch"
    >
      Buyer mode
    </Link>
  ) : null;

  return (
    <RoleGuard allowedTypes={[USER_TYPES.SELLER, USER_TYPES.BUYER_SELLER]}>
      <AppShell variant="seller" title="Seller workspace" navItems={navItems} roleSwitch={switcher}>
        <Outlet />
      </AppShell>
    </RoleGuard>
  );
}
