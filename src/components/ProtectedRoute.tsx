import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner with background ring */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-12 h-12 border-4 border-indigo-100 rounded-full"></div>
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          </div>

          {/* Brand & Status */}
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-2xl font-bold bg-indigo-900 bg-clip-text text-transparent tracking-tight">
              Vocantara
            </h1>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
              <p className="text-sm font-medium text-gray-500">
                Menyiapkan kosa kata Anda...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
