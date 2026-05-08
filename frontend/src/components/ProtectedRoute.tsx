import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { API_URL } from "../config/api";
import Spinner from "./Spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_URL}/api/me`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      setIsAuthenticated(res.ok);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Pendant la vérification : afficher le Spinner
  if (isLoading) {
    return <Spinner fullScreen />;
  }

  // Si non connecté : rediriger vers /login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si connecté : afficher la page
  return <>{children}</>;
}

export default ProtectedRoute;