import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

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
      const res = await fetch("http://localhost:8000/api/me", {
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

  // Pendant la vérification : afficher un loader
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p className="text-xl">...</p>
      </div>
    );
  }

  // Si non connecté : rediriger vers /login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si connecté : afficher la page
  return <>{children}</>;
}

export default ProtectedRoute;