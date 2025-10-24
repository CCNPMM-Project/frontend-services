import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuthContext } from "../contexts/AuthContext";

const MainLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  // Hàm logout chung
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col transition-all duration-300">
      <Header user={user} onLogout={handleLogout} />
      <main className="mt-10 flex-grow">
        <Outlet /> {/* Nơi render các page con như Profile, ViewResume */}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;