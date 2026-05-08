import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "../types/User";
import { API_URL } from "../config/api";

//CRÉATION DU CONTEXT (le canal de diffusion)


//Type décrivant ce que le context expose
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  refresh: () => Promise<void>;
}

//Le context est créé avec une valeur par défaut undefined
//(forcera l'utilisation dans un Provider)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//LE PROVIDER (émetteur qui diffuse)

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Fournit l'état d'authentification à toute l'application
 * 
 */
export function AuthProvider({ children }: AuthProviderProps) {
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

  //Vérification automatique au démarrage de l'app
  useEffect(() => {
    checkAuth();
  }, []);

  //Valeurs dérivées
  const isAuthenticated = user !== null;
  const isAdmin = user?.role === "administrateur";

  //La "valeur" diffusée par le Provider
  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    refresh: checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

//HOOK PERSONNALISÉ (récepteur)


/**
 *Hook pour utiliser l'auth dans n'importe quel composant
 * 
 */
export function useAuth() {
  const context = useContext(AuthContext);

  //vérifie qu'on est bien dans un AuthProvider
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans un <AuthProvider>");
  }

  return context;
}