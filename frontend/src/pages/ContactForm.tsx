import { useState } from "react";
import { Mail, Send, User, MessageSquare } from "lucide-react";

import { useContactMessages } from "../hooks/useContactMessages";

function ContactForm() {
  const { createMessage, loading, error } =
    useContactMessages();

  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    raison: "",
    message: "",
  });

  /**
   * HANDLE CHANGE
   */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * SUBMIT
   */
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSuccess("");

      await createMessage(formData);

      setSuccess(
        "Votre message a bien été envoyé ✅"
      );

      setFormData({
        nom: "",
        email: "",
        raison: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-2">
          Contactez-nous
        </h1>

        <p className="text-gray-600">
          Une question, une suggestion ou un problème ?
          Envoyez-nous un message.
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-lg shadow-sm p-6"
      >
        {/* SUCCESS */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 text-sm">
              {success}
            </p>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">
              ❌ {error}
            </p>
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
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              placeholder="Votre nom"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="vous@email.com"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
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
              className="absolute left-3 top-3 text-gray-400"
            />

            <select
              id="raison"
              name="raison"
              value={formData.raison}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">
                Sélectionnez une raison
              </option>

              <option value="question">
                Question
              </option>

              <option value="suggestion">
                Suggestion
              </option>

              <option value="probleme">
                Problème technique
              </option>

              <option value="partenariat">
                Partenariat
              </option>

              <option value="autre">
                Autre
              </option>
            </select>
          </div>
        </div>

        {/* MESSAGE */}
        <div className="mb-6">
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-gray-900 mb-2"
          >
            Message <span className="text-red-500">*</span>
          </label>

          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            placeholder="Écrivez votre message..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center space-x-2 bg-blue-950 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />

            <span>
              {loading
                ? "Envoi..."
                : "Envoyer le message"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContactForm;