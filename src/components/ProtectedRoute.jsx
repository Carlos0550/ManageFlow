import { Navigate } from "react-router-dom";
import { useAppContext } from "../context";

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAppContext();

  if (isAuthenticated === false) {
    return <Navigate to="/" replace />;
  }

  return children;
}
