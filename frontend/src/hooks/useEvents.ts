import { useEffect, useState } from "react";
import type { Event } from "../types/Event";
import { API_URL } from "../config/api";
import { useAuth } from "./useAuth";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requiresAuth, setRequiresAuth] = useState(false);

  //On récupère l'utilisateur connecté pour réagir aux changements
  const { user, loading: authLoading } = useAuth();

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    setRequiresAuth(false);

    try {
      const res = await fetch(`${API_URL}/api/events`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (res.status === 401) {
        setRequiresAuth(true);
        setEvents([]); //vider la liste si pas autorisé
        return;
      }

      if (!res.ok) {
        throw new Error("Erreur lors du chargement des événements");
      }

      const data = await res.json();
      setEvents(data);
    } catch (err) {
      setError("Impossible de charger les événements");
      setEvents([]); //Vider la liste en cas d'erreur
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //Re-fetch à chaque changement d'utilisateur (login/logout)
  useEffect(() => {
    //On attend que useAuth ait fini de vérifier
    if (!authLoading) {
      fetchEvents();
    }
  }, [user?.id, authLoading]);

  return { events, loading, error, requiresAuth, refresh: fetchEvents };
}