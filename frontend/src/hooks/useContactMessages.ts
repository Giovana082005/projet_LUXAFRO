import { useState } from "react";
import type { CreateContactMessage } from "../types/ContactMessage";
import { API_URL, getCsrfCookie, getAuthHeaders } from "../config/api";

/**
 * Hook de gestion des messages de contact (côté utilisateur)
 */
export function useContactMessages() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Envoyer un message via le formulaire de contact public
   */
  const createMessage = async (data: CreateContactMessage) => {
    setLoading(true);
    setError("");

    try {
      await getCsrfCookie();

      const res = await fetch(`${API_URL}/api/contacts`, {
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Erreur lors de l'envoi du message");
      }

      return { success: true, contact: result.contact };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
      console.error(err);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Permet de réinitialiser l'erreur (utile quand l'utilisateur retape)
   */
  const clearError = () => setError("");

  return {
    loading,
    error,
    createMessage,
    clearError,
  };
}