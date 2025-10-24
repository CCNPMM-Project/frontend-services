import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuthContext();

  // Nếu đang loading, hiển thị loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Nếu chưa đăng nhập, redirect về login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, hiển thị component con
  return children;
};

export default ProtectedRoute;
