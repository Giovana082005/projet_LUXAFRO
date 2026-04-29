import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { AuthResponse } from "../types/User";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

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
        // Stocker le token
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setSuccess(true);
        setMessage(" Compte créé avec succès !");
        
        // Rediriger vers /login après 2 secondes
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch {
      setMessage("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Inscription</h2>

        {!success ? (
          // Formulaire d'inscription
          <>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nom complet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                type="password"
                placeholder="Mot de passe (min. 6 caractères)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg font-semibold transition disabled:bg-gray-300"
              >
                {loading ? " Inscription..." : "S'inscrire"}
              </button>
            </div>

            {message && (
              <p className="mt-4 text-center text-red-600">{message}</p>
            )}

            <p className="mt-6 text-center text-gray-600">
              Déjà un compte ?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Se connecter
              </Link>
            </p>
          </>
        ) : (
          // Message de succès
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-300 rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-2">
                 Inscription réussie !
              </h3>
              <p className="text-gray-700">
                Votre compte a été créé avec succès.
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Redirection vers la page de connexion...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;