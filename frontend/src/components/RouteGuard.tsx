import { Navigate, Outlet, useLocation } from "react-router-dom";
import { localDB, type UserRole } from "../utils/localDB";

export function RouteGuard({ allowedRoles }: { allowedRoles: UserRole[] }) {
  const location = useLocation();
  const user = localDB.getCurrentUser();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!allowedRoles.includes(user.role)) {
    const destination = user.role === "seller" ? "/seller/dashboard" : user.role === "admin" ? "/admin/dashboard" : "/profile";
    return <Navigate to={destination} replace />;
  }
  return <Outlet />;
}
