import { useState } from "react";
import type { AuthResponse } from "../types/User";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data: AuthResponse = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Erreur inscription");
      } else {
        // Stocker le token dans le navigateur
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage("Compte créé avec succès !");
      }
    } catch {
      setMessage("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Inscription</h2>

      <input
        type="text"
        placeholder="Nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
      />

      <br />

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

      <button onClick={handleRegister} disabled={loading}>
        {loading ? "⏳ Inscription..." : "S'inscrire"}
      </button>

      <p>{message}</p>
    </div>
  );
}

export default Register;