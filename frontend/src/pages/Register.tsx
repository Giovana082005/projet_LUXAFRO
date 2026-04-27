import { useState } from "react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Erreur inscription");
      } else {
        setMessage("Compte créé !");
      }
    } catch {
      setMessage("Erreur serveur");
    }
  };

  return (
    <div>
      <h2>Inscription</h2>

      <input
        type="text"
        placeholder="Nom"
        onChange={(e) => setName(e.target.value)}
      />

      <br />

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

      <button onClick={handleRegister}>S'inscrire</button>

      <p>{message}</p>
    </div>
  );
}

export default Register;
