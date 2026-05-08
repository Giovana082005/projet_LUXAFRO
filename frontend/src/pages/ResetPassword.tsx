import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { API_URL, getCsrfCookie, getAuthHeaders } from "../config/api";
import Spinner from "../components/Spinner";
const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (!tokenParam || !emailParam) {
      setMessage("Lien invalide. Veuillez refaire une demande.");
      return;
    }

    setToken(tokenParam);
    setEmail(emailParam);
  }, [searchParams]);

  const handleSubmit = async () => {
    if (password.length < 6) {
      setMessage("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (password !== passwordConfirmation) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Récupérer le CSRF cookie
      await getCsrfCookie();

      // Faire la requête de reset
      const res = await fetch(`${API_URL}/api/reset-password`, {
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          email,
          token,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Erreur lors de la réinitialisation");
      } else {
        setSuccess(true);
        setMessage(data.message);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
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
          Nouveau mot de passe
        </h2>

        {!success ? (
          <>
            <p className="text-gray-600 text-center mb-6">
              Entrez votre nouveau mot de passe pour <strong>{email}</strong>
            </p>

            <div className="space-y-4">
              <input
                type="password"
                placeholder="Nouveau mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full p-3 border border-gray-700 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />

              <input
                type="password"
                placeholder="Confirmer le mot de passe"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
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
                    <span>Réinitialisation...</span>
                  </div>
                ) : (
                  "Réinitialiser mon mot de passe"
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
                Mot de passe réinitialisé !
              </h3>
              <p className="text-gray-700">{message}</p>
              <p className="text-sm text-gray-500 mt-4">
                Redirection vers la connexion dans 3 secondes...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;