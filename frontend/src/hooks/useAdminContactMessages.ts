import { useEffect, useState, useCallback } from "react";
import type { ContactMessage } from "../types/ContactMessage";
import { API_URL, getCsrfCookie, getAuthHeaders } from "../config/api";

/**
 * Hook admin : gestion des messages de contact
 * (liste, toggle lu/non-lu, suppression)
 */
export function useAdminContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * Charger la liste des messages
   */
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/contacts`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        throw new Error("Impossible de charger les messages");
      }

      const data = await res.json();
      setMessages(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  /**
   * Toggle lu / non-lu
   * Mise à jour optimiste : on change l'état localement immédiatement,
   * puis on rollback si l'API échoue.
   */
  const toggleRead = async (id: number) => {
    const previous = messages;

    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: !m.is_read } : m))
    );

    try {
      await getCsrfCookie();

      const res = await fetch(`${API_URL}/api/contacts/${id}/read`, {
        method: "PATCH",
        credentials: "include",
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour");

      return { success: true };
    } catch (err) {
      // Rollback en cas d'échec
      setMessages(previous);
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
      return { success: false, message };
    }
  };

  /**
   * Supprimer un message
   * Mise à jour optimiste également.
   */
  const deleteMessage = async (id: number) => {
    const previous = messages;
    setMessages((prev) => prev.filter((m) => m.id !== id));

    try {
      await getCsrfCookie();

      const res = await fetch(`${API_URL}/api/contacts/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Erreur lors de la suppression");

      return { success: true };
    } catch (err) {
      setMessages(previous);
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
      return { success: false, message };
    }
  };

  /**
   * Compteur de messages non lus — utile pour le badge sidebar et le dashboard
   */
  const unreadCount = messages.filter((m) => !m.is_read).length;

  return {
    messages,
    loading,
    error,
    unreadCount,
    fetchMessages,
    toggleRead,
    deleteMessage,
  };
}