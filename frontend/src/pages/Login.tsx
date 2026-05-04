import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { User, AuthResponse } from "../types/User";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      setCheckingAuth(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();

        if (data.user.role === "administrateur") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
      }
    } catch {
      console.error("Erreur token");
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Erreur login");
      } else {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.role === "administrateur") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
    } catch {
      setMessage("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <h2>Connexion</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Connexion..." : "Se connecter"}
      </button>

      {message && <p>{message}</p>}

      <Link to="/register">S'inscrire</Link>
    </div>
  );
}

export default Login;