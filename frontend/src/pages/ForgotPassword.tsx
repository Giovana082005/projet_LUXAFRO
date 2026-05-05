import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  //Récupérer le CSRF cookie avant les requêtes POST
  const getCsrfCookie = async () => {
    await fetch("http://localhost:8000/sanctum/csrf-cookie", {
      credentials: "include",
    });
  };

  //Récupérer le token XSRF depuis les cookies
  const getXsrfToken = (): string => {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "XSRF-TOKEN") {
        return decodeURIComponent(value);
      }
    }
    return "";
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      //Récupérer le CSRF cookie
      await getCsrfCookie();

      //Faire la requête de demande de reset
      const res = await fetch("http://localhost:8000/api/forgot-password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getXsrfToken(), 
        },
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
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
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-semibold transition disabled:bg-gray-300"
              >
                {loading ? "⏳ Envoi en cours..." : "Envoyer le lien"}
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