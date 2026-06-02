import { Navigate } from "react-router-dom";

import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/features/auth/selectors";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
