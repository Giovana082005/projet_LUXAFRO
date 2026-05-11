import { useEffect, useState } from "react";
import type { Event } from "../types/Event";
import { API_URL } from "../config/api";
import { useAuth } from "./useAuth";

/**
 * Hook pour récupérer les événements
 * @param category - Optionnel : filtre par nom de catégorie 
 */
export function useEvents(category?: string) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requiresAuth, setRequiresAuth] = useState(false);

  const { user, loading: authLoading } = useAuth();

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    setRequiresAuth(false);

    try {
      // Construire l'URL avec le paramètre category si présent
      const url = new URL(`${API_URL}/api/events`);
      if (category) {
        url.searchParams.append("category", category);
      }

      const res = await fetch(url.toString(), {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (res.status === 401) {
        setRequiresAuth(true);
        setEvents([]);
        return;
      }

      if (!res.ok) {
        throw new Error("Erreur lors du chargement des événements");
      }

      const data = await res.json();
      setEvents(data);
    } catch (err) {
      setError("Impossible de charger les événements");
      setEvents([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch quand l'utilisateur OU la catégorie change
  useEffect(() => {
    if (!authLoading) {
      fetchEvents();
    }
  }, [user?.id, authLoading, category]); 

  return { events, loading, error, requiresAuth, refresh: fetchEvents };
}