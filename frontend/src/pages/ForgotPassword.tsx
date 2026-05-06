import { useState } from "react";
import { Link } from "react-router-dom";
import { API_URL, getCsrfCookie, getAuthHeaders } from "../config/api";
import Spinner from "../components/Spinner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      // Récupérer le CSRF cookie
      await getCsrfCookie();

      // Faire la requête de demande de reset
      const res = await fetch(`${API_URL}/api/forgot-password`, {
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(),
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Erreur");
      } else {
        setSuccess(true);
        setMessage(data.message);
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
        <h2 className="text-3xl font-bold mb-6 text-center">
          Mot de passe oublié
        </h2>

        {!success ? (
          <>
            <p className="text-gray-600 text-center mb-6">
              Entrez votre email pour recevoir un lien de réinitialisation
            </p>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full p-3 border border-gray-700 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-semibold transition disabled:bg-gray-700"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Spinner size="sm" color="blue" />
                    <span>Envoi en cours...</span>
                  </div>
                ) : (
                  "Envoyer le lien"
                )}
              </button>
            </div>

            {message && (
              <p className="mt-4 text-center text-red-600">{message}</p>
            )}

            <p className="mt-6 text-center text-gray-600">
              <Link to="/login" className="text-blue-500 hover:underline">
                ← Retour à la connexion
              </Link>
            </p>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-300 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">
                ✅ Email envoyé !
              </h3>
              <p className="text-gray-700">{message}</p>
              <p className="text-sm text-gray-500 mt-4">
                Vérifiez votre boîte mail (et spams) pour le lien.
              </p>
            </div>

            <Link
              to="/login"
              className="block text-center text-blue-500 hover:underline"
            >
              ← Retour à la connexion
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;