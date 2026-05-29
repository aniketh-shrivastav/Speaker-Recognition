import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/store/authStore";
import type { Role } from "@/types";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: Role;
};

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
