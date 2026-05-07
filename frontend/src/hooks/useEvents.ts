import { useEffect, useState } from "react";
import type { Event } from "../types/Event";
import { API_URL } from "../config/api";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  //état : true si l'API a renvoyé une erreur 401 (pas connecté)
  const [requiresAuth, setRequiresAuth] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    setRequiresAuth(false); //Réinitialiser à chaque appel

    try {
      const res = await fetch(`${API_URL}/api/events`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      //Cas spécifique : utilisateur non authentifié
      if (res.status === 401) {
        setRequiresAuth(true);
        return;
      }

      // Autres erreurs HTTP (500, 404, etc.)
      if (!res.ok) {
        throw new Error("Erreur lors du chargement des événements");
      }

      const data = await res.json();
      setEvents(data);
    } catch (err) {
      setError("Impossible de charger les événements");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, loading, error, requiresAuth, refresh: fetchEvents };
}