import { Navigate } from "react-router-dom";

import { useAppSelector } from "@/store/hooks";

import { selectIsAuthenticated } from "@/features/auth/selectors";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
