import { useState } from "react";
import type { User } from "../types/User";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Erreur login");
        setUser(null);
      } else {
        setUser(data.user);
        setMessage("Connexion réussie !");
      }
    } catch {
      setMessage("Erreur serveur");
    }
  };

  return (
    <div>
      <h2>Connexion</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />

      <input
        type="password"
        placeholder="Mot de passe"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />

      <button onClick={handleLogin}>Se connecter</button>

      <p>{message}</p>

      {user && (
        <div>
          <h3>Utilisateur connecté :</h3>
          <p>{user.name}</p>
          <p>{user.email}</p>
        </div>
      )}
    </div>
  );
}

export default Login;