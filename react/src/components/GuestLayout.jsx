import {Navigate, Outlet} from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import { homePath } from "../auth/roles.js";

export default function GuestLayout() {
  const { token, userType, portal } = useStateContext();

  if (token) {
    return <Navigate to={homePath(userType, portal)} replace />;
  }

  return (
    <div id="guestLayout">
      <Outlet />
    </div>
  );
}
