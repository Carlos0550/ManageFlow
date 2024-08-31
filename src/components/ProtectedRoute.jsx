import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context';

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAppContext();
  console.log("Ejecuta el protector de rutas")
  if (isAuthenticated === false) {
    return <Navigate to="/" replace />;
  }
  return children;
}
