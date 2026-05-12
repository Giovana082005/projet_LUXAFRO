import { useState, useEffect } from "react";
import { useNavigate, Link,useLocation } from "react-router-dom";
import type { User } from "../types/User";
import { API_URL, getCsrfCookie, getAuthHeaders } from "../config/api";
import Spinner from "../components/Spinner";
import { useAuth } from "../hooks/useAuth"; 

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //Message depuis la page précédente (ex: "Connectez-vous pour vous inscrire")
  const location = useLocation();
  const fromMessage = location.state?.message as string | undefined;
  const fromUrl = location.state?.from as string | undefined;

  //Utilisation du Context d'auth
  const { user, loading: authLoading, refresh } = useAuth();

  //Redirection automatique si déjà connecté
  useEffect(() => {
    if (!authLoading && user) {
      redirectByRole(user);
    }
  }, [user, authLoading]);

  //Rediriger selon le rôle
  const redirectByRole = (user: User) => {
    if (user.role === "administrateur") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  //Login
  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      await getCsrfCookie();

      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(),
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Erreur login");
      } else {
        await refresh();
        //Si on vient d'une page spécifique, on y retourne
        if (fromUrl) {
          navigate(fromUrl);
        } else {
          redirectByRole(data.user);
        }
      }
    } catch {
      setMessage("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Connexion</h2>
        {/* Message contextuel si on vient d'une page protégée */}
        {fromMessage && (
          <div className="bg-blue-950/30 border border-blue-500/30 rounded-lg p-3 mb-4 text-center">
            <p className="text-blue-300 text-sm">{fromMessage}</p>
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full p-3 border border-gray-700 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full p-3 border border-gray-700 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-semibold transition disabled:bg-gray-700"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <Spinner size="sm" color="blue" />
                <span>Connexion...</span>
              </div>
            ) : (
              "Se connecter"
            )}
          </button>
        </div>

        {message && (
          <p className="mt-4 text-center text-red-600">{message}</p>
        )}

        <p className="mt-6 text-center text-white">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            S'inscrire
          </Link>
        </p>

        <p className="mt-6 text-center text-gray-600">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Mot de passe oublié ?
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;