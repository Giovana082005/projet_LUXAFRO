import { useState } from "react";
import type { User, AuthResponse } from "../types/User";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

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
        // Stocker le token dans le navigateur
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setMessage("✅ Connexion réussie !");
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
      // Supprimer les données locales même en cas d'erreur
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      setUser(null);
      setMessage("Déconnexion réussie");
    }
  };

  return (
    <div>
      <h2>Connexion</h2>

      {!user ? (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <br />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <br />

          <button onClick={handleLogin} disabled={loading}>
            {loading ? "⏳ Connexion..." : "Se connecter"}
          </button>
        </>
      ) : (
        <div>
          <h3>Utilisateur connecté :</h3>
          <p>👤 {user.name}</p>
          <p>📧 {user.email}</p>
          <button onClick={handleLogout}>Se déconnecter</button>
        </div>
      )}

      <p>{message}</p>
    </div>
  );
}

export default Login;