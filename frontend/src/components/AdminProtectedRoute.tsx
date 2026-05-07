import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Spinner from "./Spinner";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protège une route en vérifiant 2 choses :
 * L'utilisateur est connecté
 * L'utilisateur a le rôle administrateur
 * 
 * Sinon, redirige vers /login
 */
function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  //Pendant la vérification, on affiche un spinner
  //(sinon l'utilisateur est redirigé vers /login pendant une fraction de seconde)
  if (loading) {
    return <Spinner fullScreen />;
  }

  //Pas connecté → redirection login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  //Connecté mais pas admin → redirection accueil
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  //Connecté ET admin → on affiche le contenu protégé
  return <>{children}</>;
}

export default AdminProtectedRoute;