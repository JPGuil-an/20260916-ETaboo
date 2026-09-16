import { Outlet } from "react-router-dom";
import AppShell from "../../components/AppShell.jsx";
import RoleGuard from "../../components/RoleGuard.jsx";
import { USER_TYPES } from "../../auth/roles.js";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "grid" },
  { to: "/admin/products/srp", label: "Price Control", icon: "chart" },
  { to: "/admin/products/approved", label: "Products", icon: "bag" },
  { to: "/admin/farmers/profile", label: "Farmers", icon: "farm" },
  { to: "/admin/croprecords", label: "Crop Records", icon: "chart" },
  { to: "/admin/supported/barangay", label: "Barangays", icon: "pin" },
  { to: "/admin/users/all", label: "Users", icon: "users" },
  { to: "/admin/report/generate", label: "Reports", icon: "receipt" },
];

export default function AdminLayout() {
  return (
    <RoleGuard allowedTypes={[USER_TYPES.ADMIN]}>
      <AppShell variant="admin" title="Department of Agriculture" navItems={navItems}>
        <Outlet />
      </AppShell>
    </RoleGuard>
  );
}
