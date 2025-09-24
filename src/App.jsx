import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });


  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Router>
      <div className={isDarkMode ? "dark" : ""}>

        {/* Dark mode toggle */}
        <button
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <SunIcon className="h-6 w-6 text-yellow-400" />
          ) : (
            <MoonIcon className="h-6 w-6 text-gray-700" />
          )}
        </button>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;