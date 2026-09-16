import { Navigate, useLocation } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import { homePath, toUserType } from "../auth/roles.js";

export default function RoleGuard({ allowedTypes, children }) {
  const { token, userType, portal } = useStateContext();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const type = toUserType(userType);
  const allowed = (allowedTypes || []).map(toUserType);
  if (!allowed.includes(type)) {
    return <Navigate to={homePath(type, portal)} replace />;
  }

  return children;
}
