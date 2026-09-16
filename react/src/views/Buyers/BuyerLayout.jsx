import { Outlet } from "react-router-dom";
import AppShell from "../../components/AppShell.jsx";
import RoleGuard from "../../components/RoleGuard.jsx";
import { USER_TYPES } from "../../auth/roles.js";

const navItems = [
  { to: "/buyer/home", label: "Home", icon: "home" },
  { to: "/buyer/order/products", label: "Shop", icon: "bag" },
  { to: "/buyer/orders", label: "My Orders", icon: "receipt" },
];

export default function BuyerLayout() {
  return (
    <RoleGuard allowedTypes={[USER_TYPES.BUYER]}>
      <AppShell variant="buyer" title="Buyer marketplace" navItems={navItems}>
        <Outlet />
      </AppShell>
    </RoleGuard>
  );
}
