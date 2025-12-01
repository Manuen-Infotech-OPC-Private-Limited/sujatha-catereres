import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show nothing until user data loads (prevents flicker)
  if (loading) return null;

  // If not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // If logged in → allow access
  return children;
};

export default ProtectedRoute;
