import { Navigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import { homePath } from "../auth/roles.js";

export default function RootRedirect() {
  const { token, userType, portal } = useStateContext();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={homePath(userType, portal)} replace />;
}
