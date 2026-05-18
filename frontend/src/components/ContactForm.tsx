import { useState } from "react";
import { Mail, Send, User, MessageSquare, CheckCircle2 } from "lucide-react";
import { useContactMessages } from "../hooks/useContactMessages";
import Spinner from "./Spinner";

const MESSAGE_MAX_LENGTH = 1000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RAISON_OPTIONS = [
  { value: "question", label: "Question" },
  { value: "suggestion", label: "Suggestion" },
  { value: "probleme", label: "Problème technique" },
  { value: "partenariat", label: "Partenariat" },
  { value: "autre", label: "Autre" },
];

interface FieldErrors {
  email?: string;
  message?: string;
}

function ContactForm() {
  const { createMessage, loading, error, clearError } = useContactMessages();

  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    raison: "",
    message: "",
  });

  /**
   * Valide les champs et retourne un objet d'erreurs.
   * Vide = formulaire valide.
   */
  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};

    if (formData.email && !EMAIL_REGEX.test(formData.email)) {
      errors.email = "Veuillez entrer un email valide";
    }

    if (formData.message.length > MESSAGE_MAX_LENGTH) {
      errors.message = `Le message ne doit pas dépasser ${MESSAGE_MAX_LENGTH} caractères`;
    }

    return errors;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Nettoyer les messages quand l'utilisateur retape
    if (success) setSuccess(false);
    if (error) clearError();
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation custom
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const result = await createMessage(formData);

    if (result.success) {
      setSuccess(true);
      setFormData({ nom: "", email: "", raison: "", message: "" });
      setFieldErrors({});
    }
  };

  const messageLength = formData.message.length;
  const isMessageTooLong = messageLength > MESSAGE_MAX_LENGTH;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8"
      noValidate
    >
      {/* SUCCESS */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
          <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-800 font-semibold text-sm">
              Message envoyé !
            </p>
            <p className="text-green-700 text-sm mt-0.5">
              Nous vous répondrons sous 48h.
            </p>
          </div>
        </div>
      )}

      {/* ERREUR GLOBALE */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm font-medium">❌ {error}</p>
        </div>
      )}

      {/* NOM */}
      <div className="mb-5">
        <label
          htmlFor="nom"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Nom <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
            placeholder="Votre nom"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
        </div>
      </div>

      {/* EMAIL */}
      <div className="mb-5">
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Email <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="vous@email.com"
            aria-invalid={!!fieldErrors.email}
            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-shadow ${
              fieldErrors.email
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
        </div>
        {fieldErrors.email && (
          <p className="mt-1.5 text-xs text-red-600">{fieldErrors.email}</p>
        )}
      </div>

      {/* RAISON */}
      <div className="mb-5">
        <label
          htmlFor="raison"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Raison <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MessageSquare
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <select
            id="raison"
            name="raison"
            value={formData.raison}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-shadow"
          >
            <option value="">Sélectionnez une raison</option>
            {RAISON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MESSAGE */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-gray-900"
          >
            Message <span className="text-red-500">*</span>
          </label>
          {/* Compteur de caractères */}
          <span
            className={`text-xs font-medium ${
              isMessageTooLong
                ? "text-red-600"
                : messageLength > MESSAGE_MAX_LENGTH * 0.9
                ? "text-orange-600"
                : "text-gray-500"
            }`}
          >
            {messageLength} / {MESSAGE_MAX_LENGTH}
          </span>
        </div>

        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          maxLength={MESSAGE_MAX_LENGTH + 50}
          placeholder="Écrivez votre message..."
          aria-invalid={!!fieldErrors.message}
          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-y transition-shadow ${
            fieldErrors.message || isMessageTooLong
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
        />
        {fieldErrors.message && (
          <p className="mt-1.5 text-xs text-red-600">{fieldErrors.message}</p>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-end pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading || isMessageTooLong}
          className="inline-flex items-center space-x-2 bg-blue-950 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Spinner size="sm" color="white" />
              <span>Envoi en cours...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Envoyer le message</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default ContactForm;
