import { useState, useEffect, useRef } from "react"; // 🆕 useRef
import { useNavigate, Link, useLocation } from "react-router-dom";
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

  // 🎯 Message et URL de provenance
  const location = useLocation();
  const fromMessage = typeof location.state?.message === "string"
    ? location.state.message
    : undefined;
  const fromUrl = typeof location.state?.from === "string"
    ? location.state.from
    : undefined;

  // 🎯 Context d'auth
  const { user, loading: authLoading, refresh } = useAuth();

  // 🆕 Flag pour distinguer "déjà connecté au chargement" vs "vient de se logger"
  const justLoggedIn = useRef(false);

  // 🎯 Redirection automatique si DÉJÀ connecté au chargement
  // (mais PAS si on vient de se logger → géré dans handleLogin)
  useEffect(() => {
    if (!authLoading && user && !justLoggedIn.current) {
      redirectByRole(user);
    }
  }, [user, authLoading]);

  // 🔀 Rediriger selon le rôle
  const redirectByRole = (user: User) => {
    if (user.role === "administrateur") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  // 🔐 Login
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
        // 🆕 On signale qu'on vient de se logger
        // → empêche le useEffect de rediriger à sa place
        justLoggedIn.current = true;

        await refresh(); // Met à jour le Context

        // 🎯 Redirection prioritaire :
        // 1. Si on vient d'une page spécifique → on y retourne
        // 2. Sinon → redirection selon le rôle
        if (fromUrl) {
          navigate(fromUrl);
        } else {
          redirectByRole(data.user);
        }
      }
    } catch (err) {
      console.error("❌ Erreur login:", err);
      setMessage("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Connexion</h2>

        {/* 🎯 Message contextuel si on vient d'une page protégée */}
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