import { Link, Outlet } from "react-router-dom";
import AppShell from "../../../components/AppShell.jsx";
import RoleGuard from "../../../components/RoleGuard.jsx";
import { USER_TYPES, canSwitchTradeRoles } from "../../../auth/roles.js";
import { useStateContext } from "../../../context/ContextProvider.jsx";

const navItems = [
  { to: "/buyer-seller/role/buyer", label: "Shop", icon: "bag" },
  { to: "/buyer-seller/orders", label: "My Orders", icon: "receipt" },
];

export default function LayoutBuyer() {
  const { userType } = useStateContext();
  const switcher = canSwitchTradeRoles(userType) ? (
    <Link
      to="/buyer-seller/dashboard"
      className="app-role-switch"
    >
      Seller mode
    </Link>
  ) : null;

  return (
    <RoleGuard allowedTypes={[USER_TYPES.BUYER_SELLER]}>
      <AppShell variant="buyer" title="Buyer mode" navItems={navItems} roleSwitch={switcher}>
        <Outlet />
      </AppShell>
    </RoleGuard>
  );
}
