import { useEffect, useState } from "react";
import type { Event } from "../types/Event";
import { API_URL } from "../config/api";

/**
 *  Hook pour récupérer UN événement par son ID
 * Utilisé sur la page détail /events/:id
 */
export function useEvent(id: string | undefined) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const fetchEvent = async () => {
    if (!id) {
      setError("ID invalide");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    setNotFound(false);

    try {
      const res = await fetch(`${API_URL}/api/events/${id}`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      // Cas spécifique : 404 (événement n'existe pas)
      if (res.status === 404) {
        setNotFound(true);
        return;
      }

      if (!res.ok) {
        throw new Error("Erreur lors du chargement");
      }

      const data = await res.json();
      setEvent(data);
    } catch (err) {
      setError("Impossible de charger l'événement");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]); //  Re-fetch si l'ID change (utile pour navigation entre events)

  return { event, loading, error, notFound, refresh: fetchEvent };
}