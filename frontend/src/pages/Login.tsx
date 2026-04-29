import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { User, AuthResponse } from "../types/User";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Erreur login");
        setUser(null);
      } else {
        // Stocker le token
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setMessage(" Connexion réussie !");
      }
    } catch {
      setMessage("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("auth_token");

    try {
      await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });
    } catch {
      console.error("Erreur lors de la déconnexion");
    } finally {
      // Nettoyer le localStorage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      setUser(null);
      setMessage("Déconnexion réussie");
      // Retourner à l'accueil
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Connexion</h2>

        {!user ? (
          // Formulaire de connexion
          <>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-semibold transition disabled:bg-gray-300"
              >
                {loading ? " Connexion..." : "Se connecter"}
              </button>
            </div>

            {message && (
              <p className="mt-4 text-center text-red-600">{message}</p>
            )}

            <p className="mt-6 text-center text-gray-600">
              Pas encore de compte ?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                S'inscrire
              </Link>
            </p>
          </>
        ) : (
          // Affichage utilisateur connecté + bouton déconnexion
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-300 rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2">
                 Vous êtes connecté(e)
              </h3>
              <p className="text-gray-700">👤 {user.name}</p>
              <p className="text-gray-600 text-sm">📧 {user.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg font-semibold transition"
            >
              Se déconnecter
            </button>

            <Link
              to="/"
              className="block text-center text-blue-500 hover:underline"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;