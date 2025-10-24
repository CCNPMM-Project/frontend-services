import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  // Nếu đang loading, hiển thị loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Nếu đã đăng nhập, redirect về home
  if (user) {
    return <Navigate to="/home" replace />;
  }

  // Nếu chưa đăng nhập, hiển thị component con
  return children;
};

export default PublicRoute;
