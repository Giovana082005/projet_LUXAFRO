import { useEffect, useState } from "react";
import type { Event } from "../types/Event";
import { API_URL } from "../config/api";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/events`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

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

  // On expose les données + une fonction pour rafraîchir
  return { events, loading, error, refresh: fetchEvents };
}