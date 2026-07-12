import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { ForgotPassword } from "./pages/ForgotPassword";

const AppLayout = () => {
  const location = useLocation();
  const hideHeaderRoutes = ["/login", "/register", "/forgot-password"];

  const handleSignOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100 transition-colors duration-300">
      {!hideHeaderRoutes.includes(location.pathname) && (
        <Header onSignOut={handleSignOut} />
      )}
      <main className="font-sans flex-1 px-0 lg:px-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppLayout />
    </Router>
  );
}
