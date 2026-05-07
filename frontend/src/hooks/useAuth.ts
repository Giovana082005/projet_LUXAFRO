import { useEffect, useState } from "react";
import type { User } from "../types/User";
import { API_URL } from "../config/api";

/**
 *Hook centralisé pour gérer l'authentification
 * 
 * Expose :
 * - user : l'utilisateur connecté (ou null)
 * - loading : true pendant la vérification initiale
 * - isAuthenticated : true si user connecté
 * - isAdmin : true si user a le rôle administrateur
 * - refresh : fonction pour re-vérifier l'auth (utile après login/logout)
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  //Vérifie si l'utilisateur est connecté en appelant /api/me
  const checkAuth = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/me`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  //Vérification automatique au montage du composant
  useEffect(() => {
    checkAuth();
  }, []);

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === "administrateur";

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    refresh: checkAuth, //pour forcer une nouvelle vérification
  };
}